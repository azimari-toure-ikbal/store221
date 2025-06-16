import { Cart, logVerbose, PaytechResponse } from "@/config";
import { db } from "@/lib/db";
import {
  cartItems,
  carts,
  DBCart,
  DBCartItem,
  products,
  users,
} from "@/lib/db/schema";
import {
  cartItemSchema,
  cartItemsSchema,
  checkoutFormSchema,
  itemOptions,
} from "@/lib/validators";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, ne, or, sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../init";

// --- Helper: Enrich cart items with additional product details ---
export async function enrichCartItems(
  cart: DBCart & { items: DBCartItem[] },
): Promise<Cart> {
  const enrichedItems = await Promise.all(
    cart.items.map(async (item) => {
      const product = await db.query.products.findFirst({
        where: eq(products.id, item.productId),
      });

      if (!product) {
        console.error(
          `Product with id ${item.productId} not found in enrichCartItems`,
        );
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ce produit n'existe pas",
        });
      }

      // console.log("enrichCartItems", item.options);

      const productPrice =
        product.discountedPrice && Number(product.discountedPrice) > 0
          ? Number(product.discountedPrice)
          : Number(product.price);

      return {
        name: product.name,
        productId: product.id,
        image: product.gallery[0],
        price: productPrice,
        quantity: Number(item.quantity),
        stock: Number(product.stock),
        options: {
          tissu: item.options.tissu || "",
          sleevesLength: item.options.sleevesLength || undefined,
          collarType: item.options.collarType || undefined,
          wristsType: item.options.wristsType || undefined,
          pantFit: item.options.pantFit || undefined,
          pantLeg: item.options.pantLeg || undefined,
          size: item.options.size,
          initials: item.options.initials || "",
        },
        productType: product.type,
      };
    }),
  );

  return {
    id: cart.id,
    sessionId: cart.sessionId,
    items: enrichedItems,
  };
}

// --- Helper: Insert cart items into the database ---
export async function populateCartItems(
  cartId: string,
  items: z.infer<typeof cartItemsSchema>,
) {
  for (const item of items) {
    await db.insert(cartItems).values({
      cartId,
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
      options: {
        tissu: item.options.tissu,
        sleevesLength: item.options.sleevesLength,
        collarType: item.options.collarType,
        wristsType: item.options.wristsType,
        pantFit: item.options.pantFit,
        pantLeg: item.options.pantLeg,
        size: item.options.size,
        initials: item.options.initials,
      },
      currency: item.currency,
      rate: String(item.rate),
    });
  }
}

// --- New helper: Merge the anonymous session cart into the authenticated user's context ---
export async function mergeSessionCartIntoUserCart(
  sessionId: string,
  userId: string,
) {
  // Find the anonymous session cart.
  const sessionCart = await db.query.carts.findFirst({
    where: eq(carts.sessionId, sessionId),
    with: { items: true },
  });
  if (!sessionCart) return;

  // Look for an existing active user cart.
  const userCart = await db.query.carts.findFirst({
    where: and(
      eq(carts.userId, userId),
      eq(carts.status, "WAITING_PAYMENT"),
      ne(carts.sessionId, sessionId),
    ),
    with: { items: true },
  });

  if (userCart) {
    // If an active user cart exists, migrate its items to the wishlist.
    // await migrateCartToWishlist(userCart, userId);
    // Optionally mark the existing user cart as abandoned.
    await db
      .update(carts)
      .set({ status: "ABANDONNED" })
      .where(eq(carts.id, userCart.id));
  }

  // Finally, update the session cart to be associated with the authenticated user.
  await db.update(carts).set({ userId }).where(eq(carts.id, sessionCart.id));
}

export const cartsRouter = createTRPCRouter({
  getCarts: privateProcedure.query(async ({ ctx }) => {
    return await db.query.carts.findMany({
      where: ctx.db.role === "USER" ? eq(carts.userId, ctx.db.id) : undefined,
      with: {
        user: true,
        items: {
          with: {
            product: true,
          },
        },
      },
      orderBy: desc(carts.createdAt),
    });
  }),
  getCart: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const { getUser } = getKindeServerSession(); // however you fetch your user
      const kUser = await getUser();
      let user = null;

      if (kUser) {
        user = await db.query.users.findFirst({
          where: eq(users.kindeId, kUser.id),
        });
        if (!user)
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

        // Merge the session (anonymous) cart with the authenticated user.
        await mergeSessionCartIntoUserCart(input.sessionId, user.id);
      }

      // Fetch the final cart based on authentication.
      const cart = await db.query.carts.findFirst({
        where: and(
          user
            ? eq(carts.userId, user.id)
            : eq(carts.sessionId, input.sessionId),
          eq(carts.status, "WAITING_PAYMENT"),
        ),
        with: { items: true },
      });

      if (!cart)
        throw new TRPCError({ code: "NOT_FOUND", message: "Cart not found" });

      // console.log("found cart", cart);

      return enrichCartItems(cart);
    }),
  createCart: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        sessionId: z.string().uuid(),
        cartItems: cartItemsSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { getUser } = getKindeServerSession();
      const kUser = await getUser();

      let userId = null;
      if (kUser) {
        const user = await db.query.users.findFirst({
          where: eq(users.kindeId, kUser.id),
        });
        if (!user)
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        userId = user.id;
      }

      // Ensure there is no active cart for the user or session.
      const existingCart = await db.query.carts.findFirst({
        where: and(
          userId
            ? eq(carts.userId, userId)
            : eq(carts.sessionId, input.sessionId),
          or(
            eq(carts.status, "WAITING_PAYMENT"),
            eq(carts.status, "FORGOTTEN"),
          ),
        ),
      });

      if (existingCart) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Active cart already exists",
        });
      }

      const [cart] = await db
        .insert(carts)
        .values({
          id: input.id,
          sessionId: input.sessionId,
          userId: userId,
          status: "WAITING_PAYMENT",
        })
        .returning();

      // Add the provided cart items.
      await populateCartItems(input.id, input.cartItems);

      return cart;
    }),
  addProductToCart: publicProcedure
    .input(
      z.object({
        cartId: z.string().uuid(),
        item: cartItemSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const cartExists = await db.query.carts.findFirst({
        where: eq(carts.id, input.cartId),
      });

      if (!cartExists) {
        if (logVerbose)
          console.error(
            `Cart with id ${input.cartId} not found in addProductToCart`,
          );
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ce panier n'existe pas",
        });
      }

      const [res] = await db
        .insert(cartItems)
        .values({
          cartId: input.cartId,
          productId: input.item.id,
          quantity: input.item.quantity,
          price: input.item.price,
          options: {
            tissu: input.item.options.tissu,
            sleevesLength: input.item.options.sleevesLength,
            collarType: input.item.options.collarType,
            wristsType: input.item.options.wristsType,
            pantFit: input.item.options.pantFit,
            pantLeg: input.item.options.pantLeg,
            size: input.item.options.size,
            initials: input.item.options.initials,
          },
          currency: input.item.currency,
          rate: String(input.item.rate),
        })
        .returning();

      return res;
    }),
  updateItemQuantity: publicProcedure
    .input(
      z.object({
        cartId: z.string().uuid(),
        productId: z.string().uuid(),
        options: itemOptions,
        quantity: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const cartExists = await db.query.carts.findFirst({
        where: eq(carts.id, input.cartId),
      });

      if (!cartExists) {
        if (logVerbose)
          console.error(
            `Cart with id ${input.cartId} not found in updateItemQuantity`,
          );
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ce panier n'existe pas",
        });
      }

      // const sub = db.$with("subquery").as(
      //   db
      //     .select({
      //       id: carts.id,
      //     })
      //     .from(carts)
      //     .where(eq(carts.id, input.cartId)),
      // );

      // console.log("input", input.options);

      const [res] = await db
        .update(cartItems)
        .set({
          quantity: sql`${cartItems.quantity} + ${input.quantity}`,
        })
        .where(
          and(
            eq(cartItems.cartId, input.cartId),
            eq(cartItems.productId, input.productId),
            eq(cartItems.options, input.options),
          ),
        )
        .returning();

      return res;
    }),
  incrementQuantity: publicProcedure
    .input(
      z.object({
        cartId: z.string().uuid(),
        productId: z.string().uuid(),
        options: itemOptions,
        quantity: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const cartExists = await db.query.carts.findFirst({
        where: eq(carts.id, input.cartId),
      });

      if (!cartExists) {
        if (logVerbose)
          console.error(
            `Cart with id ${input.cartId} not found in incrementQuantity`,
          );
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ce panier n'existe pas",
        });
      }

      const [res] = await db
        .update(cartItems)
        .set({
          quantity: sql`${cartItems.quantity} + ${input.quantity}`,
        })
        .where(
          and(
            eq(cartItems.cartId, input.cartId),
            eq(cartItems.productId, input.productId),
            eq(cartItems.options, input.options),
          ),
        )
        .returning();

      return res;
    }),
  decrementQuantity: publicProcedure
    .input(
      z.object({
        cartId: z.string().uuid(),
        productId: z.string().uuid(),
        options: itemOptions,
        quantity: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const cartExists = await db.query.carts.findFirst({
        where: eq(carts.id, input.cartId),
      });

      if (!cartExists) {
        if (logVerbose)
          console.error(
            `Cart with id ${input.cartId} not found in decrementQuantity`,
          );
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ce panier n'existe pas",
        });
      }

      const [res] = await db
        .update(cartItems)
        .set({
          quantity: sql`${cartItems.quantity} - ${input.quantity}`,
        })
        .where(
          and(
            eq(cartItems.cartId, input.cartId),
            eq(cartItems.productId, input.productId),
            eq(cartItems.options, input.options),
          ),
        )
        .returning();

      return res;
    }),
  removeProductFromCart: publicProcedure
    .input(
      z.object({
        cartId: z.string().uuid(),
        productId: z.string().uuid(),
        options: itemOptions,
      }),
    )
    .mutation(async ({ input }) => {
      const cartExists = await db.query.carts.findFirst({
        where: eq(carts.id, input.cartId),
      });

      if (!cartExists) {
        if (logVerbose)
          console.error(
            `Cart with id ${input.cartId} not found in removeProductFromCart`,
          );
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ce panier n'existe pas",
        });
      }

      const [res] = await db
        .delete(cartItems)
        .where(
          and(
            eq(cartItems.cartId, input.cartId),
            eq(cartItems.productId, input.productId),
            eq(cartItems.options, input.options),
          ),
        )
        .returning();

      return res;
    }),
  dropCart: publicProcedure
    .input(z.object({ cartId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const [res] = await db
        .update(carts)
        .set({ status: "DROPPED" })
        .where(eq(carts.id, input.cartId))
        .returning();

      return res;
    }),
  checkout: publicProcedure
    .input(
      z.object({
        cartId: z.string(),
        cartPrice: z.number(),
        productName: z.string(),
        promoCode: z.string().optional(),
        // currency: z.string(),
        // rate: z.number(),
        // sessionId: z.string(),
        deliveryPrice: z.number(),
        delivery: checkoutFormSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const paymentRequestUrl =
        "https://paytech.sn/api/payment/request-payment";

      const params = {
        item_name: input.productName,
        item_price: input.cartPrice,
        currency: "XOF",
        ref_command: `${input.cartId}-${new Date().toISOString()}`,
        command_name: "Paiement panier store221 via Paytech",
        env: "test",
        ipn_url: "https://ipn.samaweekend.com/v1/paytech/ipn/store221",
        success_url: "https://store221.com/sale-success",
        cancel_url: "https://store221.com/sale-canceled",
        custom_field: JSON.stringify({
          // sessionId: input.sessionId,
          cartId: input.cartId,
          promoCode: input.promoCode,
          delivery: input.delivery,
          deliveryPrice: input.deliveryPrice,
        }),
      };

      if (!process.env.PAYTECH_API || !process.env.PAYTECH_SECRET) {
        console.error("Missing PAYTECH_API or PAYTECH_SECRET");
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        API_KEY: process.env.PAYTECH_API,
        API_SECRET: process.env.PAYTECH_SECRET,
      };

      const response = await fetch(paymentRequestUrl, {
        method: "POST",
        body: JSON.stringify(params),
        headers: headers,
      })
        .then((data) => {
          return data.json();
        })
        .catch((error) => {
          console.error("Error in checkinOut: ", error);
          throw new TRPCError({ code: "UNAUTHORIZED" });
        });

      // console.log("response", response as PaytechResponse);

      return response as PaytechResponse;
    }),
});

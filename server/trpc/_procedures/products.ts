import { logVerbose } from "@/config";
import { db } from "@/lib/db";
import { products, productStatuses } from "@/lib/db/schema/products";
import { productFilterValidator, productFormSchema } from "@/lib/validators";
import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, lte, ne, sql, SQL } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../init";

export const productsRouter = createTRPCRouter({
  getProducts: adminProcedure.query(async ({ ctx }) => {
    return await db.query.products.findMany({
      where: ne(products.status, "DELETED"),
    });
  }),
  createProduct: adminProcedure
    .input(
      z.object({
        values: productFormSchema,
        status: z.enum(productStatuses),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const foundProduct = await db.query.products.findFirst({
        where: eq(products.name, input.values.name),
      });

      if (foundProduct) {
        if (logVerbose)
          console.error(
            `Product with same name ${input.values.name} already exists`,
          );
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Un produit avec le même nom existe déjà",
        });
      }

      const [res] = await db
        .insert(products)
        .values({
          ...input.values,
          stock: Number(input.values.stock),
          status: input.status,
        })
        .returning();

      return res;
    }),
  duplicateProduct: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const foundProduct = await db.query.products.findFirst({
        where: eq(products.id, input.id),
      });

      if (!foundProduct) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      const id = crypto.randomUUID();

      const res = await db
        .insert(products)
        .values({
          ...foundProduct,
          id,
          name: `${foundProduct.name} - ${crypto.randomUUID().slice(0, 5)}`,
          gallery: [],
          status: "DRAFT",
        })
        .returning();

      return res;
    }),
  updateProduct: adminProcedure
    .input(
      z.object({
        id: z.string(),
        values: productFormSchema,
        status: z.enum(productStatuses),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const foundProduct = await db.query.products.findFirst({
        where: eq(products.id, input.id),
      });

      if (!foundProduct) {
        if (logVerbose) console.error(`Product with id ${input.id} not found`);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Le produit n'existe pas",
        });
      }

      const duplicatedProduct = await db.query.products.findFirst({
        where: and(
          eq(products.name, input.values.name),
          ne(products.id, input.id),
        ),
      });

      if (duplicatedProduct) {
        if (logVerbose)
          console.error(
            `Product with same name ${input.values.name} already exists`,
          );
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Un produit avec le même nom existe déjà",
        });
      }

      await db
        .update(products)
        .set({
          ...input.values,
          stock: Number(input.values.stock),
          status: input.status,
        })
        .where(eq(products.id, input.id));

      return true;
    }),
  deleteProduct: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const foundProduct = await db.query.products.findFirst({
        where: eq(products.id, input.id),
      });

      if (!foundProduct) {
        if (logVerbose) console.error(`Product with id ${input.id} not found`);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Le produit n'existe pas",
        });
      }

      await db
        .update(products)
        .set({ status: "DELETED" })
        .where(eq(products.id, input.id));

      return true;
    }),
  getPaginatedProducts: publicProcedure
    .input(
      z.object({
        page: z.number(),
        pageSize: z.number().min(1).default(12),
        filter: productFilterValidator.optional(),
      }),
    )
    .query(async ({ input }) => {
      const { page, pageSize, filter } = input;
      const offset = page * pageSize;

      const filters: SQL[] = [];

      if (filter) {
        if (filter.productType !== "ALL") {
          filters.push(eq(products.type, filter.productType));
        }

        if (filter.collarOptions.length > 0) {
          filters.push(
            sql`${products.options} @> ${JSON.stringify({ collarType: filter.collarOptions })}`,
          );
        }

        if (filter.sleevesOptions.length > 0) {
          filters.push(
            sql`${products.options} @> ${JSON.stringify({ sleevesLength: filter.sleevesOptions })}`,
          );
        }

        if (filter.wristsOptions.length > 0) {
          filters.push(
            sql`${products.options} @> ${JSON.stringify({ wristsType: filter.wristsOptions })}`,
          );
        }

        if (filter.pantFitOptions.length > 0) {
          filters.push(
            sql`${products.options} @> ${JSON.stringify({ pantFit: filter.pantFitOptions })}`,
          );
        }

        if (filter.pantLegOptions.length > 0) {
          filters.push(
            sql`${products.options} @> ${JSON.stringify({ pantLeg: filter.pantLegOptions })}`,
          );
        }

        if (filter.price && filter.price > 0) {
          filters.push(lte(products.price, String(filter.price)));
        }
      }

      const sortMapping: Record<string, any> = {
        "created-desc": desc(products.createdAt),
        "created-asc": asc(products.createdAt),
        "price-asc": asc(products.price),
        "price-desc": desc(products.price),
      };

      const orderByClause =
        filter && filter.sort && sortMapping[filter.sort]
          ? sortMapping[filter.sort]
          : asc(products.createdAt);

      const items = await db
        .select()
        .from(products)
        .where(and(eq(products.status, "PUBLISHED"), ...filters))
        .orderBy(orderByClause)
        .limit(pageSize)
        .offset(offset);

      // Optionally, get the total count for pagination metadata
      const countResult = await db
        .select({
          count: sql<number>`COUNT(*)`.as("count"),
        })
        .from(products);

      // Get the maximum price of the products
      const maxPriceResult = await db
        .select({
          maxPrice: sql<number>`MAX(price)`.as("maxPrice"),
        })
        .from(products);

      const maxPrice = maxPriceResult[0]?.maxPrice ?? 0;

      // Get the minimum price of the products
      const minPriceResult = await db
        .select({
          minPrice: sql<number>`MIN(price)`.as("minPrice"),
        })
        .from(products);

      const minPrice = minPriceResult[0]?.minPrice ?? 0;

      // Get the average price of the products
      const avgPriceResult = await db
        .select({
          avgPrice: sql<number>`AVG(price)`.as("avgPrice"),
        })
        .from(products);

      const avgPrice = avgPriceResult[0]?.avgPrice ?? 0;

      const total = countResult[0]?.count ?? 0;

      return {
        items,
        total,
        page,
        pageSize,
        maxPrice,
        minPrice,
        avgPrice,
      };
    }),
  getProductDetails: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const res = await db.query.products.findFirst({
        where: eq(products.id, input.id),
      });

      return res;
    }),
});

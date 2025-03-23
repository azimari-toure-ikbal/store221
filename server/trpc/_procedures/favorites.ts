import { logVerbose } from "@/config";
import { db } from "@/lib/db";
import { favorites, products, users } from "@/lib/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../init";

export const favoritesRouter = createTRPCRouter({
  toggleFavorite: privateProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        isFav: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const found = await db.query.products.findFirst({
        where: eq(products.id, input.id),
      });

      if (!found) {
        if (logVerbose) console.error("No product found with id", input.id);
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ce produit n'existe pas",
        });
      }

      if (!input.isFav) {
        const [res] = await db
          .insert(favorites)
          .values({
            userId: ctx.db.id,
            productId: input.id,
          })
          .returning();
      } else {
        await db.delete(favorites).where(eq(favorites.productId, input.id));
      }

      return true;
    }),
  isFavorite: privateProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const res = await db.query.favorites.findFirst({
        where: and(
          eq(favorites.userId, ctx.db.id),
          eq(favorites.productId, input.id),
        ),
      });

      return !!res;
    }),
  removeFavorite: privateProcedure
    .input(z.object({ favId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await db.delete(favorites).where(eq(favorites.id, input.favId));
      return true;
    }),
  getUserFavorites: privateProcedure.query(async ({ ctx }) => {
    const res = await db.query.users.findFirst({
      where: eq(users.id, ctx.db.id),
      with: {
        favorites: {
          with: {
            product: true,
          },
        },
      },
    });

    if (!res) {
      if (logVerbose) console.error("No user found with id", ctx.db.id);
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Cet utilisateur n'existe pas",
      });
    }

    return res.favorites;
  }),
});

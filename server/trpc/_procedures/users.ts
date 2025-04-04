import { logVerbose } from "@/config";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { deleteUser } from "@/server/kinde";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "../init";

export const usersRouter = createTRPCRouter({
  getUsers: adminProcedure.query(async ({ ctx }) => {
    return await db.query.users.findMany({
      // where: eq(users.role, "USER"),
    });
  }),
  getCurrentUser: publicProcedure.query(async ({}) => {
    const { getUser } = getKindeServerSession();
    const kUser = await getUser();

    if (!kUser) {
      return null;
    }

    const res = await db.query.users.findFirst({
      where: eq(users.kindeId, kUser.id),
      with: {
        favorites: true,
        addresses: true,
      },
    });

    if (!res) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return res;
  }),
  updateUser: privateProcedure
    .input(z.object({}))
    .mutation(async ({ input, ctx }) => {}),
  deleteUser: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const foundUser = await db.query.users.findFirst({
        where: eq(users.id, input.id),
      });

      if (!foundUser) {
        if (logVerbose) console.error(`User ${input.id} doesn't exist`);
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cet utilisateur n'existe pas",
        });
      }

      try {
        await deleteUser(foundUser.kindeId);
        const [res] = await db
          .delete(users)
          .where(eq(users.id, input.id))
          .returning();

        return res;
      } catch (error) {
        if (logVerbose) console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la suppression du compte [KINDE]",
        });
      }
    }),
});

import { logVerbose } from "@/config";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { deleteUser } from "@/server/kinde";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../init";

export const usersRouter = createTRPCRouter({
  getUsers: adminProcedure.query(async ({ ctx }) => {
    return await db.query.users.findMany({
      where: eq(users.role, "USER"),
    });
  }),
  deleteUser: adminProcedure
    .input(z.object({ id: z.string(), kId: z.string() }))
    .mutation(async ({ input }) => {
      // Check if user exists
      const foundUser = await db.query.users.findFirst({
        where: eq(users.id, input.id),
      });

      if (!foundUser) {
        if (logVerbose) console.error(`User with id ${input} does not exist`);
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Action impossible. Membre introuvable",
        });
      }

      await deleteUser(input.kId);
      await db.delete(users).where(eq(users.id, input.id));

      return input;
    }),
  getCurrentUser: publicProcedure.query(async ({}) => {
    const { getUser } = getKindeServerSession();
    const kUser = await getUser();

    if (!kUser) {
      return undefined;
    }

    const res = await db.query.users.findFirst({
      where: eq(users.kindeId, kUser.id),
      with: {},
    });

    if (!res) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return res;
  }),
});

import { db } from "@/lib/db";
import { userAddresses } from "@/lib/db/schema";
import { checkoutFormSchema } from "@/lib/validators";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../init";

export const userAddressesRouter = createTRPCRouter({
  getUserAddresses: privateProcedure.query(async ({ ctx }) => {
    return await db.query.userAddresses.findMany({
      where: eq(userAddresses.userId, ctx.db.id),
    });
  }),
  createUserAddress: privateProcedure
    .input(checkoutFormSchema)
    .mutation(async ({ input, ctx }) => {
      const [res] = await db
        .insert(userAddresses)
        .values({
          ...input,
          userId: ctx.db.id,
        })
        .returning();

      return res;
    }),
  updateUserAddress: privateProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        values: checkoutFormSchema,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [res] = await db
        .update(userAddresses)
        .set({
          ...input,
        })
        .where(eq(userAddresses.id, input.id))
        .returning();

      return res;
    }),
  deleteUserAddress: privateProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      await db.delete(userAddresses).where(eq(userAddresses.id, input.id));
      return true;
    }),
});

import { db } from "@/lib/db";
import { orders, orderStatuses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, createTRPCRouter, privateProcedure } from "../init";

export const ordersRouter = createTRPCRouter({
  getOrders: privateProcedure.query(async ({ ctx }) => {
    return await db.query.orders.findMany({
      where: ctx.db.role === "USER" ? eq(orders.userId, ctx.db.id) : undefined,
      with: {
        cart: {
          with: {
            items: {
              with: {
                product: true,
              },
            },
          },
        },
        user: true,
      },
    });
  }),
  updateOrderStatus: adminProcedure
    .input(
      z.object({
        orderId: z.string().uuid(),
        status: z.enum(orderStatuses),
      }),
    )
    .mutation(async ({ input }) => {
      const res = await db
        .update(orders)
        .set({ status: input.status })
        .where(eq(orders.id, input.orderId))
        .returning();

      return res;
    }),
});

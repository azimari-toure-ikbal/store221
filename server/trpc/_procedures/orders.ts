import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createTRPCRouter, privateProcedure } from "../init";

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
});

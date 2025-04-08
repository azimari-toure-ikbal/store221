import { Delivery } from "@/lib/validators";
import { relations } from "drizzle-orm";
import { jsonb, numeric, pgEnum, pgTable, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schema-helpers";
import { carts } from "./carts";
import { users } from "./users";

export const orderStatuses = [
  // "WAITING_PAYMENT",
  // "PAYED",
  "PREPARATION",
  "SHIPPING",
  "DELIVERED",
  "REFUNDED",
  "CANCELED",
] as const;
export type OrderStatuses = (typeof orderStatuses)[number];
export const orderStatusesEnum = pgEnum("order_status", orderStatuses);

export const orders = pgTable("orders", {
  id,
  userId: uuid().references(() => users.id, { onDelete: "cascade" }),
  cartId: uuid()
    .references(() => carts.id, { onDelete: "cascade" })
    .notNull(),
  totalPaid: numeric().notNull(),
  delivery: jsonb().$type<Delivery>().notNull(),
  status: orderStatusesEnum().notNull().default("PREPARATION"),
  createdAt,
  updatedAt,
});

export const ordersRelations = relations(orders, ({ many, one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  cart: one(carts, {
    fields: [orders.cartId],
    references: [carts.id],
  }),
}));

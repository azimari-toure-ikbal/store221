import { relations } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  uuid,
} from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schema-helpers";
import {
  CollarTypes,
  PantFits,
  PantLegs,
  products,
  Sizes,
  SleevesLengths,
  WristsTypes,
} from "./products";
import { currenciesEnum } from "./rates";
import { users } from "./users";

export const cartStatuses = [
  "DROPPED",
  "ABANDONNED",
  "FORGOTTEN",
  "WAITING_PAYMENT",
  "PAYED",
] as const;
export type CartStatuses = (typeof cartStatuses)[number];
export const cartStatusesEnum = pgEnum("cart_status", cartStatuses);

export const carts = pgTable(
  "carts",
  {
    id,
    sessionId: uuid().notNull(),
    userId: uuid().references(() => users.id, { onDelete: "cascade" }),
    status: cartStatusesEnum().notNull().default("WAITING_PAYMENT"),
    createdAt,
    updatedAt,
  },
  (t) => [index("sessoin_idx").on(t.sessionId), index("user_idx").on(t.userId)],
);
export type DBCart = typeof carts.$inferSelect;

export const cartRelations = relations(carts, ({ many, one }) => ({
  items: many(cartItems),
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
}));

export const cartItems = pgTable("cart_items", {
  id,
  cartId: uuid()
    .notNull()
    .references(() => carts.id, { onDelete: "cascade" }),
  productId: uuid()
    .references(() => products.id, {
      onDelete: "cascade",
    })
    .notNull(),
  quantity: integer().notNull().default(1),
  price: integer().notNull(),
  options: jsonb()
    .$type<{
      sleevesLength?: SleevesLengths;
      collarType?: CollarTypes;
      wristsType?: WristsTypes;
      pantFit?: PantFits;
      pantLeg?: PantLegs;
      initials?: string;
      tissu: string;
      size: Sizes | "sur-mesure";
    }>()
    .notNull(),
  currency: currenciesEnum().notNull().default("XOF"),
  rate: numeric().notNull(),
  createdAt,
  updatedAt,
});
export type DBCartItem = typeof cartItems.$inferSelect;

export const cartItemsRelations = relations(cartItems, ({ many, one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

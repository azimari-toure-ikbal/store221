import { pgTable, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schema-helpers";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { products } from "./products";

export const favorites = pgTable("favorites", {
  id,
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: uuid()
    .references(() => products.id, {
      onDelete: "cascade",
    })
    .notNull(),
  createdAt,
  updatedAt,
});

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [favorites.productId],
    references: [products.id],
  }),
}));

import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schema-helpers";
import { users } from "./users";

export const userAddresses = pgTable("user_addresses", {
  id,
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  firstName: text().notNull(),
  lastName: text().notNull(),
  email: text().notNull(),
  phone: text().notNull(),
  address: text().notNull(),
  country: text().notNull(),
  city: text().notNull(),
  state: text().notNull(),
  zip: text().notNull(),
  note: text(),
  createdAt,
  updatedAt,
});

export const userAddressesRelations = relations(
  userAddresses,
  ({ one, many }) => ({
    user: one(users, {
      fields: [userAddresses.userId],
      references: [users.id],
    }),
  }),
);

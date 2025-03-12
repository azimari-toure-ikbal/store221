import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schema-helpers";

export const roles = ["USER", "ADMIN"] as const;
export type Roles = (typeof roles)[number];
export const rolesEnum = pgEnum("roles", roles);

export const users = pgTable("users", {
  id,
  kindeId: text().notNull(),
  email: text().notNull(),
  givenName: text(),
  familyName: text(),
  phone: text().notNull(),
  role: rolesEnum().default("USER").notNull(),
  createdAt,
  updatedAt,
});
export type DBUser = typeof users.$inferSelect;

export const usersRelations = relations(users, ({ one, many }) => ({}));

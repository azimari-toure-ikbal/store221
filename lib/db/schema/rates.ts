import { numeric, pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schema-helpers";

export const currencies = ["XOF", "USD", "EUR"] as const;
export type Currencies = (typeof currencies)[number];
export const currenciesEnum = pgEnum("currency", currencies);

export const rates = pgTable("rates", {
  id: serial().primaryKey(),
  currency: currenciesEnum().notNull(),
  name: text().notNull(),
  rate: numeric().notNull(),
  createdAt,
  updatedAt,
});

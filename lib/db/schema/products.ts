import { numeric, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schema-helpers";

export const productTypes = ["PANTS", "SHIRTS", "SUITS"] as const;
export type ProductTypes = (typeof productTypes)[number];
export const productTypesEnum = pgEnum("product_type", productTypes);

export const sleevesLengths = ["SHORT", "LONG"] as const;
export type SleevesLengths = (typeof sleevesLengths)[number];
export const sleevesLengthsEnum = pgEnum("sleeves_length", sleevesLengths);

export const collarTypes = ["STANDARD", "MINIMALISTIC"] as const;
export type CollarTypes = (typeof collarTypes)[number];
export const collarTypesEnum = pgEnum("collar_type", collarTypes);

export const wristsTypes = ["SIMPLE", "MUSKETEER"] as const;
export type WristsTypes = (typeof wristsTypes)[number];
export const wristsTypesEnum = pgEnum("wrists_type", wristsTypes);

export const products = pgTable("products", {
  id,
  name: text().notNull(),
  description: text(),
  price: numeric().notNull(),
  type: productTypesEnum().notNull(),
  createdAt,
  updatedAt,
});

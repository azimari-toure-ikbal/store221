import { relations } from "drizzle-orm";
import {
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
} from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schema-helpers";
import { favorites } from "./favorites";

export const productTypes = [
  "PANTS",
  "CLASSIC_SHIRTS",
  "AFRICAN_SHIRTS",
  "MEN_SUITS",
  "WOMEN_SUITS",
] as const;
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

export const pantFits = ["REGULAR", "SLIM_FIT"] as const;
export type PantFits = (typeof pantFits)[number];
export const pantFitsEnum = pgEnum("pant_fit", pantFits);

export const pantLegs = ["OUTLET", "REVERS"] as const;
export type PantLegs = (typeof pantLegs)[number];
export const pantLegsEnum = pgEnum("pant_leg", pantLegs);

export const sizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type Sizes = (typeof sizes)[number];
export const sizesEnum = pgEnum("size", sizes);

export const productStatuses = ["DRAFT", "PUBLISHED", "DELETED"] as const;
export type ProductStatuses = (typeof productStatuses)[number];
export const productStatusesEnum = pgEnum("product_status", productStatuses);

export const sellers = ["CAMENWEAR", "KAYSHOPPING"] as const;
export type Sellers = (typeof sellers)[number];
export const sellersEnum = pgEnum("seller", sellers);

export const products = pgTable("products", {
  id,
  name: text().notNull(),
  description: text().notNull(),
  price: numeric().notNull(),
  discountedPrice: numeric(),
  type: productTypesEnum().notNull(),
  sizes: sizesEnum().array().notNull(),
  stock: integer().notNull(),
  options: jsonb()
    .$type<{
      sleevesLength?: SleevesLengths[];
      collarType?: CollarTypes[];
      wristsType?: WristsTypes[];
      pantFit?: PantFits[];
      pantLeg?: PantLegs[];
    }>()
    .notNull(),
  gallery: text().array().notNull(),
  tissues: jsonb()
    .$type<{ name: string; url: string }[]>()
    .notNull()
    .default([]),
  seller: sellersEnum().notNull(),
  status: productStatusesEnum().notNull(),
  createdAt,
  updatedAt,
});

export type DBProduct = typeof products.$inferSelect;

export const productsRelations = relations(products, ({ many, one }) => ({
  favorites: many(favorites),
}));

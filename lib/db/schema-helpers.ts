import { timestamp, uuid } from "drizzle-orm/pg-core";

export const id = uuid().primaryKey().defaultRandom();

export const createdAt = timestamp({
  withTimezone: true,
  mode: "string",
}).defaultNow();

export const updatedAt = timestamp({ withTimezone: true, mode: "string" })
  .defaultNow()
  .$onUpdate(() => new Date().toISOString());

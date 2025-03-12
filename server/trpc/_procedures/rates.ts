import { db } from "@/lib/db";
import { createTRPCRouter, publicProcedure } from "../init";

export const ratesRouter = createTRPCRouter({
  getRates: publicProcedure.query(async ({}) => {
    return await db.query.rates.findMany();
  }),
});

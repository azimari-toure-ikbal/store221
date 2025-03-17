import { authRouter } from "./_procedures/auth";
import { cartsRouter } from "./_procedures/carts";
import { productsRouter } from "./_procedures/products";
import { ratesRouter } from "./_procedures/rates";
import { usersRouter } from "./_procedures/users";
import { createTRPCRouter } from "./init";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  rates: ratesRouter,
  users: usersRouter,
  products: productsRouter,
  carts: cartsRouter,
  // options: optionsRouter,
  // fabrics: fabricsRouter,
  // collars: collarsRouter,
  // products: productsRouter,
  // favorites: favoritesRouter,
  // team: teamRouter,
});

export type AppRouter = typeof appRouter;

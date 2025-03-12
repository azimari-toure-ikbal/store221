import { authRouter } from "./_procedures/auth";
import { ratesRouter } from "./_procedures/rates";
import { usersRouter } from "./_procedures/users";
import { createTRPCRouter } from "./init";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  rates: ratesRouter,
  users: usersRouter,
  // options: optionsRouter,
  // fabrics: fabricsRouter,
  // collars: collarsRouter,
  // products: productsRouter,
  // carts: cartsRouter,
  // favorites: favoritesRouter,
  // team: teamRouter,
});

export type AppRouter = typeof appRouter;

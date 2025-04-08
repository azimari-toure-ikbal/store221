import { authRouter } from "./_procedures/auth";
import { cartsRouter } from "./_procedures/carts";
import { favoritesRouter } from "./_procedures/favorites";
import { ordersRouter } from "./_procedures/orders";
import { productsRouter } from "./_procedures/products";
import { ratesRouter } from "./_procedures/rates";
import { userAddressesRouter } from "./_procedures/user-addresses";
import { usersRouter } from "./_procedures/users";
import { createTRPCRouter } from "./init";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  rates: ratesRouter,
  users: usersRouter,
  products: productsRouter,
  carts: cartsRouter,
  favorites: favoritesRouter,
  userAddresses: userAddressesRouter,
  orders: ordersRouter,
  // options: optionsRouter,
  // fabrics: fabricsRouter,
  // collars: collarsRouter,
  // products: productsRouter,
  // team: teamRouter,
});

export type AppRouter = typeof appRouter;

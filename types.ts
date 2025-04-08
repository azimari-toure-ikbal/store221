import type { AppRouter } from "@/server/trpc/_app";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

export type ProductResponse = RouterOutput["products"]["getPaginatedProducts"];
export type ProductItemResponse =
  RouterOutput["products"]["getPaginatedProducts"]["items"][0];

export type CartResponse = RouterOutput["carts"]["getCarts"][number];
export type CurrentUserResponse = RouterOutput["users"]["getCurrentUser"];
// export type UserAddress

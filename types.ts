import type { AppRouter } from "@/server/trpc/_app";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

export type ProductResponse = RouterOutput["products"]["getPaginatedProducts"];
export type ProductItemResponse =
  RouterOutput["products"]["getPaginatedProducts"]["items"][0];

export type CartResponse = RouterOutput["carts"]["getCarts"][number];
export type CurrentUserResponse = RouterOutput["users"]["getCurrentUser"];

export type OrderResponse = RouterOutput["orders"]["getOrders"][number];
// export type OrderItemResponse =
//   RouterOutput["orders"]["getOrders"]["items"][0];

// export type UserAddress

export type PayPalBody = {
  items: {
    name: string;
    quantity: string;
    unit_amount: {
      currency_code: string;
      value: string;
    };
  }[];
  amount: {
    currency_code: string;
    value: string;
    breakdown: {
      item_total: { currency_code: string; value: string };
      shipping: { currency_code: string; value: string };
    };
  };
};

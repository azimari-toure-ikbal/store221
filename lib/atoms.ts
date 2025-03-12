import { Cart } from "@/config";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Currencies } from "./db/schema";

export const currencyAtom = atomWithStorage<{ code: Currencies; rate: number }>(
  "CMW_CURRENCY",
  { code: "XOF", rate: 1 }
);

export const sessionAtom = atomWithStorage<string>("CMW_Session", "");

export const cartAtom = atom<Cart>();

export const paymentGatewayAtom = atomWithStorage<string>(
  "CMW_PaymentGateway",
  ""
);
export const deliveryPriceAtom = atom<number>(-1);

export const pageAtom = atom<number>(1);

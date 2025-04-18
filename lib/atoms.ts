import { Cart, DELIVERY_AREAS, PRODUCT_FORM_DEFAULT_VALUES } from "@/config";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { z } from "zod";
import { Currencies } from "./db/schema";
import {
  checkoutFormSchema,
  ProductFilter,
  productFormSchema,
} from "./validators";

export const currencyAtom = atomWithStorage<{ code: Currencies; rate: number }>(
  "S221_CURRENCY",
  { code: "XOF", rate: 1 },
);

export const sessionAtom = atom("");

export const cartAtom = atom<Cart>();

export const paymentGatewayAtom = atomWithStorage<string>(
  "S221_PaymentGateway",
  "",
);
export const deliveryAreaAtom = atomWithStorage<DELIVERY_AREAS>(
  "S221_DeliveryArea",
  "Afrique",
);

export const filterAtom = atom<ProductFilter>({
  productType: "ALL",
  sleevesOptions: [],
  collarOptions: [],
  wristsOptions: [],
  pantFitOptions: [],
  pantLegOptions: [],
  tissues: [],
  sort: "created-desc",
  price: 0,
});

export const pageAtom = atom<number>(1);

export const productFormAtom = atomWithStorage<
  z.infer<typeof productFormSchema>
>("S221_PRODUCTFORM_BACKUP", PRODUCT_FORM_DEFAULT_VALUES);

export const savedCheckoutInfoAtom = atomWithStorage<
  z.infer<typeof checkoutFormSchema> | undefined
>("S221_SAVED_CHECKOUT_INFO", undefined);

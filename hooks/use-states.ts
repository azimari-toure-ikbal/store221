"use client";

import {
  productFilterValidator,
  productOptionsValidator,
} from "@/lib/validators";
import {
  parseAsIndex,
  parseAsInteger,
  parseAsJson,
  parseAsString,
  useQueryStates,
} from "nuqs";

export const useShopFilters = () => {
  return useQueryStates(
    {
      filter: parseAsJson(productFilterValidator.parse).withDefault({
        productType: "ALL",
        sleevesOptions: [],
        collarOptions: [],
        wristsOptions: [],
        pantFitOptions: [],
        pantLegOptions: [],
        sort: "created-desc",
        price: 0,
      }),
      page: parseAsIndex.withDefault(0),
    },
    {
      history: "push",
    },
  );
};

export const useProductFilters = () => {
  return useQueryStates(
    {
      selectedOptions: parseAsJson(productOptionsValidator.parse).withDefault({
        size: "M",
      }),
      initials: parseAsString.withDefault(""),
      quantity: parseAsInteger.withDefault(1),
    },
    {
      history: "push",
    },
  );
};

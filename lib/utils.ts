import { CartItem, PANTS_WEIGHT, SHIRT_WEIGHT, SUITS_WEIGHT } from "@/config";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  CollarTypes,
  PantFits,
  PantLegs,
  ProductTypes,
  SleevesLengths,
  WristsTypes,
} from "./db/schema/products";
import { Currencies } from "./db/schema/rates";
import { ProductFilter } from "./validators";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (
  price: number,
  currency: Currencies,
  rate?: number,
) => {
  if (rate) {
    const priceWithRate = price * rate;

    switch (currency) {
      case "XOF":
        return priceWithRate.toLocaleString("fr-FR", {
          style: "currency",
          currency: "XOF",
        });
      case "USD":
        return priceWithRate.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      case "EUR":
        return priceWithRate.toLocaleString("fr-FR", {
          style: "currency",
          currency: "EUR",
        });
      default:
        return priceWithRate.toLocaleString("fr-FR", {
          style: "currency",
          currency: "XOF",
        });
    }
  } else {
    switch (currency) {
      case "XOF":
        return price.toLocaleString("fr-FR", {
          style: "currency",
          currency: "XOF",
        });
      case "USD":
        return price.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      case "EUR":
        return price.toLocaleString("fr-FR", {
          style: "currency",
          currency: "XOF",
        });
      default:
        return price.toLocaleString("fr-FR", {
          style: "currency",
          currency: "XOF",
        });
    }
  }
};

export function slugify(str: string) {
  return str
    .toString() // Convert to string
    .normalize("NFD") // Normalize to decompose special characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics (accents, etc.)
    .toLowerCase() // Convert to lowercase
    .trim() // Remove surrounding whitespace
    .replace(/[^a-z0-9\s-]/g, "") // Remove invalid characters
    .replace(/\s+/g, "-"); // Replace spaces with hyphens
}

export const formatType = (type: ProductTypes) => {
  switch (type) {
    case "PANTS":
      return "Pantalons";
    case "CLASSIC_SHIRTS":
      return "Chemises";
    case "AFRICAN_SHIRTS":
      return "Chemises Africaines";
    case "MEN_SUITS":
      return "Costumes Hommes";
    case "WOMEN_SUITS":
      return "Costumes Femmes";
    default:
      return "Unknown";
  }
};

export const formatSleevesLength = (length: SleevesLengths) => {
  switch (length) {
    case "SHORT":
      return "Court";
    case "LONG":
      return "Long";
    default:
      return "Unknown";
  }
};

export const formatCollarType = (type: CollarTypes) => {
  switch (type) {
    case "STANDARD":
      return "Standard";
    case "MINIMALISTIC":
      return "Minimaliste";
    default:
      return "Unknown";
  }
};

export const formatWristsType = (type: WristsTypes) => {
  switch (type) {
    case "SIMPLE":
      return "Simple";
    case "MUSKETEER":
      return "Mousquetaire";
    default:
      return "Unknown";
  }
};

export const formatPantFit = (type: PantFits) => {
  switch (type) {
    case "REGULAR":
      return "Regular";
    case "SLIM_FIT":
      return "Slim Fit";
    default:
      return "Unknown";
  }
};

export const formatPantLeg = (type: PantLegs) => {
  switch (type) {
    case "OUTLET":
      return "Ourlet";
    case "REVERS":
      return "Revers";
    default:
      return "Unknown";
  }
};

export const formatSortOption = (sort: string) => {
  switch (sort) {
    case "created-desc":
      return "Date décroissante";
    case "created-asc":
      return "Date croissante";
    case "price-asc":
      return "Prix croissant";
    case "price-desc":
      return "Prix décroissant";
    default:
      return "Date décroissante";
  }
};

export const createProductQueryParams = (
  filter: ProductFilter = {
    productType: "ALL",
    sleevesOptions: [],
    collarOptions: [],
    wristsOptions: [],
    pantFitOptions: [],
    pantLegOptions: [],
    sort: "created-desc",
    price: 0,
  },
  page: number,
) => {
  const queryParams = new URLSearchParams();

  queryParams.append("page", page.toString());
  queryParams.append("filter", JSON.stringify(filter));

  return queryParams;
};

export const createProductOptionsParams = (options: Record<string, any>) => {
  // Create a new instance of URLSearchParams.
  const queryParams = new URLSearchParams();

  // Loop through the product option keys.
  for (const [key, value] of Object.entries(options)) {
    if (value) {
      // Set (or update) the query parameter.
      queryParams.set(key, value.toString());
    } else {
      // Remove the parameter if the option is falsy (deselected).
      queryParams.delete(key);
    }
  }

  // Construct the new URL using the current pathname.
  const newUrl = `${window.location.pathname}?${queryParams.toString()}`;

  // Update the URL without reloading the page.
  window.history.replaceState(null, "", newUrl);

  return queryParams;
};

// export const createProductOptionsParams = (
//   options: ProductOption = {
//     size: "XS",
//     collarType: undefined,
//     sleevesLength: undefined,
//     wristsType: undefined,
//     pantFit: undefined,
//     pantLeg: undefined,
//   },
// ) => {
//   const queryParams = new URLSearchParams();

//   queryParams.append("filter", JSON.stringify(options));
//   return queryParams;
// };

export function generateUUIDv4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

export const inStock = (product: CartItem, quantity: number): boolean => {
  return product.stock >= quantity;
};

export const getWeight = (productType: ProductTypes) => {
  switch (productType) {
    case "AFRICAN_SHIRTS":
      return SHIRT_WEIGHT;
    case "CLASSIC_SHIRTS":
      return SHIRT_WEIGHT;
    case "PANTS":
      return PANTS_WEIGHT;
    case "MEN_SUITS":
      return SUITS_WEIGHT;
    case "WOMEN_SUITS":
      return SUITS_WEIGHT;
    default:
      return 0;
  }
};

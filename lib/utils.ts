import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Currencies } from "./db/schema/rates";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (
  price: number,
  currency: Currencies,
  rate?: number
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

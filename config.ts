import {
  ChartBar,
  HeartIcon,
  House,
  ListChecks,
  ShoppingCart,
  User,
} from "lucide-react";
// import { createListingQueryParams } from "./lib/utils";
// import { ProductSizes } from "./lib/db/schema";

export const logVerbose = process.env.SHOW_VERBOSE_LOG === "true";
export const devMode = process.env.DEV_MODE === "true";
export const publicDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true";

export const NAVBAR_MENU = [
  { title: "Accueil", href: "/" },
  { title: "Boutique", href: "/shop" },
  { title: "Chemises", href: "/shop" },
  { title: "Pantalons", href: "/shop" },
  { title: "Costumes", href: "/shop" },
  { title: "Contact", href: "/contact" },
];

export const CUSTOMERS_MENU = [
  { title: "Profil", icon: User, href: "/customer" },
  { title: "Commandes", icon: ShoppingCart, href: "/customer/orders" },
  { title: "Adresses", icon: House, href: "/customer/addresses" },
  { title: "Favoris", icon: HeartIcon, href: "/customer/favorites" },
  { title: "Wishlist", icon: ListChecks, href: "/customer/wishlist" },
  // { title: "" },
];

export const ADMINS_MENU = [
  { title: "Dashboard", icon: ChartBar, href: "/dashboard/analytics" },
  { title: "Produits", icon: ChartBar, href: "/dashboard/products" },
  { title: "Cols", icon: ChartBar, href: "/dashboard/collars" },
  { title: "Tissus", icon: ChartBar, href: "/dashboard/fabrics" },
  { title: "Options", icon: ChartBar, href: "/dashboard/options" },
  { title: "Commandes", icon: ShoppingCart, href: "/dashboard/orders" },
];

export const AVAILABLE_SORT = [
  "created-desc",
  "created-asc",
  "price-asc",
  "price-desc",
  // "rating-asc",
  // "rating-desc",
] as const;

export const DEFAULT_LIMIT = 10;
export const DEFAULT_CUSTOM_PRICE = [0, 45000] as [number, number];
export const STEP_VALUE = 1000;

export type CartItem = {
  name: string;
  productId: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  // size: ProductSizes;
};

export type Cart = {
  id: string;
  sessionId: string;
  userId: string | null;
  items: CartItem[];
};

export const PAYMENT_METHODS = [
  {
    name: "Paiement à la livraison",
    img: "/payment-cash.svg",
    color: "#157810",
  },
  {
    name: "Carte",
    img: "/payment-card.png",
    color: "#F79E23",
  },
  {
    name: "Wave",
    img: "/payment-wave.png",
    color: "#1CC8FF",
  },
  {
    name: "Orange-money",
    img: "/payment-om.png",
    color: "#FF6600",
  },
] as const;

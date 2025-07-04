import {
  Archive,
  BoxIcon,
  HeartIcon,
  House,
  LayoutDashboard,
  ShoppingCart,
  User,
  Users2,
} from "lucide-react";
import { z } from "zod";
import {
  CollarTypes,
  PantFits,
  PantLegs,
  ProductTypes,
  Sizes,
  SleevesLengths,
  WristsTypes,
} from "./lib/db/schema";
import { productFormSchema } from "./lib/validators";
// import { createListingQueryParams } from "./lib/utils";
// import { ProductSizes } from "./lib/db/schema";

export const CUSTOMER_SERVICE_PHONE = "+221769019494";
export const logVerbose = process.env.SHOW_VERBOSE_LOG === "true";
export const devMode = process.env.DEV_MODE === "true";
export const publicDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true";

export const SUR_MESURE_PRICE = 0;
export const INITIALS_PRICE = 5000;

export const NAVBAR_MENU = [
  { title: "Accueil", hrefBase: "/" },
  { title: "Boutique", hrefBase: "/shop" },
  {
    title: "Chemises",
    hrefBase: "/shop",
    query: { productType: "CLASSIC_SHIRTS" },
  },
  { title: "Pantalons", hrefBase: "/shop", query: { productType: "PANTS" } },
  { title: "Costumes", hrefBase: "/shop", query: { productType: "MEN_SUITS" } },
  { title: "Contact", hrefBase: "/contact" },
];

export const CUSTOMERS_MENU = [
  { title: "Profil", icon: User, href: "/customer" },
  { title: "Commandes", icon: Archive, href: "/customer/orders" },
  { title: "Paniers", icon: ShoppingCart, href: "/customer/carts" },
  { title: "Adresses", icon: House, href: "/customer/addresses" },
  { title: "Favoris", icon: HeartIcon, href: "/customer/favorites" },
  // { title: "Wishlist", icon: ListChecks, href: "/customer/wishlist" },
  // { title: "" },
];

export const ADMINS_MENU = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Produits",
    href: "/dashboard/products",
    icon: BoxIcon,
  },
  {
    title: "Commandes",
    href: "/dashboard/orders",
    icon: Archive,
  },
  { title: "Paniers", icon: ShoppingCart, href: "/customer/carts" },
  {
    title: "Utilisateurs",
    href: "/dashboard/users",
    icon: Users2,
  },
];

export const AVAILABLE_SORT = [
  "created-desc",
  "created-asc",
  "price-asc",
  "price-desc",
] as const;

export const DEFAULT_LIMIT = 12;
export const DEFAULT_CUSTOM_PRICE = [0, 45000] as [number, number];
export const STEP_VALUE = 1000;

export const SHIRT_WEIGHT = 0.25;
export const PANTS_WEIGHT = 0.3;
export const SUITS_WEIGHT = 1;

export const AREAS = [
  "Afrique",
  "Europe",
  "Amerique",
  "Afrique-Senegal",
] as const;
export type DELIVERY_AREAS = (typeof AREAS)[number];

export type ItemOptions = {
  sleevesLength?: SleevesLengths;
  collarType?: CollarTypes;
  wristsType?: WristsTypes;
  pantFit?: PantFits;
  pantLeg?: PantLegs;
  tissu?: string;
  size: Sizes | "sur-mesure";
  initials: string;
};

export type CartItem = {
  name: string;
  productId: string;
  image: string;
  productType: ProductTypes;
  price: number;
  quantity: number;
  stock: number;
  options: ItemOptions;
};

export type Cart = {
  id: string;
  sessionId: string;
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

export const PRODUCT_FORM_DEFAULT_VALUES: z.infer<typeof productFormSchema> = {
  name: "",
  description: "",
  price: "",
  stock: "",
  discountedPrice: "",
  tissues: [],
  gallery: [],
  type: "CLASSIC_SHIRTS",
  sizes: ["S", "XS", "M", "L", "XL", "XXL"],
  seller: "CAMENWEAR",
  options: {
    sleevesLength: ["SHORT", "LONG"],
    collarType: ["STANDARD", "MINIMALISTIC"],
    wristsType: ["SIMPLE", "MUSKETEER"],
    pantFit: ["REGULAR", "SLIM_FIT"],
    pantLeg: ["OUTLET", "REVERS"],
  },
};

export const countries = [
  { name: "Algérie", continent: "Afrique" },
  { name: "Angola", continent: "Afrique" },
  { name: "Bénin", continent: "Afrique" },
  { name: "Botswana", continent: "Afrique" },
  { name: "Burkina Faso", continent: "Afrique" },
  { name: "Burundi", continent: "Afrique" },
  { name: "Cap-Vert", continent: "Afrique" },
  { name: "Cameroun", continent: "Afrique" },
  { name: "République centrafricaine", continent: "Afrique" },
  { name: "Tchad", continent: "Afrique" },
  { name: "Comores", continent: "Afrique" },
  { name: "République démocratique du Congo", continent: "Afrique" },
  { name: "République du Congo", continent: "Afrique" },
  { name: "Djibouti", continent: "Afrique" },
  { name: "Égypte", continent: "Afrique" },
  { name: "Guinée équatoriale", continent: "Afrique" },
  { name: "Érythrée", continent: "Afrique" },
  { name: "Eswatini", continent: "Afrique" },
  { name: "Éthiopie", continent: "Afrique" },
  { name: "Gabon", continent: "Afrique" },
  { name: "Gambie", continent: "Afrique" },
  { name: "Ghana", continent: "Afrique" },
  { name: "Guinée", continent: "Afrique" },
  { name: "Guinée-Bissau", continent: "Afrique" },
  { name: "Côte d'Ivoire", continent: "Afrique" },
  { name: "Kenya", continent: "Afrique" },
  { name: "Lesotho", continent: "Afrique" },
  { name: "Libéria", continent: "Afrique" },
  { name: "Libye", continent: "Afrique" },
  { name: "Madagascar", continent: "Afrique" },
  { name: "Malawi", continent: "Afrique" },
  { name: "Mali", continent: "Afrique" },
  { name: "Mauritanie", continent: "Afrique" },
  { name: "Maurice", continent: "Afrique" },
  { name: "Maroc", continent: "Afrique" },
  { name: "Mozambique", continent: "Afrique" },
  { name: "Namibie", continent: "Afrique" },
  { name: "Niger", continent: "Afrique" },
  { name: "Nigéria", continent: "Afrique" },
  { name: "Rwanda", continent: "Afrique" },
  { name: "São Tomé-et-Principe", continent: "Afrique" },
  { name: "Sénégal", continent: "Afrique-Senegal" },
  { name: "Seychelles", continent: "Afrique" },
  { name: "Sierra Leone", continent: "Afrique" },
  { name: "Somalie", continent: "Afrique" },
  { name: "Afrique du Sud", continent: "Afrique" },
  { name: "Soudan du Sud", continent: "Afrique" },
  { name: "Soudan", continent: "Afrique" },
  { name: "Tanzanie", continent: "Afrique" },
  { name: "Togo", continent: "Afrique" },
  { name: "Tunisie", continent: "Afrique" },
  { name: "Ouganda", continent: "Afrique" },
  { name: "Zambie", continent: "Afrique" },
  { name: "Zimbabwe", continent: "Afrique" },

  { name: "Albanie", continent: "Europe" },
  { name: "Andorre", continent: "Europe" },
  { name: "Autriche", continent: "Europe" },
  { name: "Biélorussie", continent: "Europe" },
  { name: "Belgique", continent: "Europe" },
  { name: "Bosnie-Herzégovine", continent: "Europe" },
  { name: "Bulgarie", continent: "Europe" },
  { name: "Croatie", continent: "Europe" },
  { name: "Chypre", continent: "Europe" },
  { name: "République tchèque", continent: "Europe" },
  { name: "Danemark", continent: "Europe" },
  { name: "Estonie", continent: "Europe" },
  { name: "Finlande", continent: "Europe" },
  { name: "France", continent: "Europe" },
  { name: "Allemagne", continent: "Europe" },
  { name: "Grèce", continent: "Europe" },
  { name: "Hongrie", continent: "Europe" },
  { name: "Islande", continent: "Europe" },
  { name: "Irlande", continent: "Europe" },
  { name: "Italie", continent: "Europe" },
  { name: "Lettonie", continent: "Europe" },
  { name: "Liechtenstein", continent: "Europe" },
  { name: "Lituanie", continent: "Europe" },
  { name: "Luxembourg", continent: "Europe" },
  { name: "Malte", continent: "Europe" },
  { name: "Monaco", continent: "Europe" },
  { name: "Monténégro", continent: "Europe" },
  { name: "Pays-Bas", continent: "Europe" },
  { name: "Macédoine du Nord", continent: "Europe" },
  { name: "Norvège", continent: "Europe" },
  { name: "Pologne", continent: "Europe" },
  { name: "Portugal", continent: "Europe" },
  { name: "Roumanie", continent: "Europe" },
  { name: "Russie", continent: "Europe" },
  { name: "Saint-Marin", continent: "Europe" },
  { name: "Serbie", continent: "Europe" },
  { name: "Slovaquie", continent: "Europe" },
  { name: "Slovénie", continent: "Europe" },
  { name: "Espagne", continent: "Europe" },
  { name: "Suède", continent: "Europe" },
  { name: "Suisse", continent: "Europe" },
  { name: "Ukraine", continent: "Europe" },
  { name: "Royaume-Uni", continent: "Europe" },
  { name: "Vatican", continent: "Europe" },

  { name: "Argentine", continent: "Amerique" },
  { name: "Bolivie", continent: "Amerique" },
  { name: "Brésil", continent: "Amerique" },
  { name: "Canada", continent: "Amerique" },
  { name: "Chili", continent: "Amerique" },
  { name: "Colombie", continent: "Amerique" },
  { name: "Cuba", continent: "Amerique" },
  { name: "Équateur", continent: "Amerique" },
  { name: "États-Unis", continent: "Amerique" },
  { name: "Mexique", continent: "Amerique" },
  { name: "Paraguay", continent: "Amerique" },
  { name: "Pérou", continent: "Amerique" },
  { name: "Uruguay", continent: "Amerique" },
  { name: "Venezuela", continent: "Amerique" },
] as const;

export const countriesName = countries.map((c) => c.name);

export type PayTechIPN = {
  currency: string;
  api_key_sha256: string;
  api_secret_sha256: string;
  type_event: string;
  custom_field: string;
  ref_command: string;
  item_name: string;
  item_price: string;
  command_name: string;
  token: string;
  env: string;
  payment_method: string;
  client_phone: string;
};

export type PaytechResponse = {
  success: number;
  token: string;
  redirect_url: string;
  redirectUrl: string;
};

export type IpnBody = {
  custom_field: any;
  currency: string;
  api_key_sha256: string;
  api_secret_sha256: string;
  type_event: string;
  ref_command: string;
  item_name: string;
  item_price: string;
  command_name: string;
  token: string;
  env: string;
  payment_method: string;
  client_phone: string;
};

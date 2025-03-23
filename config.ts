import { ChartBar, HeartIcon, House, ShoppingCart, User } from "lucide-react";
import { z } from "zod";
import {
  CollarTypes,
  PantFits,
  PantLegs,
  Sizes,
  SleevesLengths,
  WristsTypes,
} from "./lib/db/schema";
import { productFormSchema } from "./lib/validators";
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
  // { title: "Wishlist", icon: ListChecks, href: "/customer/wishlist" },
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
] as const;

export const DEFAULT_LIMIT = 12;
export const DEFAULT_CUSTOM_PRICE = [0, 45000] as [number, number];
export const STEP_VALUE = 1000;

export const SHIRT_WEIGHT = 0.25;
export const PANTS_WEIGHT = 0.3;
export const SUITS_WEIGHT = 1;

export const AREAS = ["Afrique", "Europe", "Amerique"] as const;
export type DELIVERY_AREAS = (typeof AREAS)[number];

export type ItemOptions = {
  sleevesLength?: SleevesLengths;
  collarType?: CollarTypes;
  wristsType?: WristsTypes;
  pantFit?: PantFits;
  pantLeg?: PantLegs;
  size: Sizes | "sur-mesure";
};

export type CartItem = {
  name: string;
  productId: string;
  image: string;
  productType: "SHIRTS" | "PANTS" | "SUITS";
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
  gallery: [],
  type: "SHIRTS",
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
  { name: "Sénégal", continent: "Afrique" },
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

import { AVAILABLE_SORT } from "@/config";
import { z } from "zod";
import {
  collarTypes,
  pantFits,
  pantLegs,
  productTypes,
  sellers,
  sizes,
  sleevesLengths,
  wristsTypes,
} from "./db/schema/products";

export const registerFormSchema = z.object({
  givenName: z.string({
    message: "Le prénom est obligatoire",
    required_error: "Le prénom est obligatoire",
  }),
  familyName: z.string(),
  email: z.string(),
  phone: z.string(),
});

export const loginFormSchema = z.object({
  email: z.string({
    message: "L'adresse email est obligatoire",
    required_error: "L'adresse email est obligatoire",
  }),
});

export const teamMemberFormSchema = z.object({
  givenName: z.string({
    message: "Le prénom est obligatoire",
    required_error: "Le prénom est obligatoire",
  }),
  familyName: z.string({
    message: "Le nom est obligatoire",
    required_error: "Le nom est obligatoire",
  }),
  email: z.string({
    message: "L'email est obligatoire",
    required_error: "L'email est obligatoire",
  }),
  phone: z.string({
    message: "Le numéro de téléphone est obligatoire",
    required_error: "Le numéro de téléphone est obligatoire",
  }),
  // role: z.enum(["ADMIN", "USER"], {
  //   message: "Le rôle est obligatoire",
  //   required_error: "Le rôle est obligatoire",
  // }),
});

export const productFormSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Le prix doit être un nombre",
  }),
  stock: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Le stock doit être un nombre",
  }),
  discountedPrice: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Le prix doit être un nombre",
    })
    .optional(),
  gallery: z.string().array(),
  type: z.enum(productTypes),
  sizes: z.array(z.enum(sizes)),
  seller: z.enum(sellers),
  options: z.object({
    sleevesLength: z.array(z.enum(sleevesLengths)),
    collarType: z.array(z.enum(collarTypes)),
    wristsType: z.array(z.enum(wristsTypes)),
    pantFit: z.array(z.enum(pantFits)),
    pantLeg: z.array(z.enum(pantLegs)),
  }),
});

export const productFilterValidator = z.object({
  productType: z.enum(["ALL", ...productTypes]),
  sleevesOptions: z.array(z.enum(sleevesLengths)),
  collarOptions: z.array(z.enum(collarTypes)),
  wristsOptions: z.array(z.enum(wristsTypes)),
  pantFitOptions: z.array(z.enum(pantFits)),
  pantLegOptions: z.array(z.enum(pantLegs)),
  sort: z.enum(AVAILABLE_SORT),
  price: z.number(),
});

export type ProductFilter = z.infer<typeof productFilterValidator>;

export const productOptionsValidator = z.object({
  size: z.enum(["sur-mesure", ...sizes]),
  sleevesLength: z.enum(sleevesLengths).optional(),
  collarType: z.enum(collarTypes).optional(),
  wristsType: z.enum(wristsTypes).optional(),
  pantFit: z.enum(pantFits).optional(),
  pantLeg: z.enum(pantLegs).optional(),
});

export const cartItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  image: z.string(),
  productType: z.enum(productTypes),
  quantity: z.number(),
  price: z.number(),
  stock: z.number(),
  options: z.object({
    sleevesLength: z.enum(sleevesLengths).optional(),
    collarType: z.enum(collarTypes).optional(),
    wristsType: z.enum(wristsTypes).optional(),
    pantFit: z.enum(pantFits).optional(),
    pantLeg: z.enum(pantLegs).optional(),
    initials: z.string().optional(),
    size: z.enum(["XS", "S", "M", "L", "XL", "XXL", "sur-mesure"]),
  }),
  currency: z.enum(["XOF", "USD", "EUR"]),
  rate: z.number(),
});

export const cartItemsSchema = z.array(cartItemSchema);

export const itemOptions = z.object({
  sleevesLength: z.enum(sleevesLengths).optional(),
  collarType: z.enum(collarTypes).optional(),
  wristsType: z.enum(wristsTypes).optional(),
  pantFit: z.enum(pantFits).optional(),
  pantLeg: z.enum(pantLegs).optional(),
  size: z.enum(["XS", "S", "M", "L", "XL", "XXL", "sur-mesure"]),
});

export type ProductOption = z.infer<typeof itemOptions>;

export const checkoutFormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  country: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  note: z.string().optional(),
});

export type Delivery = z.infer<typeof checkoutFormSchema>;

import { z } from "zod";

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

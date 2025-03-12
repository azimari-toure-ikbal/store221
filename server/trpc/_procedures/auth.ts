import { logVerbose } from "@/config";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { loginFormSchema, registerFormSchema } from "@/lib/validators";
import { registerUser } from "@/server/kinde";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../init";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(registerFormSchema)
    .mutation(async ({ input }) => {
      // Check if the email is already registered
      const foundEmail = await db.query.users.findFirst({
        where: eq(users.email, input.email),
      });

      if (foundEmail) {
        if (logVerbose)
          console.error(
            `Email ${input.email} is already registered in the database`
          );
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Vérifiez votre email et votre numéro de téléphone",
        });
      }

      // Check if the phone number is already registered
      const foundPhone = await db.query.users.findFirst({
        where: eq(users.phone, input.phone),
      });

      if (foundPhone) {
        if (logVerbose)
          console.error(
            `Phone number ${input.phone} is already registered in the database`
          );
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Vérifiez votre email et votre numéro de téléphone",
        });
      }

      const userId = crypto.randomUUID();

      // Save the user in KINDE
      try {
        const kUserId = await registerUser({
          id: userId,
          email: input.email,
          givenName: input.givenName,
          familyName: input.familyName,
          admin: false,
        });

        if (!kUserId) {
          if (logVerbose)
            console.error(
              `KINDE user registration failed for user ${userId}. Kinde didn't return an id`
            );
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Erreur lors de l'enregistrement de l'utilisateur [KINDE]",
          });
        }

        // Save the user in DB
        await db.insert(users).values({
          id: userId,
          kindeId: kUserId,
          email: input.email,
          givenName: input.givenName,
          familyName: input.familyName,
          phone: input.phone,
          role: "USER",
        });

        return userId;
      } catch (error) {
        if (logVerbose) console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de l'enregistrement de l'utilisateur [KINDE]",
        });
      }
    }),
  login: publicProcedure.input(loginFormSchema).mutation(async ({ input }) => {
    const user = await db.query.users.findFirst({
      where: eq(users.email, input.email),
    });

    if (!user) {
      if (logVerbose)
        console.error(`User ${input.email} is not registered in the database`);
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Vérifiez votre email.",
      });
    }

    return user.id;
  }),
});

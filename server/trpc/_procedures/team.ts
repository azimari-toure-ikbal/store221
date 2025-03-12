// import { teamMemberFormSchema } from "@/lib/validators";
// import { adminProcedure, createTRPCRouter } from "../init";
// import { db } from "@/lib/db";
// import { users } from "@/lib/db/schema";
// import { eq } from "drizzle-orm";

// export const teamRouter = createTRPCRouter({
//   getMembers: adminProcedure.query(async ({ ctx }) => {
//     return await db.query.users.findMany({
//       where: eq(users.role, "ADMIN"),
//     });
//   }),
//   createMember: adminProcedure
//     .input(teamMemberFormSchema)
//     .mutation(async ({ input, ctx }) => {
//       const foundMember = await db.query.users.findFirst({
//         where: or(eq(users.email, input.email), eq(users.phone, input.phone)),
//       });

//       if (foundMember) {
//         if (logVerbose)
//           console.error(`Member with email ${input.email} already exists`);
//         throw new TRPCError({
//           code: "CONFLICT",
//           message: "Action impossible. Membre déjà existant",
//         });
//       }

//       const userId = crypto.randomUUID();

//       // Save the user in KINDE
//       try {
//         const kUserId = await registerUser({
//           id: userId,
//           email: input.email,
//           givenName: input.givenName,
//           familyName: input.familyName,
//           admin: true,
//         });

//         if (!kUserId) {
//           if (logVerbose)
//             console.error(
//               `KINDE user registration failed for user ${userId}. Kinde didn't return an id`,
//             );
//           throw new TRPCError({
//             code: "INTERNAL_SERVER_ERROR",
//             message: "Erreur lors de l'enregistrement de l'utilisateur [KINDE]",
//           });
//         }

//         // Save the user in DB
//         await db.insert(users).values({
//           ...input,
//           role: "ADMIN",
//           id: userId,
//           kindeId: ctx.kindeData.id,
//         });

//         return userId;
//       } catch (error) {
//         if (logVerbose) console.error(error);
//         throw new TRPCError({
//           code: "INTERNAL_SERVER_ERROR",
//           message: "Erreur lors de l'enregistrement de l'utilisateur [KINDE]",
//         });
//       }
//     }),
//   updateMember: adminProcedure
//     .input(
//       z.object({
//         values: teamMemberFormSchema,
//         id: z.string(),
//         kId: z.string(),
//       }),
//     )
//     .mutation(async ({ input, ctx }) => {
//       // console.log("input.values", input);

//       // Check if member exists
//       const foundMember = await db.query.users.findFirst({
//         where: eq(users.id, input.id),
//       });

//       if (!foundMember) {
//         if (logVerbose)
//           console.error(`Member with id ${input.id} does not exist`);
//         throw new TRPCError({
//           code: "NOT_FOUND",
//           message: "Action impossible. Membre introuvable",
//         });
//       }

//       const duplicate = await db.query.users.findFirst({
//         where: and(
//           or(
//             eq(users.email, input.values.email),
//             eq(users.phone, input.values.phone),
//           ),
//           ne(users.id, input.id),
//         ),
//       });

//       if (duplicate) {
//         if (logVerbose)
//           console.error(
//             `Member with email ${input.values.email} already exists`,
//           );
//         throw new TRPCError({
//           code: "CONFLICT",
//           message: "Action impossible. Membre déjà existant",
//         });
//       }

//       // Update the user in KINDE
//       const kUserId = await updateUser({
//         id: input.kId,
//         givenName: input.values.givenName,
//         familyName: input.values.familyName,
//         email: input.values.email,
//       });

//       await db
//         .update(users)
//         .set({
//           ...input.values,
//           updatedAt: new Date().toISOString(),
//         })
//         .where(eq(users.id, input.id));

//       return input;
//     }),
//   deleteMember: adminProcedure
//     .input(z.object({ id: z.string(), kId: z.string() }))
//     .mutation(async ({ input }) => {
//       // Check if member exists
//       const foundMember = await db.query.users.findFirst({
//         where: eq(users.id, input.id),
//       });

//       if (!foundMember) {
//         if (logVerbose) console.error(`Member with id ${input} does not exist`);
//         throw new TRPCError({
//           code: "NOT_FOUND",
//           message: "Action impossible. Membre introuvable",
//         });
//       }

//       await deleteUser(input.kId);
//       await db.delete(users).where(eq(users.id, input.id));

//       return input;
//     }),
// });

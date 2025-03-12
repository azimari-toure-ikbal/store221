import { logVerbose } from "@/config";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError, initTRPC } from "@trpc/server";
import { eq } from "drizzle-orm";
import { cache } from "react";
import superjson from "superjson";

export const createTRPCContext = cache(async () => {});

const t = initTRPC.create({
  transformer: superjson,
});
const middleWare = t.middleware;

const isAuth = middleWare(async (opts) => {
  const { getUser, getOrganization } = getKindeServerSession();

  const user = await getUser();
  const organization = await getOrganization();

  if (!user || !user.id) {
    if (logVerbose) console.error("No user found in isAuth trpc middleware");
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (!user.email) {
    if (logVerbose) console.error("No email found in isAuth trpc middleware");
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (!organization || !organization.orgCode) {
    if (logVerbose)
      console.error("No organization found in isAuth trpc middleware");
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const res = await db.query.users.findFirst({
    where: eq(users.kindeId, user.id),
  });

  if (!res) {
    if (logVerbose)
      console.error("User not found in DB in isAdmin trpc middleware");
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      kindeData: user,
      db: res,
    },
  });
});

const isAdmin = middleWare(async (opts) => {
  const { getUser, getOrganization } = getKindeServerSession();

  const user = await getUser();
  const organization = await getOrganization();

  if (!user || !user.id) {
    if (logVerbose) console.error("No user found in isAuth trpc middleware");
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (!user.email) {
    if (logVerbose) console.error("No email found in isAuth trpc middleware");
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (!organization || !organization.orgCode) {
    if (logVerbose)
      console.error("No organization found in isAuth trpc middleware");
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (organization.orgCode !== process.env.KINDE_ADMIN_ORG) {
    if (logVerbose)
      console.error(
        `Organization ${organization.orgCode} is not the admin organization`
      );
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      kindeData: user,
    },
  });
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
export const adminProcedure = t.procedure.use(isAdmin);

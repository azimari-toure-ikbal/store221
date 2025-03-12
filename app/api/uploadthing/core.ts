import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = async () => {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  if (!user || !user.id) {
    throw new Error("User not found");
  }

  return { userId: user.id };
};

export const ourFileRouter = {
  fabricPicture: f({
    image: {
      maxFileCount: 1,
      maxFileSize: "4MB",
    },
  })
    .middleware(async () => await handleAuth())
    .onUploadComplete(() => {}),
  collarPicture: f({
    image: {
      maxFileCount: 1,
      maxFileSize: "4MB",
    },
  })
    .middleware(async () => await handleAuth())
    .onUploadComplete(() => {}),
  productImages: f({
    image: {
      maxFileSize: "16MB",
      maxFileCount: 15,
    },
  })
    .middleware(async () => await handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

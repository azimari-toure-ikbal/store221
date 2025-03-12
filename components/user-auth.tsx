"use client";

import { GalleryVerticalEnd, UserCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { LoginForm } from "./forms/login-form";
import { RegisterForm } from "./forms/register-form";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

type Props = {};

const Auth = () => {
  const searchParams = useSearchParams();

  const [authType, setAuthType] = React.useState<"login" | "signup">("login");

  React.useEffect(() => {
    if (searchParams.get("type"))
      setAuthType((searchParams.get("type") as "login" | "signup") || "login");
  }, [searchParams]);

  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer">
        <UserCircle className="size-6" />
      </DialogTrigger>
      <DialogContent className="max-w-sm md:max-w-lg">
        <div className="flex w-full flex-col gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Store221.
          </Link>
          {authType === "login" ? (
            <LoginForm setAuthType={setAuthType} />
          ) : (
            <RegisterForm setAuthType={setAuthType} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const UserAuth: React.FC<Props> = (props) => {
  return (
    <Suspense>
      <Auth />
    </Suspense>
  );
};

export default UserAuth;

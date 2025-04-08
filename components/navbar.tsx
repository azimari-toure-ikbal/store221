"use client";

import { NAVBAR_MENU } from "@/config";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Cart from "./cart";
import CurrencySwitcher from "./currency-switcher";
import UserAuth from "./user-auth";
import UserMenu from "./user-menu";

type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = ({}) => {
  const { user, organization } = useKindeBrowserClient();
  const pathname = usePathname();

  if (pathname.includes("/dashboard")) return null;

  // console.log("organization", organization);

  return (
    <header className="bg-background sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl font-bold tracking-tighter">
            AFRIQUE
          </Link>
        </div>
        <nav className="hidden gap-6 md:flex">
          {NAVBAR_MENU.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              {link.title}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {!user || !organization ? (
            <UserAuth />
          ) : (
            <UserMenu
              name={`${user.given_name} ${user.family_name}`}
              org={organization.orgCode || ""}
            />
          )}
          <Cart />
          <CurrencySwitcher />
        </div>
      </div>
    </header>
  );
};

export default Navbar;

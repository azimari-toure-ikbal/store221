"use client";

import { NAVBAR_MENU } from "@/config";
import { useShopFilters } from "@/hooks/use-states";
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

  const [{ filter: shopFilter }] = useShopFilters();

  if (pathname.includes("/dashboard")) return null;

  // console.log("organization", organization);

  return (
    <header className="bg-background sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 py-8 md:px-0">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl font-bold tracking-tighter">
            STORE221.
          </Link>
        </div>
        <nav className="hidden gap-6 md:flex">
          {NAVBAR_MENU.map((link, index) => {
            if (!link.query) {
              return (
                <Link
                  key={index}
                  href={link.hrefBase}
                  className="hover:text-primary text-sm font-medium transition-colors"
                >
                  {link.title}
                </Link>
              );
            }

            const mergedFilters = { ...shopFilter, ...link.query };

            return (
              <Link
                key={index}
                href={{
                  pathname: link.hrefBase,
                  query: {
                    filter: JSON.stringify(mergedFilters),
                  },
                }}
                className="hover:text-primary text-sm font-medium transition-colors"
              >
                {link.title}
              </Link>
            );
          })}
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

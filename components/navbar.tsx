"use client";

import { NAVBAR_MENU } from "@/config";
import { useShopFilters } from "@/hooks/use-states";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Menu, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Cart from "./cart";
import CurrencySwitcher from "./currency-switcher";
import { Button } from "./ui/button";
import UserAuth from "./user-auth";
import UserMenu from "./user-menu";

type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = ({}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const { user, organization } = useKindeBrowserClient();
  const pathname = usePathname();

  const [{ filter: shopFilter }] = useShopFilters();

  if (pathname.includes("/dashboard")) return null;

  // console.log("organization", organization);

  return (
    <header className="bg-background sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 py-8 md:px-0">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold tracking-tighter md:text-xl">
            STORE 221
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
          <div className="pr-4 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              {isOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
            {isOpen && (
              <div className="bg-background animate-in slide-in-from-top-1 fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md">
                <div className="relative z-20 grid gap-6 rounded-md p-4">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    Accueil
                  </Link>
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
                        onClick={() => setIsOpen(false)}
                      >
                        {link.title}
                      </Link>
                    );
                  })}

                  <Link
                    href="/about"
                    className="flex items-center gap-2 text-lg font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    A propos
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

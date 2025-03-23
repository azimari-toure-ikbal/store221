import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CUSTOMERS_MENU } from "@/config";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { Menu } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { extractRouterConfig } from "uploadthing/server";

type CustomerDashboardLayoutProps = { children: React.ReactNode };

export const metadata: Metadata = {
  title: "Dashboard Client | Minebar Déco",
  description: "Tableau de bord de l'application Minebar Déco",
};

const CustomerDashboardLayout: React.FC<CustomerDashboardLayoutProps> = ({
  children,
}) => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto flex flex-grow flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex h-full flex-col sm:flex-row">
          {/* Sidebar for mobile */}
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button size={"icon"}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex h-full flex-col gap-2 pt-12">
                  {CUSTOMERS_MENU.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 rounded-md px-4 py-2 transition-colors duration-200 hover:bg-gray-100"
                    >
                      {<item.icon />}
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Sidebar for desktop */}
          <div className="hidden h-full w-64 flex-shrink-0 sm:block">
            <div className="sticky top-16 mt-4 rounded-2xl border border-black p-4">
              <nav className="space-y-2">
                {CUSTOMERS_MENU.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 rounded-md px-4 py-2 transition-colors duration-200 hover:bg-gray-100"
                  >
                    {<item.icon />}
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main content */}
          <main
            className="mt-4 flex-grow overflow-y-auto sm:mt-4 sm:ml-4"
            style={{ height: "calc(80vh - 5rem)" }}
          >
            <div className="h-full rounded-2xl border border-black bg-white p-4">
              <NextSSRPlugin
                routerConfig={extractRouterConfig(ourFileRouter)}
              />
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboardLayout;

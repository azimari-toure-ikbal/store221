import { ADMINS_MENU, CUSTOMERS_MENU } from "@/config";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserAvatar from "./user-avatar";

type UserMenuProps = { name: string; org: string };

const UserMenu: React.FC<UserMenuProps> = ({ name, org }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <UserAvatar name={name} className="rounded-full" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        {/* Customers menu */}
        {org === process.env.NEXT_PUBLIC_KINDE_CLIENT_ORG && (
          <ul className="flex flex-col gap-2">
            {CUSTOMERS_MENU.map((item, index) => (
              <Link href={item.href} key={index}>
                <DropdownMenuItem className="w-full cursor-pointer">
                  <item.icon />
                  <span className="ml-2">{item.title}</span>
                </DropdownMenuItem>
              </Link>
            ))}
            <DropdownMenuItem className="text-red-500 hover:text-red-500 focus:text-red-500">
              <LogoutLink className="flex items-center">
                <LogOut />
                <span className="ml-2">Déconnexion</span>
              </LogoutLink>
            </DropdownMenuItem>
          </ul>
        )}

        {/* Admins menu */}
        {org === process.env.NEXT_PUBLIC_KINDE_ADMIN_ORG && (
          <ul className="flex flex-col gap-1">
            {ADMINS_MENU.map((item, index) => (
              <Link href={item.href} key={index} className="flex items-center">
                <DropdownMenuItem className="w-full cursor-pointer">
                  <item.icon className="size-4" />
                  <span className="ml-2">{item.title}</span>
                </DropdownMenuItem>
              </Link>
            ))}
            <DropdownMenuItem className="text-red-500 hover:text-red-500 focus:text-red-500">
              <LogoutLink className="flex items-center">
                <LogOut />
                <span className="ml-2">Déconnexion</span>
              </LogoutLink>
            </DropdownMenuItem>
          </ul>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;

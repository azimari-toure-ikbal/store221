"use client";

import { ArrowLeft, ChevronsUpDown, LogOut, User2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { trpc } from "@/server/trpc/client";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";
import UserAvatar from "../user-avatar";

export function NavUser() {
  const { isMobile } = useSidebar();

  const { data: user, isLoading } = trpc.users.getCurrentUser.useQuery();

  if (isLoading)
    return (
      <div className="h-12 w-full animate-pulse rounded-lg bg-zinc-200"></div>
    );

  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar name={`${user.givenName} ${user.familyName}`} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user.givenName} {user.familyName}
                </span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar name={`${user.givenName} ${user.familyName}`} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.givenName} {user.familyName}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link
                href={"/dashboard/profile"}
                className="flex w-full cursor-pointer items-center"
              >
                <DropdownMenuItem className="w-full cursor-pointer">
                  <User2 />
                  <span>Profil</span>
                </DropdownMenuItem>
              </Link>
              <Link
                href={"/"}
                className="flex w-full cursor-pointer items-center"
              >
                <DropdownMenuItem className="w-full cursor-pointer">
                  <ArrowLeft />
                  <span>Page d&apos;accueil</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500 hover:text-red-500 focus:text-red-500">
              <LogoutLink className="flex items-center">
                <LogOut />
                <span className="ml-2">Déconnexion</span>
              </LogoutLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

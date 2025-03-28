"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DBUser } from "@/lib/db/schema/index";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowUpDown } from "lucide-react";
import UsersActions from "./users-actions";

export const usersColumns: ColumnDef<DBUser>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "givenName",
    header: "Nom",
    cell: ({ row }) => {
      return (
        <span>
          {row.original.givenName} {row.original.familyName}
        </span>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  // {
  //   accessorKey: "id",
  //   header: "ID",
  // },
  // {
  //   accessorKey: "kindeId",
  //   header: "KID",
  // },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Créé le
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span>
          {format(new Date(row.original.createdAt || ""), "PPP à HH:mm", {
            locale: fr,
          })}
        </span>
      );
    },
  },
  // {
  //   accessorKey: "updatedAt",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant={"ghost"}
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Dernière modification
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     return (
  //       <span>
  //         {format(new Date(row.original.updatedAt || ""), "PPP à HH:mm", {
  //           locale: fr,
  //         })}
  //       </span>
  //     );
  //   },
  // },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <UsersActions row={row} />;
    },
  },
];

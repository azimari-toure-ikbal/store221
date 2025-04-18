"use client";

import CustomBadge from "@/components/custom-badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { CartResponse } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowUpDown } from "lucide-react";
import CartsItemsDialog from "./carts-items-dialog";

export const cartsColumns: ColumnDef<CartResponse>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  // },
  {
    accessorKey: "user",
    header: "Acheteur",
    cell: ({ row }) => {
      if (!row.original.user) {
        return <span>Anonyme</span>;
      }

      return (
        <span>
          {row.original.user?.givenName} {row.original.user?.familyName}
        </span>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Montant",
    cell: ({ row }) => {
      const items = row.original.items;
      const total = items.reduce((acc, item) => acc + item.price, 0);

      return <span>{formatPrice(total, "XOF")}</span>;
    },
  },
  {
    accessorKey: "items",
    header: "Articles",
    cell: ({ row }) => {
      return <CartsItemsDialog items={row.original.items} />;
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      return <CustomBadge status={row.original.status as any} />;
    },
  },
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
  //   id: "actions",
  //   header: "Actions",
  //   cell: ({ row }) => {
  //     return <CartsActions row={row} />;
  //   },
  // },
];

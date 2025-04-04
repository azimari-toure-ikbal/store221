"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DBProduct } from "@/lib/db/schema/index";
import { formatPrice } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowUpDown } from "lucide-react";
import ProductsActions from "./products-actions";
import CustomBadge from "@/components/custom-badge";

export const productsColumns: ColumnDef<DBProduct>[] = [
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
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "price",
    header: "Tarif",
    cell: ({ row }) => {
      return <span>{formatPrice(Number(row.original.price), "XOF")}</span>;
    },
  },
  {
    accessorKey: "sizes",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "seller",
    header: "Vendeur",
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
      return <ProductsActions row={row} />;
    },
  },
];

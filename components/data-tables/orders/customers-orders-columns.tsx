"use client";

import CustomBadge from "@/components/custom-badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { OrderResponse } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowUpDown } from "lucide-react";
import OrderDeliveryZoneDialog from "./order-delivery-zone-dialog";
import OrdersItemsDialog from "./orders-items-dialog";

export const customersOrdersColumns: ColumnDef<OrderResponse>[] = [
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
  // {
  //   accessorKey: "user",
  //   header: "Acheteur",
  //   cell: ({ row }) => {
  //     if (!row.original.user) {
  //       return <span>Anonyme</span>;
  //     }

  //     return (
  //       <span>
  //         {row.original.user?.givenName} {row.original.user?.familyName}
  //       </span>
  //     );
  //   },
  // },
  {
    accessorKey: "totalPaid",
    header: "Total payé",
    cell: ({ row }) => {
      const totalPaid = Number(row.original.totalPaid);

      return <span>{formatPrice(totalPaid, "XOF")}</span>;
    },
  },
  {
    accessorKey: "deliveryPrice",
    header: "Montant livraison",
    cell: ({ row }) => {
      const deliveryPrice = Number(row.original.deliveryPrice);

      return <span>{formatPrice(deliveryPrice, "XOF")}</span>;
    },
  },
  {
    accessorKey: "delivery",
    header: "Adresse de livraison",
    cell: ({ row }) => {
      const delivery = row.original.delivery;

      return <OrderDeliveryZoneDialog deliveryZone={delivery} />;
    },
  },
  {
    accessorKey: "cart",
    header: "Panier",
    cell: ({ row }) => {
      return <OrdersItemsDialog cart={row.original.cart} />;
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

"use client";

import CustomBadge from "@/components/custom-badge";
import IsLoading from "@/components/is-loading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/server/trpc/client";
import { OrderResponse } from "@/types";
import React from "react";
import { toast } from "sonner";

type OrderStatusesProps = {
  order: OrderResponse;
};

const statuses = [
  "preparation",
  "shipping",
  "delivered",
  "refunded",
  "canceled",
];

const OrderStatuses: React.FC<OrderStatusesProps> = ({ order }) => {
  const [open, setOpen] = React.useState(false);

  const utils = trpc.useUtils();

  const { mutate: updateStatus, isPending: updatingStatus } =
    trpc.orders.updateOrderStatus.useMutation({
      onSuccess: (data) => {
        toast.success("Statut modifié avec succès");
        utils.orders.getOrders.invalidate();
      },
      onError: (error, input, context) => {
        toast.error(error.message);
      },
    });

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="cursor-pointer" disabled={updatingStatus}>
        {updatingStatus ? (
          <IsLoading />
        ) : (
          <CustomBadge status={order.status as any} />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex w-fit flex-col gap-2">
        <DropdownMenuLabel>Changer le statut</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {statuses.map((s, index) => (
          <div
            key={index}
            className="w-full cursor-pointer"
            onClick={() => {
              updateStatus({
                orderId: order.id,
                status: s.toUpperCase() as any,
              });
              setOpen(false);
            }}
          >
            <CustomBadge status={s as any} />
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrderStatuses;

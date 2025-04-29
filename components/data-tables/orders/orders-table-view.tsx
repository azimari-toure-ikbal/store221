"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/server/trpc/client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import React from "react";
import { customersOrdersColumns } from "./customers-orders-columns";
import { ordersColumns } from "./orders-columns";
import { OrdersTable } from "./orders-table";

type OrdersTableViewProps = {};

const OrdersTableView: React.FC<OrdersTableViewProps> = ({}) => {
  const { data, isLoading } = trpc.orders.getOrders.useQuery();

  const { organization } = useKindeBrowserClient();

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (!data) {
    return <div>Aucune commande...</div>;
  }

  return (
    <OrdersTable
      columns={
        organization?.orgCode === process.env.NEXT_PUBLIC_KINDE_CLIENT_ORG
          ? customersOrdersColumns
          : ordersColumns
      }
      data={data}
    />
  );
};

export default OrdersTableView;

"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/server/trpc/client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import React from "react";
import { cartsColumns } from "./carts-columns";
import { CartsTable } from "./carts-table";
import { userCartsColumns } from "./user-carts-columns";

type CartsTableViewProps = {};

const CartsTableView: React.FC<CartsTableViewProps> = ({}) => {
  const { data, isLoading } = trpc.carts.getCarts.useQuery();

  const { organization } = useKindeBrowserClient();

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (!data) {
    return <div>Aucune commande...</div>;
  }

  return (
    <CartsTable
      columns={
        organization?.orgCode === process.env.NEXT_PUBLIC_KINDE_CLIENT_ORG
          ? userCartsColumns
          : cartsColumns
      }
      data={data}
    />
  );
};

export default CartsTableView;

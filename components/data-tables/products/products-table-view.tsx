"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/server/trpc/client";
import React from "react";
import { productsColumns } from "./products-columns";
import { ProductsTable } from "./products-table";

type ProductsTableViewProps = {};

const ProductsTableView: React.FC<ProductsTableViewProps> = ({}) => {
  const { data, isLoading } = trpc.products.getProducts.useQuery();

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (!data) {
    return <div>Aucun utilisateur...</div>;
  }

  return <ProductsTable columns={productsColumns} data={data} />;
};

export default ProductsTableView;

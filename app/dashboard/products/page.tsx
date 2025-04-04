export const dynamic = "force-dynamic";

import ProductsTableView from "@/components/data-tables/products/products-table-view";
import { buttonVariants } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

type DashboardProductsPageProps = {};

const DashboardProductsPage: React.FC<DashboardProductsPageProps> = ({}) => {
  return (
    <div className="main">
      <Link
        href={"/dashboard/products/new"}
        className={buttonVariants({
          className: "w-fit",
        })}
      >
        <PlusCircle />
        <span>Nouveau produit</span>
      </Link>
      <ProductsTableView />
    </div>
  );
};

export default DashboardProductsPage;

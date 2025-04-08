import CartsTableView from "@/components/data-tables/carts/carts-table-view";
import React from "react";

type DashboardCartsPageProps = {};

const DashboardCartsPage: React.FC<DashboardCartsPageProps> = ({}) => {
  return (
    <div className="main">
      <CartsTableView />
    </div>
  );
};

export default DashboardCartsPage;

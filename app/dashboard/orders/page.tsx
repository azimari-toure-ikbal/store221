import OrdersTableView from "@/components/data-tables/orders/orders-table-view";
import React from "react";

type DashboardOrdersProps = {};

const DashboardOrders: React.FC<DashboardOrdersProps> = ({}) => {
  return (
    <div className="main">
      <OrdersTableView />
    </div>
  );
};

export default DashboardOrders;

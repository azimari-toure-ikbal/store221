"use client";

import { trpc } from "@/server/trpc/client";
import React from "react";
import CheckoutForm from "./checkout-form";
import OrderSummary from "./order-summary";

type CheckoutViewProps = {};

const CheckoutView: React.FC<CheckoutViewProps> = ({}) => {
  const [user] = trpc.users.getCurrentUser.useSuspenseQuery();

  return (
    <div className="container mx-auto h-full w-full pt-12">
      <div className="grid h-full w-full grid-cols-1 gap-6 md:grid-cols-12">
        <div className="h-full md:col-span-7">
          <CheckoutForm user={user} />
        </div>
        <div className="relative h-full md:col-span-5">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;

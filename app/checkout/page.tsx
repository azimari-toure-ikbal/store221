export const dynamic = "force-dynamic";

import CheckoutView from "@/components/shop/checkout-view";
import { HydrateClient, trpc } from "@/server/trpc/server";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type CheckoutPageProps = {};

const CheckoutPage: React.FC<CheckoutPageProps> = async ({}) => {
  void trpc.users.getCurrentUser.prefetch();

  return (
    <HydrateClient>
      <Suspense fallback={<p>Loading...</p>}>
        <ErrorBoundary fallback={<p>An error occurred</p>}>
          <CheckoutView />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
};

export default CheckoutPage;

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
      <Suspense
        fallback={
          <div className="container mx-auto h-full w-full pt-12">
            <div className="grid h-full w-full grid-cols-1 gap-6 md:grid-cols-12">
              <div className="h-[32rem] w-full animate-pulse rounded-md bg-zinc-200 md:col-span-7"></div>
              <div className="relative h-52 w-full animate-pulse rounded-md bg-zinc-200 md:col-span-5"></div>
            </div>
          </div>
        }
      >
        <ErrorBoundary fallback={<p>An error occurred</p>}>
          <CheckoutView />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
};

export default CheckoutPage;

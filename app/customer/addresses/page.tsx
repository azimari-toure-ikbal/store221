export const dynamic = "force-dynamic";

import CustomerAddressesView from "@/components/customers/customer-addresses-view";
import { HydrateClient, trpc } from "@/server/trpc/server";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type CustomerAddressesPageProps = {};

const CustomerAddressesPage: React.FC<CustomerAddressesPageProps> = ({}) => {
  void trpc.userAddresses.getUserAddresses.prefetch();

  return (
    <HydrateClient>
      <Suspense fallback={<p>Loading...</p>}>
        <ErrorBoundary fallback={<p>An error occurred</p>}>
          <CustomerAddressesView />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
};

export default CustomerAddressesPage;

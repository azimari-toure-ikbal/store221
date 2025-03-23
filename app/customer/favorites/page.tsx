export const dynamic = "force-dynamic";

import CustomerFavoritesView from "@/components/customers/customer-favorites-view";
import { HydrateClient, trpc } from "@/server/trpc/server";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type CustomerFavoritesPageProps = {};

const CustomerFavoritesPage: React.FC<
  CustomerFavoritesPageProps
> = async ({}) => {
  void trpc.favorites.getUserFavorites.prefetch();

  return (
    <HydrateClient>
      <Suspense fallback="Loading...">
        <ErrorBoundary fallback={<div>Error</div>}>
          <CustomerFavoritesView />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
};

export default CustomerFavoritesPage;

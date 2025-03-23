export const dynamic = "force-dynamic";

import CustomerIndexView from "@/components/customers/customer-index-view";
import { Skeleton } from "@/components/ui/skeleton";
import { HydrateClient, trpc } from "@/server/trpc/server";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type CustomerDashboardPageProps = {};

const CustomerDashboardPage: React.FC<
  CustomerDashboardPageProps
> = async ({}) => {
  void trpc.users.getCurrentUser.prefetch();

  return (
    <HydrateClient>
      <Suspense
        fallback={
          <div className="left-right-layout">
            <div className="left-col">
              <Skeleton className="h-56 w-2/3" />
            </div>
            <div className="right-col">
              {[...Array(4)].map((_, index) => (
                <Skeleton className="h-36 w-full" key={index} />
              ))}
            </div>
          </div>
        }
      >
        <ErrorBoundary fallback={<p>An error occurred</p>}>
          <CustomerIndexView />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
};

export default CustomerDashboardPage;

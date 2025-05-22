"use client";

import { useShopFilters } from "@/hooks/use-states";
import { ProductTypes } from "@/lib/db/schema";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

type CollectionCardProps = {
  title: string;
  image: string;
  type: ProductTypes;
};

const CollectionCard: React.FC<CollectionCardProps> = ({
  image,
  title,
  type,
}) => {
  const [{ filter: shopFilter }] = useShopFilters();

  return (
    <div className="group relative overflow-hidden rounded-lg">
      {/* <div className="absolute inset-0 z-10 bg-black/30 transition-colors group-hover:bg-black/40" /> */}
      <img
        src={image}
        alt={title}
        className="w-full rounded-lg object-fill transition-transform group-hover:scale-95"
      />
      <div className="absolute inset-0 z-20 flex items-end p-6">
        <div className="text-primary space-y-2">
          <h3 className="text-xl font-bold">{title}</h3>
          <Button variant="secondary" asChild>
            <Link
              href={{
                pathname: "/shop",
                query: {
                  filter: JSON.stringify({
                    ...shopFilter,
                    productType: type,
                  }),
                },
              }}
              shallow
            >
              Voir plus
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;

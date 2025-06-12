"use client";

import { useShopFilters } from "@/hooks/use-states";
import { ProductTypes } from "@/lib/db/schema";
import Link from "next/link";
import React from "react";
import { Badge } from "./ui/badge";
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
        className="h-[600px] w-full rounded-lg object-cover transition-transform group-hover:scale-105 xl:h-[700px]"
      />
      <div className="absolute inset-0 z-20 flex w-full items-end p-6">
        <div className="text-primary flex w-full flex-col items-center space-y-2">
          <Badge variant={"default"}>{title}</Badge>
          <Button variant="secondary" className="w-fit" size={"sm"} asChild>
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

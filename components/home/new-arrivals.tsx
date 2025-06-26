"use client";

import { currencyAtom } from "@/lib/atoms";
import { calcDiscountPercentage, formatPrice } from "@/lib/utils";
import { trpc } from "@/server/trpc/client";
import { useAtomValue } from "jotai";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type NewArrivalsProps = {};

const NewArrivals: React.FC<NewArrivalsProps> = ({}) => {
  const { data: products, isLoading } = trpc.products.getNewProducts.useQuery();

  const currency = useAtomValue(currencyAtom);

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Nouveaux produits
            </h2>
            <p className="text-muted-foreground mx-auto max-w-[700px] md:text-lg">
              Nos derniers vêtements authentiques, confectionnés avec précision
              et soin.
            </p>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {isLoading &&
            [...Array(4)].map((_, index) => (
              <div
                key={index}
                className="h-64 w-full animate-pulse rounded-lg bg-zinc-100"
              ></div>
            ))}

          {!isLoading &&
            products &&
            products.map((product, index) => (
              <div
                key={product.id}
                className="group bg-background relative overflow-hidden rounded-lg border p-2"
              >
                <div className="bg-muted h-72 overflow-hidden rounded-md">
                  <img
                    src={product.gallery[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-fill transition-transform group-hover:scale-105"
                  />
                </div>
                {product.discountedPrice &&
                  Number(product.discountedPrice) > 0 && (
                    <div className="absolute top-3 left-5 flex items-center gap-2">
                      <Badge variant={"secondary"} className="w-fit font-bold">
                        {calcDiscountPercentage(
                          Number(product.price),
                          Number(product.discountedPrice),
                        )}
                        %
                      </Badge>
                    </div>
                  )}
                <div className="pt-3 pb-2">
                  <h3 className="text-sm font-medium">{product.name}</h3>
                  <div className="flex flex-col gap-2 pt-2">
                    {product.discountedPrice &&
                    Number(product.discountedPrice) > 0 ? (
                      <div className="flex items-center gap-4">
                        <p className="text-muted-foreground text-sm line-through">
                          {formatPrice(
                            Number(product.price),
                            currency.code,
                            currency.rate,
                          )}
                        </p>
                        <p className="text-primary font-semibold">
                          {formatPrice(
                            Number(product.discountedPrice),
                            currency.code,
                            currency.rate,
                          )}
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        {formatPrice(
                          Number(product.price),
                          currency.code,
                          currency.rate,
                        )}
                      </p>
                    )}
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/shop/${product.id}`}>Voir le produit</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild>
            <Link href={"/shop"} className="gap-1">
              Tous les produits
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;

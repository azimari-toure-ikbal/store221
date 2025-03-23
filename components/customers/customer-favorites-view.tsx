"use client";

import { Button } from "@/components/ui/button";
import { trpc } from "@/server/trpc/client";
import { XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

type CustomerFavoritesViewProps = {};

const CustomerFavoritesView: React.FC<CustomerFavoritesViewProps> = ({}) => {
  const utils = trpc.useUtils();

  const [favorites] = trpc.favorites.getUserFavorites.useSuspenseQuery();
  const { mutate: removeFav, isPending: toggling } =
    trpc.favorites.removeFavorite.useMutation({
      onSuccess: () => {
        utils.favorites.getUserFavorites.invalidate();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return (
    <div className="flex h-full w-full flex-col gap-6">
      <h3 className="border-b pb-2 text-xl">
        Mes favoris ({favorites.length})
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {favorites.map((fav) => (
          <div key={fav.id} className="flex flex-col gap-2 p-4">
            <div className="relative aspect-square h-full w-full">
              <Image
                alt={fav.product.name}
                src={fav.product.gallery[0]}
                fill
                className="object-cover"
              />
              <Button
                size={"icon"}
                variant={"destructive"}
                className="absolute top-2 right-2 size-7"
                disabled={toggling}
                onClick={() => {
                  removeFav({
                    favId: fav.id,
                  });
                }}
              >
                <XIcon />
              </Button>
            </div>
            <Link
              href={`/shop/products${fav.product.id}`}
              className="text-lg hover:underline"
            >
              {fav.product.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerFavoritesView;

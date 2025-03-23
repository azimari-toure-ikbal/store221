"use client";

import { cn } from "@/lib/utils";
import { trpc } from "@/server/trpc/client";
import { HeartIcon, SquareArrowOutUpLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type ProductDetailActionsProps = {
  id: string;
  title: string;
};

const ProductDetailActions: React.FC<ProductDetailActionsProps> = ({
  id,
  title,
}) => {
  const utils = trpc.useUtils();

  const { data: isFav } = trpc.favorites.isFavorite.useQuery({
    id,
  });
  const { mutate: toggleFav, isPending: toggling } =
    trpc.favorites.toggleFavorite.useMutation({
      onSuccess: () => {
        utils.favorites.isFavorite.invalidate({ id });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const url = `https://store221.com/shop/${id}`;

  return (
    <div className="space-x-4">
      {isFav !== undefined && (
        <Button
          variant={"secondary"}
          disabled={toggling}
          onClick={() => toggleFav({ id, isFav })}
        >
          <HeartIcon
            className={cn({
              "fill-rose-600 text-rose-700": isFav,
            })}
          />
          <span>Favoris</span>
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"secondary"}>
            <SquareArrowOutUpLeft />
            <span>Partager</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link
              href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
              target="_blank"
            >
              Facebook
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href={`whatsapp://send?text=Découvrez l'annonce ${title} sur samaweekend.com, ${url}`}
              data-action="share/whatsapp/share"
              target="_blank"
            >
              Whatsapp
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              rel="canonical"
              href={`https://twitter.com/intent/tweet?text=Découvrez l'annonce ${title} sur samaxew.com, ${url}`}
              target="_blank"
            >
              Twitter
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProductDetailActions;

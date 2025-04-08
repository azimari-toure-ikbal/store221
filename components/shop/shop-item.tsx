"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CartItem } from "@/config";
import { useCart } from "@/hooks/use-cart";
import { currencyAtom } from "@/lib/atoms";
import { formatPrice, getWeight } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { Info, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import IsLoading from "../is-loading";
import { Button } from "../ui/button";

interface ShoppingCartItemProps {
  item: CartItem;
}

export function ShoppingCartItem({ item }: ShoppingCartItemProps) {
  const currency = useAtomValue(currencyAtom);

  const { name, image, quantity, price, options, productType } = item;

  // Filter out undefined options
  const validOptions = Object.entries(options).filter(
    ([_, value]) => value !== undefined,
  );

  const { removeProductFromCart, removing, droppingCart, surMesureTotal } =
    useCart();

  return (
    <div className="flex items-start gap-4 p-4">
      <div className="flex-shrink-0">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          width={80}
          height={80}
          className="rounded-md border object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Link
              href={`/shop/${item.productId}`}
              className="truncate font-medium"
            >
              {name}
            </Link>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground">
                  <Info size={16} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Options</h4>
                  <ul className="space-y-1 text-sm">
                    {validOptions.map(([key, value]) => (
                      <li key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">
                          {key === "pantFit"
                            ? "Coupe du pantalon"
                            : key === "pantLeg"
                              ? "Bas du pantalon"
                              : key === "sleevesLength"
                                ? "Longueur des manches"
                                : key === "collarType"
                                  ? "Type de col"
                                  : key === "wristsType"
                                    ? "Type de poignets"
                                    : "Taille"}
                          :
                        </span>
                        <span>{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="text-right">
            <div className="font-medium">
              {formatPrice(price * quantity, currency.code, currency.rate)}
            </div>
            <div className="text-muted-foreground text-xs">
              {formatPrice(price, currency.code, currency.rate)}
            </div>
          </div>
        </div>

        <div className="mt-1 flex items-center justify-between text-sm">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <span className="text-xs">Qte: {quantity}</span>
              <span className="text-muted-foreground text-xs">
                Poids: {(getWeight(productType) * quantity).toFixed(2)} kg
              </span>
            </div>
            {item.options.size === "sur-mesure" && (
              <div className="flex items-center gap-4">
                <span className="text-xs">Sur-mesure</span>
                <span className="text-muted-foreground text-xs">
                  +{formatPrice(surMesureTotal, currency.code, currency.rate)}
                </span>
              </div>
            )}
          </div>
          <Button
            size={"icon"}
            className="size-7"
            disabled={removing || droppingCart}
            onClick={() => removeProductFromCart(item)}
          >
            {removing ? <IsLoading /> : <Trash2 />}
          </Button>
        </div>
      </div>
    </div>
  );
}

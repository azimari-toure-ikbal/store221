"use client";

import { useCart } from "@/hooks/use-cart";
import { useIsMobile } from "@/hooks/use-mobile";
import { currencyAtom } from "@/lib/atoms";
import { cn, formatPrice } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import IsLoading from "./is-loading";
import { ShoppingCartItem } from "./shop/shop-item";
import { Button, buttonVariants } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

type CartProps = {};

const Cart: React.FC<CartProps> = ({}) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  const currency = useAtomValue(currencyAtom);

  const {
    cart,
    cartItemsLength,
    totalWeight,
    subTotal,
    surMesureTotal,
    initialsTotal,
    dropCart,
    removing,
    droppingCart,
  } = useCart();

  // console.log("cartItemsLength", cartItemsLength);
  // console.log("cart", cart);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button size="sm">
            <ShoppingCartIcon />({cartItemsLength})
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Votre panier</DrawerTitle>
          </DrawerHeader>
          {!cart && (
            <div className="flex h-full w-full flex-col items-center gap-4 pt-48">
              <p className="text-muted-foreground">
                Vous n&apos;avez pas de panier.
              </p>
              <Link
                href="/shop"
                onClick={() => setOpen(false)}
                className={buttonVariants()}
              >
                Boutique
              </Link>
            </div>
          )}

          {cart && (
            <div className="flex h-full w-full flex-col overflow-hidden">
              <div className="h-full flex-1 divide-y">
                {cart.items.map((item, index) => (
                  <ShoppingCartItem key={index} item={item} />
                ))}
              </div>
              <div className="space-y-4 border-t p-4">
                <div className="flex justify-between text-sm">
                  <span>Poids total:</span>
                  <span>~{totalWeight} kg</span>
                </div>
                {surMesureTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Supplément sur-mesure:</span>
                    <span>
                      {formatPrice(
                        surMesureTotal,
                        currency.code,
                        currency.rate,
                      )}
                    </span>
                  </div>
                )}
                {initialsTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Supplément pour les initiales:</span>
                    <span>
                      {formatPrice(initialsTotal, currency.code, currency.rate)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-semibold">
                  <span>Sous-total:</span>
                  <span>
                    {formatPrice(subTotal, currency.code, currency.rate)}
                  </span>
                </div>
                <Link
                  href={"/checkout"}
                  onClick={() => setOpen(false)}
                  className={buttonVariants({
                    className: cn("w-full", {
                      "pointer-events-none cursor-not-allowed":
                        droppingCart || removing,
                    }),
                  })}
                >
                  Procéder au paiement
                </Link>
                <Button
                  disabled={droppingCart}
                  variant={"outline"}
                  className="w-full"
                  onClick={() => dropCart()}
                >
                  {droppingCart ? <IsLoading /> : "Abandonner le panier"}
                </Button>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm">Panier ({cartItemsLength})</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Votre panier</SheetTitle>
        </SheetHeader>
        {!cart && (
          <div className="flex h-full w-full flex-col items-center gap-4 pt-48">
            <p className="text-muted-foreground">
              Vous n&apos;avez pas de panier.
            </p>
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className={buttonVariants()}
            >
              Boutique
            </Link>
          </div>
        )}

        {cart && (
          <div className="flex h-full w-full flex-col overflow-hidden">
            <div className="h-full flex-1 divide-y">
              {cart.items.map((item, index) => (
                <ShoppingCartItem key={index} item={item} />
              ))}
            </div>
            <div className="space-y-4 border-t p-4">
              <div className="flex justify-between text-sm">
                <span>Poids total:</span>
                <span>~{totalWeight} kg</span>
              </div>
              {surMesureTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Supplément sur-mesure:</span>
                  <span>
                    {formatPrice(surMesureTotal, currency.code, currency.rate)}
                  </span>
                </div>
              )}
              {initialsTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Supplément pour les initiales:</span>
                  <span>
                    {formatPrice(initialsTotal, currency.code, currency.rate)}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-semibold">
                <span>Sous-total:</span>
                <span>
                  {formatPrice(subTotal, currency.code, currency.rate)}
                </span>
              </div>
              <Link
                href={"/checkout"}
                onClick={() => setOpen(false)}
                className={buttonVariants({
                  className: cn("w-full", {
                    "pointer-events-none cursor-not-allowed":
                      droppingCart || removing,
                  }),
                })}
              >
                Procéder au paiement
              </Link>
              <Button
                disabled={droppingCart}
                variant={"outline"}
                className="w-full"
                onClick={() => dropCart()}
              >
                {droppingCart ? <IsLoading /> : "Abandonner le panier"}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;

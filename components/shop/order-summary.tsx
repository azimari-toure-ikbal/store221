"use client";

import { useCart } from "@/hooks/use-cart";
import { currencyAtom } from "@/lib/atoms";
import { formatPrice } from "@/lib/utils";
import { useAtomValue } from "jotai";
import React from "react";
import { Separator } from "../ui/separator";

type OrderSummaryProps = {};

const OrderSummary: React.FC<OrderSummaryProps> = ({}) => {
  const { subTotal, total, deliveryPrice } = useCart();
  const currency = useAtomValue(currencyAtom);

  return (
    <div className="flex h-fit w-full flex-col gap-4 rounded-2xl border p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span>Sous-Total</span>
          <span>{formatPrice(subTotal, currency.code, currency.rate)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Livraison</span>
          {deliveryPrice === -1 && <span>A déterminer</span>}
          {deliveryPrice >= 0 && (
            <span>
              {formatPrice(deliveryPrice, currency.code, currency.rate)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Total</span>
          <span className="font-semibold">
            {formatPrice(total, currency.code, currency.rate)}
          </span>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-2">
        <span className="font-semibold">Méthode de paiement</span>
        <div className="relative h-14 w-full">
          <img alt="paytech" src={"/paytech.png"} className="object-fill" />
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

"use client";

import { useCart } from "@/hooks/use-cart";
import { currencyAtom, deliveryZoneAtom } from "@/lib/atoms";
import { formatPrice } from "@/lib/utils";
import { PayPalBody } from "@/types";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { Separator } from "../ui/separator";

type OrderSummaryProps = {};

const OrderSummary: React.FC<OrderSummaryProps> = ({}) => {
  const router = useRouter();
  const { subTotal, total, deliveryPrice, cart } = useCart();
  const currency = useAtomValue(currencyAtom);
  const deliveryZone = useAtomValue(deliveryZoneAtom);

  const [{ isPending }] = usePayPalScriptReducer();

  const onCreateOrder = async () => {
    if (!cart) return toast.error("Pas de panier");

    try {
      const payload: PayPalBody = {
        items: cart.items.map((item) => ({
          name: item.name,
          quantity: String(item.quantity),
          unit_amount: {
            currency_code: currency.code,
            value: String(item.price),
          },
        })),
        amount: {
          currency_code: currency.code,
          value: String(Math.round(total)),
          breakdown: {
            item_total: {
              currency_code: currency.code,
              value: String(Math.round(subTotal)),
            },
            shipping: {
              currency_code: currency.code,
              value: String(Math.round(deliveryPrice)),
            },
          },
        },
      };

      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // console.log("orderId", data.orderId.id);

      return data.orderId.id;
    } catch (e) {
      toast.error("Erreur lors de la création de la commande");
    }
  };

  const onApprove = async (data: any) => {
    try {
      if (!cart) return;

      if (!data?.orderID) throw new Error("orderID is undefined");

      const payload = {
        cartId: cart.id,
        deliveryZone,
        deliveryPrice: deliveryPrice,
        totalPaid: total,
      };

      await fetch(`/api/paypal/capture/${data.orderID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      router.push("/sale-success");
    } catch (e) {
      toast.error("Erreur lors de l'approbation de la commande");
      router.push("/sale-canceled");
    }
  };

  const onError = async (error: any) => {
    toast.error(`Erreur Paypal: ${error}`);
    router.push("/sale-canceled");
  };

  return (
    <div className="h-full w-full space-y-4">
      <div className="flex h-fit w-full flex-col gap-4 rounded-2xl bg-white p-4">
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

      <div className="w-full rounded-2xl bg-white p-4">
        {isPending ? (
          <div className="h-10 w-full animate-pulse rounded-xl bg-zinc-100" />
        ) : (
          <PayPalButtons
            disabled={!deliveryZone}
            createOrder={onCreateOrder}
            onApprove={onApprove}
            onError={onError}
            fundingSource="paypal"
          />
        )}
      </div>
    </div>
  );
};

export default OrderSummary;

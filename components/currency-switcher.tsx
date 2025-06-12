"use client";

import { currencyAtom } from "@/lib/atoms";
import { cn } from "@/lib/utils";
import { trpc } from "@/server/trpc/client";
import { useAtom } from "jotai";
import React from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type CurrencySwitcherProps = {};

const CurrencySwitcher: React.FC<CurrencySwitcherProps> = ({}) => {
  const [currencies, query] = trpc.rates.getRates.useSuspenseQuery(undefined, {
    // staleTime: 60 * 60 * 1000, // 1 hour
  });

  // We will refetch the rates every X time because it should have been updated in the DB
  // React.useEffect(() => {
  //   if (query.isStale) {
  //     query.refetch();
  //   }
  // }, [query]);

  const [currency, setCurrency] = useAtom(currencyAtom);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"icon"} className="size-8 text-xs">
          {currency.code}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choix de la devise</DialogTitle>
          <DialogDescription>
            Choisissez ici la devise que vous souhaite utiliser. Nous calculons
            les taux chaque heure.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {currencies.map((c, index) => (
            <div
              key={c.id}
              className={cn(
                "hover:border-primary hover:text-primary flex cursor-pointer flex-col gap-2 rounded-lg border border-zinc-400 p-2 transition duration-200",
                {
                  "border-blue-500 text-blue-500": currency.code === c.currency,
                },
              )}
              onClick={() =>
                setCurrency({
                  code: c.currency,
                  rate: Number(c.rate),
                })
              }
            >
              <h2>{c.name}</h2>
              <span>{c.currency}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CurrencySwitcher;

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatPrice, getWeight } from "@/lib/utils";
import { CartResponse } from "@/types";
import { Info } from "lucide-react";
import Image from "next/image";
import React from "react";

type CartsItemsDialogProps = {
  items: CartResponse["items"];
};

const CartsItemsDialog: React.FC<CartsItemsDialogProps> = ({ items }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <span className="cursor-pointer underline">
          {items.length} article(s)
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Articles</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-start justify-between gap-2 border-b pb-2"
            >
              <div className="flex flex-shrink-0 gap-2">
                <Image
                  src={item.product.gallery[0] || "/placeholder.svg"}
                  alt={item.product.name}
                  width={80}
                  height={80}
                  className="rounded-md border object-cover"
                />
                <div className="flex flex-col gap-1">
                  <div className="space-x-2">
                    <span>{item.product.name}</span>
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
                            {Object.entries(item.options)
                              .filter(([_, value]) => value !== undefined)
                              .map(([key, value]) => (
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
                  <span className="text-muted-foreground text-xs">
                    Quantité: {item.quantity}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    Poids:{" "}
                    {(getWeight(item.product.type) * item.quantity).toFixed(2)}{" "}
                    kg
                  </span>
                </div>
              </div>

              <span>{formatPrice(item.price, "XOF")}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CartsItemsDialog;

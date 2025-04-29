import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OrderResponse } from "@/types";
import React from "react";

type OrderDeliveryZoneDialogProps = {
  deliveryZone: OrderResponse["delivery"];
};

const OrderDeliveryZoneDialog: React.FC<OrderDeliveryZoneDialogProps> = ({
  deliveryZone,
}) => {
  return (
    <Dialog>
      <DialogTrigger>
        <span className="cursor-pointer underline">Voir l&apos;adresse</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adresse de livraison de la commande</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="flex w-full items-center justify-between">
            <span>Client</span>
            <span>
              {deliveryZone.firstName} {deliveryZone.lastName}
            </span>
          </div>
          <div className="flex w-full items-center justify-between">
            <span>Email</span>
            <span>{deliveryZone.email}</span>
          </div>
          <div className="flex w-full items-center justify-between">
            <span>Téléphone</span>
            <span>{deliveryZone.phone}</span>
          </div>
          <div className="flex w-full items-center justify-between">
            <span>Pays</span>
            <span>{deliveryZone.country}</span>
          </div>
          <div className="flex w-full items-center justify-between">
            <span>Ville</span>
            <span>{deliveryZone.city}</span>
          </div>
          <div className="flex w-full items-center justify-between">
            <span>Adresse</span>
            <span>{deliveryZone.address}</span>
          </div>
          <div className="flex w-full items-center justify-between">
            <span>Instructions</span>
            <span>{deliveryZone.note ?? "Aucune"}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDeliveryZoneDialog;

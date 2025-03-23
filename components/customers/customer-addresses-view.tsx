"use client";

import IsLoading from "@/components/is-loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { checkoutFormSchema } from "@/lib/validators";
import { trpc } from "@/server/trpc/client";
import { PencilIcon, PlusCircle, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";
import UserAddressForm from "../forms/user-address-form";

type CustomerAddressesViewProps = {};

const CustomerAddressesView: React.FC<CustomerAddressesViewProps> = ({}) => {
  const [addresses] = trpc.userAddresses.getUserAddresses.useSuspenseQuery();

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-fit">
              <PlusCircle />
              Nouvelle adresse
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle adresse de livraison</DialogTitle>
            </DialogHeader>
            <UserAddressForm />
          </DialogContent>
        </Dialog>
        <hr />
      </div>

      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
        {addresses.map((address) => (
          <CustomerAddressItem
            key={address.id}
            id={address.id}
            address={{
              ...address,
              note: address.note || undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const CustomerAddressItem = ({
  id,
  address,
}: {
  id: string;
  address: z.infer<typeof checkoutFormSchema>;
}) => {
  const [open, setOpen] = React.useState(false);

  const utils = trpc.useUtils();
  const { mutate: deleteAddress, isPending: deleting } =
    trpc.userAddresses.deleteUserAddress.useMutation({
      onSuccess: (_, input) => {
        toast.success("Adresse supprimée avec succès");
        utils.userAddresses.getUserAddresses.invalidate();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return (
    <div>
      <div className="h-full space-y-4 rounded-2xl border p-4">
        <div>
          <div className="flex items-center justify-between">
            {/* <h3 className="text-lg">{address.name}</h3> */}

            <div className="space-x-2">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size={"icon"} className="size-7">
                    <Trash2 />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Supprimer cette adresse</DialogTitle>
                    <DialogDescription>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Autem error libero ab atque non quaerat consequuntur qui
                      dolorum ea architecto.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      disabled={deleting}
                      variant={"destructive"}
                      onClick={() => {
                        deleteAddress({ id });
                      }}
                    >
                      {deleting ? <IsLoading /> : "Supprimer"}
                    </Button>
                    <DialogClose asChild>
                      <Button disabled={deleting} variant={"outline"}>
                        Annuler
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button size={"icon"} className="size-7">
                    <PencilIcon />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Modifier cette adresse</DialogTitle>
                  </DialogHeader>
                  <UserAddressForm
                    id={id}
                    initialValues={address}
                    // initValues={}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <p>Indications: {address.note || "N/A"}</p>
      </div>
    </div>
  );
};

export default CustomerAddressesView;

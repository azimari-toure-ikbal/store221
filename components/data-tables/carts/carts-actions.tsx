import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/server/trpc/client";
import { CartResponse } from "@/types";
import { Row } from "@tanstack/react-table";
import { PenIcon } from "lucide-react";
import React from "react";

type CartsActionsProps = {
  row: Row<CartResponse>;
};

const CartsActions: React.FC<CartsActionsProps> = ({ row }) => {
  const utils = trpc.useUtils();

  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button size={"icon"} className="size-7">
            <PenIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le compte</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant={"destructive"}
                onClick={() => {
                  // deleteCarts({
                  //   id: row.original.id,
                  // });
                }}
              >
                Modifier
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant={"outline"}>Annuler</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CartsActions;

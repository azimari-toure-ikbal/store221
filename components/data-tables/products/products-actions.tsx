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
import { DBProduct } from "@/lib/db/schema/index";
import { cn } from "@/lib/utils";
import { trpc } from "@/server/trpc/client";
import { Row } from "@tanstack/react-table";
import { Copy, Pen, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

type ProductsActionsProps = {
  row: Row<DBProduct>;
};

const ProductsActions: React.FC<ProductsActionsProps> = ({ row }) => {
  const utils = trpc.useUtils();

  const { mutate: deleteProduct, isPending: isDeleting } =
    trpc.products.deleteProduct.useMutation({
      onSuccess: (_, input) => {
        toast.success("Produit supprimé avec succès");
        utils.products.getProducts.invalidate();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutate: duplicateProduct, isPending: isDuplicating } =
    trpc.products.duplicateProduct.useMutation({
      onSuccess: (_, input) => {
        toast.success("Produit dupliqué avec succès");
        utils.products.getProducts.invalidate();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/dashboard/products/${row.original.id}`}
        className={cn({
          "pointer-events-none cursor-not-allowed": isDeleting || isDuplicating,
        })}
      >
        <Button
          size={"icon"}
          className="size-7"
          disabled={isDeleting || isDuplicating}
        >
          {isDeleting || isDuplicating ? <IsLoading /> : <Pen />}
        </Button>
      </Link>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            disabled={isDeleting || isDuplicating}
            size={"icon"}
            className="size-7"
            variant={"outline"}
          >
            {isDeleting || isDuplicating ? <IsLoading /> : <Copy />}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dupliquer</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de dupliquer le produit suivant{" "}
              {row.original.name}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                onClick={() => {
                  duplicateProduct({
                    id: row.original.id,
                  });
                }}
              >
                Dupliquer
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant={"outline"}>Annuler</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            disabled={isDeleting || isDuplicating}
            size={"icon"}
            className="size-7"
            variant={"destructive"}
          >
            {isDeleting || isDuplicating ? <IsLoading /> : <Trash2 />}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le produit</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de supprimer le produit suivant{" "}
              {row.original.name}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant={"destructive"}
                onClick={() => {
                  deleteProduct({
                    id: row.original.id,
                  });
                }}
              >
                Supprimer
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

export default ProductsActions;

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
import { DBUser } from "@/lib/db/schema/index";
import { trpc } from "@/server/trpc/client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Row } from "@tanstack/react-table";
import { PenIcon, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type UserActionsProps = {
  row: Row<DBUser>;
};

const UserActions: React.FC<UserActionsProps> = ({ row }) => {
  const utils = trpc.useUtils();

  const { user } = useKindeBrowserClient();

  const { mutate: deleteUser, isPending: isDeleting } =
    trpc.users.deleteUser.useMutation({
      onSuccess: (_, input) => {
        toast.success("Utilisateur supprimé avec succès");
        utils.users.getUsers.invalidate();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  if (user && user.id === row.original.kindeId) return null;

  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"destructive"} size={"icon"} className="size-7">
            <Trash2 />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le compte</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de supprimer le compte de
              l&apos;utilisateur {row.original.givenName}{" "}
              {row.original.familyName}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant={"destructive"}
                onClick={() => {
                  deleteUser({
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

      <Dialog>
        <DialogTrigger asChild>
          <Button size={"icon"} className="size-7">
            <PenIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le compte</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de modifier le compte de l&apos;utilisateur{" "}
              {row.original.givenName} {row.original.familyName}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant={"destructive"}
                onClick={() => {
                  // deleteUser({
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

export default UserActions;

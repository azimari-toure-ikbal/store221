import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";

type UpdateUserInfoProps = {};

const UpdateUserInfo: React.FC<UpdateUserInfoProps> = ({}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"link"}>Modifier</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier vos informations</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserInfo;

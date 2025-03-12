import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type UserAvatarProps = {
  className?: string;
  name: string;
  url?: string | null;
};

const UserAvatar: React.FC<UserAvatarProps> = ({ className, name, url }) => {
  return (
    <Avatar className={cn("h-8 w-8 rounded-lg", className)}>
      <AvatarImage
        className="object-cover object-center"
        src={url ?? `https://api.dicebear.com/8.x/initials/svg?seed=${name}`}
      />
      <AvatarFallback>CM</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;

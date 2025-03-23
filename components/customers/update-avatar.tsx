"use client";

import UserAvatar from "@/components/user-avatar";
import React from "react";

type UpdateAvatarProps = {
  fullName: string;
};

const UpdateAvatar: React.FC<UpdateAvatarProps> = ({ fullName }) => {
  return (
    <div className="relative">
      <UserAvatar name={fullName} className="size-24 rounded-full" />
    </div>
  );
};

export default UpdateAvatar;

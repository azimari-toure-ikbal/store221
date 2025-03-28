"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/server/trpc/client";
import React from "react";
import { usersColumns } from "./users-columns";
import { UsersTable } from "./users-table";

type UsersTableViewProps = {};

const UsersTableView: React.FC<UsersTableViewProps> = ({}) => {
  const { data, isLoading } = trpc.users.getUsers.useQuery();

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (!data) {
    return <div>Aucun utilisateur...</div>;
  }

  return <UsersTable columns={usersColumns} data={data} />;
};

export default UsersTableView;

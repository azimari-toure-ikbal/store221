"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { statusLabels } from "@/components/custom-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { trpc } from "@/server/trpc/client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { RefreshCw } from "lucide-react";
import React from "react";
import { DataTablePagination } from "../data-table-pagination";
import { OrdersToolbar } from "./orders-toolbar";

interface OrdersTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  client?: boolean;
}

export function OrdersTable<TData, TValue>({
  columns,
  data,
  client,
}: OrdersTableProps<TData, TValue>) {
  const [openDelete, setOpenDelete] = React.useState(false);
  const [refetching, setRefetching] = React.useState(false);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const { organization } = useKindeBrowserClient();

  const utils = trpc.useUtils();
  // const { mutate: deleteUser, isPending: isDeleting } =
  //   trpc.carts.deleteUser.useMutation({});

  const table = useReactTable({
    data,
    columns,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      columnFilters,
      rowSelection,
      sorting,
      columnVisibility,
    },
  });

  // const handleDeleteSelected = (
  //   e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  // ) => {
  //   e.preventDefault();

  //   const ids = table
  //     .getFilteredSelectedRowModel()
  //     .rows.map((row) => (row.original as { id: string }).id);

  //   if (ids.length > 0) {
  //     for (const id of ids) {
  //       deleteUser({ id });
  //     }
  //   }

  //   setOpenDelete(false);
  // };

  const handleRefetch = async () => {
    setRefetching(true);
    utils.orders.getOrders.invalidate();
    setTimeout(() => {
      setRefetching(false);
    }, 1000);
  };

  const statuses = [
    { label: statusLabels["preparation"], value: "PREPARATION" },
    { label: statusLabels["shipping"], value: "SHIPPING" },
    { label: statusLabels["delivered"], value: "DELIVERED" },
    // { label: statusLabels["refunded"], value: "REFUNDED" },
    // { label: statusLabels["canceled"], value: "CANCELED" },
  ];

  return (
    <div>
      <div className="flex w-full flex-col gap-2 py-4 md:flex-row md:items-center md:justify-between md:gap-4">
        <div className="flex w-full items-center justify-between">
          <OrdersToolbar table={table} statuses={statuses} />
          <Button
            size={"icon"}
            className="border-primary h-8 w-8 border bg-transparent hover:bg-transparent"
          >
            <RefreshCw
              className={cn("text-primary h-4 w-4 cursor-pointer rounded-md", {
                "animate-spin": refetching,
              })}
              onClick={handleRefetch}
            />
          </Button>
        </div>

        {/* {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
            <AlertDialogTrigger asChild>
              <Button
                onClick={() => setOpenDelete(true)}
                className="w-fit"
                variant="destructive"
                disabled={isDeleting}
              >
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Etes-vous sûr?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action ne peut être annulée. Cette action supprimera
                  définitivement ces annonces de nos serveurs.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/80"
                  onClick={handleDeleteSelected}
                >
                  Confirmer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )} */}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="w-full">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={client ? columns.length : columns.length}
                  className="h-24 text-center"
                >
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}

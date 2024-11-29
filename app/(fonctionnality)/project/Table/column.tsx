"use client";

import { Button } from "@/components/ui/button";
import { ProjectType } from "@/zodSchema/Project/project";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<ProjectType>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("title");
      const id = row.original.id;
      return (
        <Link href={`/project/${id}`} className="hover:underline">
          {value as ReactNode}
        </Link>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const value = row.getValue("status");
      const formatValue = value === "IN_PROGRESS" ? "IN PROGRESS" : value;
      const background =
        value === "IN_PROGRESS"
          ? "bg-orange-100"
          : value === "OPEN"
          ? "bg-green-100"
          : value === "CLOSE"
          ? "bg-red-100"
          : "bg-slate-100";
      return (
        <div className={`w-fit rounded-sm block p-1 ${background}`}>
          {formatValue as ReactNode}
        </div>
      );
    },
  },
  {
    accessorKey: "progress",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className=""
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Progress
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("progress");
      return <div className="pl-4">{value as ReactNode}%</div>;
    },
  },
  {
    accessorKey: "budget",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 flex items-center justify-center mx-auto"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Budget
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("budget");
      return <div className="text-center">{value as ReactNode}</div>;
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 flex items-center justify-center mx-auto"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("startDate");
      return <div className="text-center">{value as ReactNode}</div>;
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => {
      return (
        <Button
          className="p-0 flex items-center justify-center mx-auto"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          End Date
          <ArrowUpDown className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("endDate");
      return <div className="text-center">{value as ReactNode}</div>;
    },
  },
];

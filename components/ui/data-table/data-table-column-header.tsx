import React from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { Button } from "../button";
import { SortDirection } from "./data-table";

interface DataTableColumnHeaderProps {
  title: string | React.ReactNode;
  isSorted: boolean;
  sortDirection: SortDirection;
  onSort: () => void;
}

export function DataTableColumnHeader({
  title,
  isSorted,
  sortDirection,
  onSort,
}: DataTableColumnHeaderProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={onSort}
      >
        <span>{title}</span>
        {isSorted ? (
          sortDirection === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUp className="ml-2 h-4 w-4" />
          )
        ) : (
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

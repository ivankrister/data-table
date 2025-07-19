import React, { useState, useEffect, useCallback } from "react";
import { router, route } from "@/lib/mock-inertia";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import { Input } from "../input";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Search } from "lucide-react";
import { DataTableType } from "./types";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "../date-picker";
import { format } from "date-fns";

export type SortDirection = "asc" | "desc" | null;

export interface Column<T> {
  id: string;
  header: string | React.ReactNode | (() => React.ReactNode);
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
  enableSorting?: boolean;
}

export interface FilterComponentProps {
  onFilterChange: (filters: Record<string, unknown>) => void;
  currentFilters: Record<string, unknown>;
}

export interface DataTableProps<T> {
  data: DataTableType<T>;
  columns: Column<T>[];
  routeName: string;
  routeParams?: Record<string, unknown>;
  searchable?: boolean;
  enableDateRange?: boolean;
  defaultSortField?: string;
  defaultSortDirection?: SortDirection;
  filter?: React.ReactElement<FilterComponentProps>;
  onFilterChange?: (filters: Record<string, unknown>) => void;
}

interface Filters {
    search?: string;
    sort_by?: string;
    sort_direction?: SortDirection;
    page?: number;
    date_range?: DateRange;
    [key: string]: unknown;
}


export function DataTable<T>({
  data,
  columns,
  routeName,
  routeParams = {},
  searchable = true,
  enableDateRange = false,
  defaultSortField,
  defaultSortDirection = null,
  filter,
  onFilterChange,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortField, setSortField] = useState<string | undefined>(defaultSortField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Convert custom columns to TanStack ColumnDef
  const tableColumns: ColumnDef<T>[] = columns.map((column) => ({
    id: column.id,
    accessorKey: column.accessorKey as string,
    header: () => {
      if (!column.enableSorting) {
        return typeof column.header === 'function' ? column.header() : column.header;
      }

      return (
        <DataTableColumnHeader
          title={typeof column.header === 'function' ? column.header() : column.header}
          isSorted={sortField === column.id}
          sortDirection={sortField === column.id ? sortDirection : null}
          onSort={() => {
            let newDirection: SortDirection = "asc";

            if (sortField === column.id) {
              if (sortDirection === "asc") {
                newDirection = "desc";
              } else if (sortDirection === "desc") {
                newDirection = null;
              } else {
                newDirection = "asc";
              }
            }

            setSortField(newDirection ? column.id : undefined);
            setSortDirection(newDirection);

            // Update TanStack sorting state
            if (newDirection) {
              setSorting([{ id: column.id, desc: newDirection === "desc" }]);
            } else {
              setSorting([]);
            }

            handleFiltersChange({
              sort_by: newDirection ? column.id : undefined,
              sort_direction: newDirection,
              page: 1,
            });
          }}
        />
      );
    },
    cell: ({ row }) => {
      return column.cell ? column.cell(row.original) : (row.getValue(column.id) as React.ReactNode);
    },
    enableSorting: column.enableSorting ?? false,
  }));

  const table = useReactTable({
    data: data.data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    manualSorting: true, // We handle sorting server-side
    manualFiltering: true, // We handle filtering server-side
    manualPagination: true, // We handle pagination server-side
  });

  // Handle filters change (search, sort, pagination, date range)
  const handleFiltersChange = useCallback((filters: Filters) => {


    // Format dates as yyyy-mm-dd if they exist
    let startDate = undefined;
    let endDate = undefined;

    if (filters.date_range) {
      const range = filters.date_range as DateRange;
      if (range.from) {
        startDate = format(range.from, "yyyy-MM-dd");
      }
      if (range.to) {
        endDate = format(range.to, "yyyy-MM-dd");
      }
    } else if (dateRange) {
      if (dateRange.from) {
        startDate = format(dateRange.from, "yyyy-MM-dd");
      }
      if (dateRange.to) {
        endDate = format(dateRange.to, "yyyy-MM-dd");
      }
    }

    // Merge with existing filter values
    const updatedFilters = { ...filterValues, ...filters };
    setFilterValues(updatedFilters);

    // Notify parent component if callback is provided
    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }

    router.get(
      route(routeName, routeParams),
      {
        search: filters.search ?? searchQuery,
        sort_by: filters.sort_by ?? sortField,
        sort_direction: filters?.sort_direction ?? sortDirection,
        page: filters.page ?? data.meta.current_page,
        start_date: startDate,
        end_date: endDate,
        ...Object.fromEntries(
          Object.entries(updatedFilters).filter(
            ([key]) => !['search', 'sort_by', 'sort_direction', 'page', 'date_range'].includes(key)
          )
        ),
      },
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  }, [routeName, routeParams, searchQuery, sortField, sortDirection, dateRange, filterValues, data.meta, onFilterChange]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedSearchQuery !== searchQuery) {
        setDebouncedSearchQuery(searchQuery);
        handleFiltersChange({ search: searchQuery });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearchQuery, handleFiltersChange]);


  // Handle page change
  const handlePageChange = (page: number) => {
    handleFiltersChange({ page });
  };

  // Handle date range change
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    handleFiltersChange({ date_range: range, page: 1 });
  };


  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        {searchable && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        )}

        {enableDateRange && (
          <DatePickerWithRange
            value={dateRange}
            onChange={handleDateRangeChange}
          />
        )}

        {(filter) && (
          <div className="flex-1 flex items-center">
            {React.isValidElement(filter) &&
              React.cloneElement(filter, {
                onFilterChange: handleFiltersChange,
                currentFilters: filterValues,
              } as FilterComponentProps)
            }
          </div>
        )}
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
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data.meta && (
        <DataTablePagination
          currentPage={data.meta.current_page}
          totalPages={data.meta.last_page}
          totalItems={data.meta.total}
          pageSize={data.meta.per_page}
          from={data.meta.from}
          to={data.meta.to}
          onPageChange={handlePageChange}
          hasNextPage={data.meta.current_page < data.meta.last_page}
          hasPrevPage={data.meta.current_page > 1}
        />
      )}
    </div>
  );
}

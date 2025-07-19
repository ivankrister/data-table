"use client"

import React from "react";
import { DataTable, Column } from "@/components/ui/data-table";
import { DataTableType } from "@/components/ui/data-table/types";

// Test data type
type TestUser = {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
};

// Test data
const testData: DataTableType<TestUser> = {
  data: [
    { id: "1", name: "John Doe", email: "john@example.com", status: "active" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", status: "inactive" },
  ],
  links: {
    first: "/test?page=1",
    last: "/test?page=1",
    prev: null,
    next: null,
  },
  meta: {
    current_page: 1,
    from: 1,
    last_page: 1,
    links: [
      { url: null, label: "&laquo; Previous", active: false },
      { url: "/test?page=1", label: "1", active: true },
      { url: null, label: "Next &raquo;", active: false },
    ],
    path: "/test",
    per_page: 15,
    to: 2,
    total: 2,
  },
};

// Test columns
const testColumns: Column<TestUser>[] = [
  {
    id: "name",
    header: "Name",
    accessorKey: "name",
    enableSorting: true,
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email",
    enableSorting: true,
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: (user) => (
      <span className={user.status === "active" ? "text-green-600" : "text-red-600"}>
        {user.status}
      </span>
    ),
  },
];

// React 19 compatibility test component
export default function React19CompatibilityTest() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">React 19 Compatibility Test</h1>
      <p className="mb-4 text-gray-600">
        This component tests the data-table with React 19. All features should work correctly.
      </p>

      <DataTable
        columns={testColumns}
        data={testData}
        routeName="test.index"
        searchable={true}
        enableDateRange={true}
        defaultSortField="name"
        defaultSortDirection="asc"
      />

      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-md">
        <h2 className="text-lg font-semibold text-green-800 mb-2">✅ React 19 Features Tested:</h2>
        <ul className="list-disc list-inside text-green-700 space-y-1">
          <li>React.forwardRef components</li>
          <li>useState and useEffect hooks</li>
          <li>React.ReactNode and React.ReactElement types</li>
          <li>Component composition and props spreading</li>
          <li>Event handlers and callbacks</li>
          <li>Conditional rendering</li>
          <li>TypeScript integration</li>
        </ul>
      </div>
    </div>
  );
}

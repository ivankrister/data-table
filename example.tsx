"use client"

import { DataTable, Column } from "@/components/ui/data-table"
import { DataTableType } from "@/components/ui/data-table/types"

// Define your data type
type User = {
  id: string
  name: string
  email: string
  status: "active" | "inactive"
  role: string
}

// Sample data in the format expected by the data-table
const sampleUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    role: "Admin",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "inactive",
    role: "User",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "active",
    role: "Editor",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    status: "active",
    role: "User",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie@example.com",
    status: "inactive",
    role: "Admin",
  },
]

// Mock pagination data structure
const data: DataTableType<User> = {
  data: sampleUsers,
  links: {
    first: "/users?page=1",
    last: "/users?page=1",
    prev: null,
    next: null,
  },
  meta: {
    current_page: 1,
    from: 1,
    last_page: 1,
    links: [
      { url: null, label: "&laquo; Previous", active: false },
      { url: "/users?page=1", label: "1", active: true },
      { url: null, label: "Next &raquo;", active: false },
    ],
    path: "/users",
    per_page: 15,
    to: 5,
    total: 5,
  },
}

// Define your columns using the custom Column interface
const columns: Column<User>[] = [
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
      <div className={`capitalize ${user.status === "active" ? "text-green-600" : "text-red-600"}`}>
        {user.status}
      </div>
    ),
  },
  {
    id: "role",
    header: "Role",
    accessorKey: "role",
    enableSorting: true,
    cell: (user) => (
      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
        {user.role}
      </span>
    ),
  },
]

// Basic example component
export function BasicUsersTable() {
  const basicColumns: Column<User>[] = [
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
    },
  ]

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Basic Data Table</h2>
      <DataTable
        columns={basicColumns}
        data={data}
        routeName="users.index"
        searchable={true}
      />
    </div>
  )
}

// Advanced example component
export function AdvancedUsersTable() {
  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Advanced Data Table</h2>
      <DataTable
        columns={columns}
        data={data}
        routeName="users.index"
        searchable={true}
        enableDateRange={true}
        defaultSortField="name"
        defaultSortDirection="asc"
      />
    </div>
  )
}

// Main example component
export default function DataTableExample() {
  return (
    <div className="space-y-8">
      <BasicUsersTable />
      <AdvancedUsersTable />
    </div>
  )
}

# Shadcn Data Table Component

A comprehensive data table component built with shadcn/ui and @tanstack/react-table with server-side pagination, filtering, and sorting support.

## Features

- ✅ Server-side sorting, filtering, and pagination
- ✅ Date range filtering
- ✅ Debounced search
- ✅ Custom filter components
- ✅ Responsive design
- ✅ TypeScript support
- ✅ React 19 compatibility
- ✅ Inertia.js integration (with mock fallback)
- ✅ Laravel pagination format support

## Installation

### Option 1: Install from npm (Recommended)

Install the package directly from GitHub:

```bash
npm install ivankrister/data-table
```

This will install the complete data-table component with all necessary files and dependencies.

### Option 2: Manual Installation

If you prefer to install manually, install the required dependencies:

```bash
npm install @tanstack/react-table @radix-ui/react-popover @radix-ui/react-slot class-variance-authority clsx date-fns lucide-react react-day-picker tailwind-merge
```

For Inertia.js projects, also install:
```bash
npm install @inertiajs/react
```

Then copy the component files from this repository to your project following the project structure below.

## Project Structure

```
components/
├── ui/
│   ├── data-table/
│   │   ├── data-table.tsx              # Main data table component
│   │   ├── data-table-column-header.tsx # Sortable column headers
│   │   ├── data-table-pagination.tsx   # Pagination component
│   │   ├── types.ts                    # Type definitions
│   │   └── index.ts                    # Exports
│   ├── table.tsx                       # shadcn/ui table components
│   ├── input.tsx                       # shadcn/ui input component
│   ├── button.tsx                      # shadcn/ui button component
│   ├── popover.tsx                     # shadcn/ui popover component
│   ├── calendar.tsx                    # shadcn/ui calendar component
│   └── date-picker.tsx                 # Date range picker component
├── lib/
│   ├── utils.ts                        # Utility functions (cn)
│   └── mock-inertia.ts                 # Mock Inertia.js implementations
└── components.json                     # shadcn/ui configuration
```

## Usage

### Basic Example

```tsx
import { DataTable, Column } from "@/components/ui/data-table"
import { DataTableType } from "@/components/ui/data-table/types"

// Define your data type
type User = {
  id: string
  name: string
  email: string
  status: "active" | "inactive"
}

// Define your columns
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
  },
]

// Mock data in Laravel pagination format
const data: DataTableType<User> = {
  data: [
    { id: "1", name: "John Doe", email: "john@example.com", status: "active" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", status: "inactive" },
  ],
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
    links: [],
    path: "/users",
    per_page: 15,
    to: 2,
    total: 2,
  },
}

// Use the component
export default function UsersTable() {
  return (
    <DataTable
      columns={columns}
      data={data}
      routeName="users.index"
      searchable={true}
    />
  )
}
```

### Advanced Example with Helper Functions

```tsx
import { DataTable, createSortableHeader, createSelectColumn, createActionColumn } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"

type User = {
  id: string
  name: string
  email: string
  status: "active" | "inactive"
}

const columns: ColumnDef<User>[] = [
  createSelectColumn<User>(),
  {
    accessorKey: "name",
    header: createSortableHeader("Name"),
  },
  {
    accessorKey: "email",
    header: createSortableHeader("Email"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <div className={`capitalize ${status === "active" ? "text-green-600" : "text-red-600"}`}>
          {status}
        </div>
      )
    },
  },
  createActionColumn<User>(),
]

export default function AdvancedUsersTable() {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="name"
      searchPlaceholder="Search users..."
    />
  )
}
```

## Props

### DataTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ColumnDef<TData, TValue>[]` | - | Column definitions for the table |
| `data` | `TData[]` | - | Data to display in the table |
| `searchKey` | `string` | - | Column key to enable search functionality |
| `searchPlaceholder` | `string` | `"Filter..."` | Placeholder text for the search input |

## Helper Functions

### createSortableHeader(title: string)

Creates a sortable column header with up/down arrow indicators.

### createSelectColumn<TData>()

Creates a column with checkboxes for row selection.

### createActionColumn<TData>()

Creates an actions column with a dropdown menu containing common actions (copy ID, view details, edit).

## Customization

The component uses Tailwind CSS classes and follows shadcn/ui design patterns. You can customize the appearance by:

1. Modifying the CSS classes in the component
2. Overriding the default shadcn/ui component styles
3. Creating custom column definitions with your own cell renderers

## Dependencies

- `@tanstack/react-table` - For table functionality
- `lucide-react` - For icons
- `shadcn/ui` components - For UI elements
- `React` - For the component framework
- `TypeScript` - For type safety

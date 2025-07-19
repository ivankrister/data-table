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

### Option 1: Using npx (Recommended - Most Shadcn-like)

Install the data-table component using npx:

```bash
npx shadcn-data-table@latest
```

This command will:
- Check if you're in a shadcn/ui project
- Install all required dependencies
- Install required shadcn/ui components automatically
- Create the component directory structure
- Provide clear instructions for the final setup steps

### Option 2: Using the Installation Script

Run the installation script to automatically set up the data-table component:

```bash
curl -fsSL https://raw.githubusercontent.com/ivankrister/shadcn-data-table/main/install-data-table.sh | bash
```

Or download and run locally:

```bash
wget https://raw.githubusercontent.com/ivankrister/shadcn-data-table/main/install-data-table.sh
chmod +x install-data-table.sh
./install-data-table.sh
```

This will:
- Install all required dependencies
- Install required shadcn/ui components (button, input, table, popover, calendar)
- Create the component directory structure
- Provide instructions for copying the component files

### Option 3: Manual Installation (Shadcn Style)

1. Install the required dependencies:

```bash
npm install @tanstack/react-table lucide-react date-fns react-day-picker
```

2. Install the required shadcn/ui components:

```bash
npx shadcn@latest add button input table popover calendar
```

3. Copy the component files to your project:

```bash
# Create the data-table directory
mkdir -p components/ui/data-table

# Copy all files from this repository's components/ui/data-table/ directory
# to your project's components/ui/data-table/ directory
```

4. Copy the date-picker component if you don't have it:

```bash
# Copy components/ui/date-picker.tsx to your project
```

For Inertia.js projects, also install:
```bash
npm install @inertiajs/react
```

## How This Component Acts Like Other Shadcn Components

This data-table component now follows the same patterns as other shadcn/ui components:

✅ **CLI Installation**: Use `npx shadcn-data-table@latest` just like `npx shadcn-ui@latest add button`

✅ **Component Structure**: Lives in `components/ui/data-table/` following shadcn conventions

✅ **Dependency Management**: Automatically installs required shadcn components and npm packages

✅ **Import Pattern**: Import using `@/components/ui/data-table` alias

✅ **TypeScript Support**: Full TypeScript definitions included

✅ **Customizable**: Built with Tailwind CSS and follows shadcn design patterns

✅ **Registry Support**: Includes registry configuration for potential future shadcn integration

The component integrates seamlessly with your existing shadcn/ui setup and follows all the same conventions you're already familiar with.

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

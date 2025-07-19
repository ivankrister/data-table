#!/bin/bash

# Shadcn Data Table Component Installer
# This script installs the data-table component in shadcn/ui style

echo "🚀 Installing shadcn data-table component..."

# Check if components.json exists
if [ ! -f "components.json" ]; then
    echo "❌ components.json not found. Please run this script in a shadcn/ui project."
    exit 1
fi

# Install required dependencies
echo "📦 Installing dependencies..."
npm install @tanstack/react-table lucide-react date-fns react-day-picker

# Install required shadcn components
echo "🎨 Installing required shadcn components..."
npx shadcn@latest add button input table popover calendar

# Create data-table directory
echo "📁 Creating component directory..."
mkdir -p components/ui/data-table

# Copy component files (these would be downloaded from the registry in a real implementation)
echo "📋 Copying component files..."
echo "⚠️  Please manually copy the following files from the repository:"
echo "   - components/ui/data-table/data-table.tsx"
echo "   - components/ui/data-table/data-table-column-header.tsx"
echo "   - components/ui/data-table/data-table-pagination.tsx"
echo "   - components/ui/data-table/types.ts"
echo "   - components/ui/data-table/index.ts"

# Install date-picker component if it doesn't exist
if [ ! -f "components/ui/date-picker.tsx" ]; then
    echo "📅 Installing date-picker component..."
    echo "⚠️  Please manually copy components/ui/date-picker.tsx from the repository"
fi

echo "✅ Installation complete!"
echo ""
echo "📖 Usage:"
echo 'import { DataTable } from "@/components/ui/data-table"'
echo ""
echo "For more information, see the README.md file."

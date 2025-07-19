#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Installing shadcn data-table component...');

// Check if we're in a shadcn/ui project
if (!fs.existsSync('components.json')) {
    console.error('❌ components.json not found. Please run this command in a shadcn/ui project.');
    process.exit(1);
}

try {
    // Install required dependencies
    console.log('📦 Installing dependencies...');
    execSync('npm install @tanstack/react-table lucide-react date-fns react-day-picker', { stdio: 'inherit' });

    // Install required shadcn components
    console.log('🎨 Installing required shadcn components...');
    execSync('npx shadcn@latest add button input table popover calendar --overwrite', { stdio: 'inherit' });

    // Create data-table directory
    console.log('📁 Creating component directory...');
    const dataTableDir = path.join('components', 'ui', 'data-table');
    if (!fs.existsSync(dataTableDir)) {
        fs.mkdirSync(dataTableDir, { recursive: true });
    }

    console.log('✅ Dependencies and base components installed!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Copy the data-table component files from the repository:');
    console.log('   - components/ui/data-table/data-table.tsx');
    console.log('   - components/ui/data-table/data-table-column-header.tsx');
    console.log('   - components/ui/data-table/data-table-pagination.tsx');
    console.log('   - components/ui/data-table/types.ts');
    console.log('   - components/ui/data-table/index.ts');
    console.log('');
    console.log('2. Copy the date-picker component:');
    console.log('   - components/ui/date-picker.tsx');
    console.log('');
    console.log('📖 Usage:');
    console.log('import { DataTable } from "@/components/ui/data-table"');
    console.log('');
    console.log('For more information, see: https://github.com/ivankrister/shadcn-data-table');

} catch (error) {
    console.error('❌ Installation failed:', error.message);
    process.exit(1);
}

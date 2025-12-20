// components/TablePicker.tsx
import React from "react";
import Link from "next/link";
import { Plus, Table as TableIcon } from "lucide-react";

interface TablePickerProps {
  tables: { name: string; rows?: number; href: string }[];
  onCreate: () => void;
}

const TablePicker: React.FC<TablePickerProps> = ({ tables, onCreate }) => {
  return (
    <div className="w-full max-w-[800px] bg-gray-50 border border-gray-200 rounded-xl shadow-md overflow-hidden">
      {/* Header with Search & New Table */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <input
          type="text"
          placeholder="Search tables..."
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition"
        />
        <button
          onClick={onCreate}
          className="ml-3 flex items-center gap-1 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition"
        >
          <Plus size={16} />
          New Table
        </button>
      </div>

      {/* Table list */}
      <div className="max-h-72 overflow-y-auto">
        {tables.length === 0 && (
          <p className="p-4 text-gray-400 text-sm text-center">No tables available</p>
        )}
        {tables.map((table) => (
          <Link
            key={table.name}
            href={table.href}
            className="flex items-center px-4 py-3 gap-3 cursor-pointer transition rounded-r-lg hover:bg-gray-100"
          >
            <TableIcon size={18} className="text-gray-600" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-800">{table.name}</div>
              {table.rows !== undefined && (
                <div className="text-xs text-gray-500">{table.rows} rows</div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TablePicker;
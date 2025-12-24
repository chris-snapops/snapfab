"use client";

import { useState } from "react";
import { Plus, MoreVertical } from "lucide-react";

// ---------------- Types ----------------

export type ColumnType = "string" | "number" | "boolean";

interface Column {
  id: string;
  name: string;
  type: ColumnType;
}

interface Row {
  id: string;
  values: Record<string, string | number | boolean | null>;
}

// ---------------- Main Component ----------------

export default function TableEditor() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [rows, setRows] = useState<Row[]>([]);

  function add_column(name: string, type: ColumnType) {
    const id = crypto.randomUUID();

    setColumns((prev) => [...prev, { id, name, type }]);
    setRows((prev) =>
      prev.map((row) => ({
        ...row,
        values: { ...row.values, [id]: null }
      }))
    );
  }

  function add_row() {
    const id = crypto.randomUUID();
    const values: Row["values"] = {};
    columns.forEach((col) => (values[col.id] = null));
    setRows((prev) => [...prev, { id, values }]);
  }

  function update_cell(row_id: string, column_id: string, value: any) {
    setRows((prev) =>
      prev.map((row) =>
        row.id === row_id
          ? { ...row, values: { ...row.values, [column_id]: value } }
          : row
      )
    );
  }

  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Table Editor</h1>
          <AddColumnButton on_add={add_column} />
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg overflow-auto">
          <table className="min-w-full border-collapse">
            <thead className="sticky top-0 bg-zinc-900 z-10">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.id}
                    className="px-4 py-3 text-left text-xs uppercase tracking-wide text-zinc-400 border-b border-zinc-800"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-medium text-zinc-200">
                          {col.name}
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          {col.type}
                        </div>
                      </div>
                      <MoreVertical size={14} className="text-zinc-500" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-zinc-800/40 transition"
                >
                  {columns.map((col) => (
                    <td
                      key={col.id}
                      className="px-4 py-2 border-b border-zinc-800"
                    >
                      <CellEditor
                        type={col.type}
                        value={row.values[col.id]}
                        on_change={(val) => update_cell(row.id, col.id, val)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Row */}
        <button
          onClick={add_row}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 text-zinc-900 hover:bg-white transition font-medium"
        >
          <Plus size={16} /> Add Row
        </button>
      </div>
    </div>
  );
}

// ---------------- UI Pieces ----------------

function AddColumnButton({
  on_add
}: {
  on_add: (name: string, type: ColumnType) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<ColumnType>("string");

  function submit() {
    if (!name.trim()) return;
    on_add(name.trim(), type);
    setName("");
    setType("string");
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition"
      >
        <Plus size={16} /> Add Column
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl p-3 space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Column name"
            className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ColumnType)}
            className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm"
          >
            <option value="string">Text</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
          </select>
          <button
            onClick={submit}
            className="w-full px-3 py-2 rounded-lg bg-zinc-100 text-zinc-900 font-medium"
          >
            Create Column
          </button>
        </div>
      )}
    </div>
  );
}

function CellEditor({
  type,
  value,
  on_change
}: {
  type: ColumnType;
  value: any;
  on_change: (val: any) => void;
}) {
  if (type === "boolean") {
    return (
      <input
        type="checkbox"
        checked={Boolean(value)}
        onChange={(e) => on_change(e.target.checked)}
        className="accent-zinc-200"
      />
    );
  }

  return (
    <input
      type={type === "number" ? "number" : "text"}
      value={value ?? ""}
      onChange={(e) =>
        on_change(type === "number" ? Number(e.target.value) : e.target.value)
      }
      className="w-full bg-transparent px-1 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500 rounded"
    />
  );
}

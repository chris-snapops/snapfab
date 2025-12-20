"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Column, Row } from "@/lib/formulaEngine";
import { saveTable, loadTable } from "@/lib/tableAPI";

// ---------------- Types ----------------

export type ColumnType = "string" | "number" | "boolean";

// ---------------- Main Component ----------------

export default function TableEditor() {
  const [tableId, setTableId] = useState("table1");
  const [columns, setColumns] = useState<Column[]>([]);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    async function load() {
      const data = await loadTable(tableId);
      if (data) {
        setColumns(data.columns);
        setRows(data.rows);
      }
    }
    load();
  }, [tableId]);

  // ---------------- Handlers ----------------

  const addRow = () => {
    const id = crypto.randomUUID();
    const values: Row["values"] = {};
    columns.forEach((col) => {
      values[col.id] = col.type === "boolean" ? false : "";
    });
    setRows((prev) => [...prev, { id, values }]);
  };

  const addColumn = (name: string, type: ColumnType) => {
    const id = crypto.randomUUID();
    const newCol: Column = { id, name, type };
    setColumns((prev) => [...prev, newCol]);
    // Add new column to all existing rows
    setRows((prev) =>
      prev.map((row) => ({
        ...row,
        values: {
          ...row.values,
          [id]: type === "boolean" ? false : "",
        },
      })),
    );
  };

  const save = async () => {
    console.log(`saving table ${tableId}`)
    await saveTable(tableId, "My Table", columns, rows);
  };

  // ---------------- Render ----------------

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold mb-4">Table Editor</h1>

      <div className="flex gap-2 mb-4">
        <button
          onClick={addRow}
          className="flex items-center gap-2 px-4 py-2 rounded bg-gray-800 text-white"
        >
          <Plus size={16} /> Add Row
        </button>

        <AddColumnButton on_add={addColumn} />

        <button
          onClick={save}
          className="px-4 py-2 rounded bg-gray-800 text-white"
        >
          Save Table
        </button>
      </div>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.id}
                className="border-r border-gray-300 px-2 py-1 text-left"
              >
                {col.name} ({col.type})
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-200">
              {columns.map((col) => (
                <td key={col.id} className="border-r border-gray-300 px-2 py-1">
                  <CellEditor
                    type={col.type}
                    value={row.values[col.id]}
                    on_change={(val) => {
                      row.values[col.id] = val;
                      setRows([...rows]);
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------- Add Column Button ----------------

function AddColumnButton({
  on_add,
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
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition"
      >
        <Plus size={16} /> Add Column
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-gray-300 shadow-xl p-3 space-y-3 z-20">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Column name"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ColumnType)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
          >
            <option value="string">Text</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
          </select>
          <button
            onClick={submit}
            className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white font-medium"
          >
            Create Column
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------- Cell Editor ----------------

function CellEditor({
  type,
  value,
  on_change,
}: {
  type: ColumnType;
  value: any;
  on_change: (val: any) => void;
}) {
  if (type === "boolean") {
    return (
      <select
        value={value === null ? "" : value ? "true" : "false"}
        onChange={(e) => {
          const val = e.target.value;
          if (val === "") on_change(null);
          else on_change(val === "true");
        }}
        className="w-full px-2 py-1 rounded border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
      >
        <option value="">Select</option>
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    );
  }

  return (
    <input
      type={type === "number" ? "number" : "text"}
      value={value ?? ""}
      onChange={(e) =>
        on_change(type === "number" ? Number(e.target.value) : e.target.value)
      }
      className="w-full bg-transparent px-1 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 rounded"
    />
  );
}

import { Box, Text } from "@mantine/core";
import { getCoreRowModel, useReactTable, flexRender } from "@tanstack/react-table";
import DATA from "../../../public/temptabledata";
import { useState } from "react";
import StringCell from "./StringCell";
import EnumCell from "./EnumCell";
import DateCell from "./DateCell";

const columns = [
  {
    accessorKey: 'task',
    header: 'Task',
    size: 200,
    cell: StringCell
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: EnumCell
  },
  {
    accessorKey: 'due',
    header: 'Due',
    cell: DateCell
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    size: 400,
    cell: StringCell
  }
];

const TaskTable = () => {
  const [data, setData] = useState(DATA);
  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      minSize: 150,
    },
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    meta: {
      updateData: (rowIndex: number, columnId: string, value: string) => setData(
        prev => prev.map(
          (row, index) =>
            index === rowIndex ? { ...row, [columnId]: value } : row
        )
      )
    }
  });

  return (
    <Box style={{ overflowX: 'auto', border: '1px solid var(--mantine-color-gray-3)', borderRadius: 'var(--mantine-radius-md)' }} mb="md">
      <style>{`
        .tanstack-tr {
          transition: background-color 0.1s ease;
        }
        .tanstack-tr:hover {
          background-color: var(--mantine-color-gray-0);
        }
      `}</style>
      <Box 
        className="tanstack-table" 
        style={{ 
          width: table.getTotalSize(),
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--mantine-color-body)',
        }}
      >
        {table.getHeaderGroups().map(headerGroup => (
          <Box 
            className="tanstack-tr-header" 
            key={headerGroup.id} 
            style={{ 
              display: 'flex',
              backgroundColor: 'var(--mantine-color-gray-0)',
              borderBottom: '1px solid var(--mantine-color-gray-3)'
            }}
          >
            {headerGroup.headers.map(header => (
              <Box
                className="tanstack-th"
                key={header.id}
                style={{
                  width: header.getSize(),
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 12px',
                  fontWeight: 700,
                  fontSize: '12px',
                  color: 'var(--mantine-color-gray-7)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderRight: '1px solid var(--mantine-color-gray-3)',
                  height: '40px'
                }}
              >
                {header.column.columnDef.header instanceof Function
                  ? header.column.columnDef.header(header.getContext())
                  : header.column.columnDef.header
                }
                <Box
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                  className={`resizer ${header.column.getIsResizing() ? "isResizing" : ""}`}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    cursor: 'col-resize',
                    userSelect: 'none',
                    touchAction: 'none',
                    zIndex: 1,
                    backgroundColor: header.column.getIsResizing() ? 'var(--mantine-color-blue-filled)' : 'transparent',
                    opacity: header.column.getIsResizing() ? 1 : 0,
                  }}
                />
              </Box>
            ))}
          </Box>
        ))}
        {table.getRowModel().rows.map(row => (
          <Box 
            className="tanstack-tr" 
            key={row.id} 
            style={{ 
              display: 'flex',
              borderBottom: '1px solid var(--mantine-color-gray-2)',
            }}
          >
            {row.getVisibleCells().map(cell => (
              <Box
                className="tanstack-td"
                key={cell.id}
                style={{ 
                  width: cell.column.getSize(),
                  display: 'flex',
                  alignItems: 'center',
                  borderRight: '1px solid var(--mantine-color-gray-2)',
                  minHeight: '40px',
                  fontSize: '14px'
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TaskTable;
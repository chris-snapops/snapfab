import { Box, Text } from "@mantine/core";
import { getCoreRowModel, useReactTable, flexRender } from "@tanstack/react-table";
import DATA from "../../../public/temptabledata";
import { useState } from "react";
import StringCell from "./StringCell";
import EnumCell from "./EnumCell";

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
    cell: (props: any) => {
      const value = props.getValue();
      return <Text size="sm">{value ? new Date(value).toLocaleDateString() : "-"}</Text>;
    }
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
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    meta: {
      updateData: (rowIndex: number, columnId: string, value: string) => setData(
        prev => prev.map(
          (row, index) =>
            index === rowIndex
              ? {
                ...row,
                [columnId]: value,
              } : row
        )
      )
    }
  });

  return (
    <Box style={{ overflowX: 'auto' }} pb="md">
      <Box className="tanstack-table" style={{ width: table.getTotalSize() }}>
        {table.getHeaderGroups().map(headerGroup => (
          <Box className="tanstack-tr" key={headerGroup.id} style={{ display: 'flex' }}>
            {headerGroup.headers.map(header => (
              <Box 
                className="tanstack-th" 
                key={header.id} 
                style={{ 
                  width: header.getSize(),
                  position: 'relative'
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
                />
              </Box>
            ))}
          </Box>
        ))}
        {table.getRowModel().rows.map(row => (
          <Box className="tanstack-tr" key={row.id} style={{ display: 'flex' }}>
            {row.getVisibleCells().map(cell => (
              <Box 
                className="tanstack-td" 
                key={cell.id}
                style={{ width: cell.column.getSize() }}
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
// https://youtu.be/CjqG277Hmgg?t=1674

import { Box } from "@chakra-ui/react";
import { buildHeaderGroups, getCoreRowModel, RowModel, Table, useReactTable, flexRender } from "@tanstack/react-table"
import { Status } from "../../../public/temptabledata"
import DATA from "../../../public/temptabledata"
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
    cell: (props: any) => <p>{props.getValue()?.toLocaleTimeString()}</p>
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    cell: (props: any) => <p>{props.getValue()}</p>
  }
]

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
                ...prev[rowIndex],
                [columnId]: value,
              } : row
        )
      )
    }
  });
  console.log(data);
  return (
    <Box overflowX="auto" pb={4}>
      <Box className="tanstack-table" w={table.getTotalSize()}>
        {table.getHeaderGroups().map(headerGroup => (
          <Box className="tanstack-tr" key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <Box className="tanstack-th" w={header.getSize()} key={header.id} position="relative">
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
          <Box className="tanstack-tr" key={row.id}>
            {row.getVisibleCells().map(cell => (
              <Box className="tanstack-td" w={cell.column.getSize()} key={cell.id}>
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
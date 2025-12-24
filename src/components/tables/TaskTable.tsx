// https://youtu.be/CjqG277Hmgg?t=940

import { Box } from "@chakra-ui/react";
import { buildHeaderGroups, getCoreRowModel, RowModel, Table, useReactTable, flexRender } from "@tanstack/react-table"
import { Status } from "../../../public/temptabledata"
import DATA from "../../../public/temptabledata"
import { useState } from "react";

const columns = [
  {
    accessorKey: 'task',
    header: 'Task',
    size: 200,
    cell: (props: any) => <p>{props.getValue()}</p>
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (props: any) => <p>{props.getValue()?.name}</p>
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
  });
  return (
    <Box>
      <Box className="table" w={table.getTotalSize()}>
        {table.getHeaderGroups().map(headerGroup => <Box className="tr" key={headerGroup.id}>
          {headerGroup.headers.map(
            header => <Box className="th" w={header.getSize()} key={headerGroup.id}>
              {header.column.columnDef.header instanceof Function
                ? header.column.columnDef.header(header.getContext())
                : header.column.columnDef.header
              }
              <Box
                onMouseDown={header.getResizeHandler()}
                onTouchStart={header.getResizeHandler()}
                className={
                  `resizer ${header.column.getIsResizing() ? "isResizing" : ""}`
                } />
            </Box>
          )}
        </Box>)}
        {
          table.getRowModel().rows.map(row => <Box className="tr" key={row.id}>
            {row.getVisibleCells().map(cell => <Box className="td" w={cell.column.getSize()} key={cell.id}>
              {flexRender(
                cell.column.columnDef.cell,
                cell.getContext()
              )}
            </Box>)}
          </Box>)
        }
      </Box>
    </Box>
  );
};
export default TaskTable;
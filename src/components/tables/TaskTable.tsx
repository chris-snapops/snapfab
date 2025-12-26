import { Box, Flex, Text } from "@mantine/core";
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
    <Box 
      style={{ overflowX: 'auto', borderRadius: 'var(--mantine-radius-md)' }}
      bd="1px solid var(--mantine-color-default-border)"
      mb="md"
    >
      <style>{`
        .tanstack-tr {
          transition: background-color 0.1s ease;
        }
        .tanstack-tr:hover {
          background-color: var(--mantine-color-gray-0);
        }
        [data-mantine-color-scheme='dark'] .tanstack-tr:hover {
          background-color: var(--mantine-color-dark-6);
        }
      `}</style>
      <Flex
        className="tanstack-table"
        w={table.getTotalSize()}
        direction="column"
        bg="var(--mantine-color-body)"
      >
        {table.getHeaderGroups().map(headerGroup => (
          <Flex
            className="tanstack-tr-header"
            key={headerGroup.id}
            bg="var(--mantine-color-body)"
            style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}
          >
            {headerGroup.headers.map(header => (
              <Flex
                className="tanstack-th"
                key={header.id}
                w={header.getSize()}
                pos="relative"
                align="center"
                px="12px"
                py="8px"
                fw={700}
                fz={12}
                c="var(--mantine-color-text)"
                tt="uppercase"
                style={{ letterSpacing: '0.05em', borderRight: '1px solid var(--mantine-color-default-border)' }}
                h={40}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
                <div
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                  className={`resizer ${header.column.getIsResizing() ? "isResizing" : ""}`}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    cursor: 'col-resize',
                    userSelect: 'none',
                    touchAction: 'none',
                    zIndex: 1,
                    backgroundColor: header.column.getIsResizing() ? 'var(--mantine-color-blue-6)' : 'transparent',
                    opacity: header.column.getIsResizing() ? 1 : 0,
                  }}
                />
              </Flex>
            ))}
          </Flex>
        ))}
        {table.getRowModel().rows.map(row => (
          <Flex 
            className="tanstack-tr" 
            key={row.id} 
            style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}
          >
            {row.getVisibleCells().map(cell => (
              <Flex
                className="tanstack-td"
                key={cell.id}
                w={cell.column.getSize()}
                align="center"
                style={{ borderRight: '1px solid var(--mantine-color-default-border)' }}
                mih={40}
                fz={14}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Flex>
            ))}
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

export default TaskTable;
import { Box, Flex, Loader, Center } from "@mantine/core";
import { getCoreRowModel, useReactTable, flexRender } from "@tanstack/react-table";
import { useState, useEffect, useMemo } from "react";
import { getTable } from "../../utils/supabaseUtils";
import StringCell from "./StringCell";
import EnumCell from "./EnumCell";
import DateCell from "./DateCell";

// Helper to map your DB types to your React components
const getCellComponent = (colType: string) => {
  switch (colType) {
    case 'enum_single':
      return EnumCell;
    case 'date':
      return DateCell;
    default:
      return StringCell;
  }
};

const AppTable = ({ tableId }: { tableId: string }) => {
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getTable(tableId);
        setData(result.data);
        setHeaders(result.headers);
      } catch (error) {
        console.error("Error fetching table:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    console.log(data);
  }, [tableId]);

  // Dynamically generate columns based on the 'headers' from Supabase
  const columns = useMemo(() => {
    return headers.map((h) => ({
      accessorKey: h.col_name,
      header: h.col_name.charAt(0).toUpperCase() + h.col_name.slice(1).replace(/_/g, ' '),
      cell: getCellComponent(h.col_type),
      // Pass col_config to the cell meta if needed
      meta: {
        config: h.col_config,
        isRequired: h.col_is_required
      }
    }));
  }, [headers]);

  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      minSize: 150,
    },
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    meta: {
      updateData: (rowIndex: number, columnId: string, value: any) =>
        setData(prev => prev.map((row, index) =>
          index === rowIndex ? { ...row, [columnId]: value } : row
        ))
    }
  });

  if (loading) {
    return (
      <Center h={200}>
        <Loader color="blue" />
      </Center>
    );
  }

  return (
    <Box
      style={{ overflowX: 'auto', borderRadius: 'var(--mantine-radius-md)' }}
      bd="1px solid var(--mantine-color-default-border)"
      mb="md"
    >
      <style>{`
        .tanstack-tr { transition: background-color 0.1s ease; }
        .tanstack-tr:hover { background-color: var(--mantine-color-gray-0); }
        [data-mantine-color-scheme='dark'] .tanstack-tr:hover { background-color: var(--mantine-color-dark-6); }
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
                    position: 'absolute', right: 0, top: 0, bottom: 0, width: 6,
                    cursor: 'col-resize', userSelect: 'none', touchAction: 'none', zIndex: 1,
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

export default AppTable;
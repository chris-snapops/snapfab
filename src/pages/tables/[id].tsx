import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { Box, Flex, Title, Loader, Center } from "@mantine/core";
import { getCoreRowModel, useReactTable, flexRender } from "@tanstack/react-table";
import Layout from "../../components/Layout";
import { getTable } from "../../utils/supabaseUtils";

// Cell Components
import StringCell from "../../components/tables/StringCell";
import EnumCell from "../../components/tables/EnumCell";
import DateCell from "../../components/tables/DateCell";

const getCellComponent = (colType: string) => {
  switch (colType) {
    case 'enum_single': return EnumCell;
    case 'date': return DateCell;
    default: return StringCell;
  }
};

export default function TablePage() {
  const router = useRouter();
  const { id } = router.query;

  const [tableInfo, setTableInfo] = useState<{ table_name: string } | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getTable(id as string);
        setData(result.data);
        setHeaders(result.headers);
        setTableInfo(result.table);
      } catch (error) {
        console.error("Error fetching table:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const columns = useMemo(() => {
    return headers.map((h) => ({
      accessorKey: h.col_name,
      header: h.col_name.charAt(0).toUpperCase() + h.col_name.slice(1).replace(/_/g, ' '),
      cell: getCellComponent(h.col_type),
      meta: {
        config: h.col_config,
        isRequired: h.col_is_required
      }
    }));
  }, [headers]);

  const table = useReactTable({
    data,
    columns,
    defaultColumn: { minSize: 150 },
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    meta: {
      updateData: (rowIndex: number, columnId: string, value: any) =>
        setData(prev => prev.map((row, index) =>
          index === rowIndex ? { ...row, [columnId]: value } : row
        ))
    }
  });

  return (
    <Layout title={tableInfo?.table_name || "Loading..."}>
      <Box>
        <Title order={1} mb="xl">{tableInfo?.table_name || "Loading..."}</Title>

        {loading ? (
          <Center h={200}><Loader color="blue" /></Center>
        ) : (
          <Box
            style={{ overflowX: 'auto', borderRadius: 'var(--mantine-radius-md)' }}
            bd="1px solid var(--mantine-color-default-border)"
          >
            <style>{`
              .tanstack-tr:hover { background-color: var(--mantine-color-default-hover); }
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
                      pos="relative" // Added for resizer positioning
                      align="center"
                      px="12px"
                      py="8px"
                      fw={700}
                      fz={12}
                      h={40}
                      c="var(--mantine-color-text)"
                      tt="uppercase" // Added Uppercase
                      style={{
                        letterSpacing: '0.05em',
                        borderRight: '1px solid var(--mantine-color-default-border)'
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}

                      {/* Added Column Resizer Handle */}
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`resizer ${header.column.getIsResizing() ? "isResizing" : ""}`}
                        style={{
                          position: 'absolute', right: 0, top: 0, bottom: 0, width: 4,
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
                      fz={14} // Added matching font size
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Flex>
                  ))}
                </Flex>
              ))}
            </Flex>
          </Box>
        )}
      </Box>
    </Layout>
  );
}
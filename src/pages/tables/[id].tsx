import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { Box, Flex, Title, Loader, Center, Button } from "@mantine/core";
import { getCoreRowModel, useReactTable, flexRender } from "@tanstack/react-table";
import Layout from "../../components/Layout";
import { getTable } from "../../utils/supabaseUtils";

// Cell Components
import StringCell from "../../components/tables/StringCell";
import EnumCell from "../../components/tables/EnumCell";
import DateCell from "../../components/tables/DateCell";
import { Plus } from "lucide-react";

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
    // 1. Create a copy and sort based on the position property
    const sortedHeaders = [...headers].sort((a, b) => (a.position || 0) - (b.position || 0));

    // 2. Map the sorted headers to column definitions
    return sortedHeaders.map((h) => ({
      accessorKey: h.col_name,
      header: h.col_name.charAt(0).toUpperCase() + h.col_name.slice(1).replace(/_/g, ' '),
      cell: getCellComponent(h.col_type),
      meta: {
        config: h.col_config,
        isRequired: h.col_is_required,
        position: h.position // Optional: keep it in meta for reference
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
          <Center h={200}><Loader /></Center>
        ) : (
          <Box
            style={{ overflowX: 'auto', borderRadius: 'var(--mantine-radius-md)' }}
            bd="1px solid var(--mantine-color-default-border)"
            w="100%"
          >
            <style>{`
              .tanstack-tr:hover { background-color: var(--mantine-primary-color-light); }
            `}</style>

            <Flex
              className="tanstack-table"
              w="100%"
              direction="column"
              bg="var(--mantine-color-body)"
            >
              {table.getHeaderGroups().map(headerGroup => (
                <Flex
                  className="tanstack-tr-header"
                  key={headerGroup.id}
                  w="100%"
                  bg="var(--mantine-color-body)"
                  style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}
                >
                  <Flex
                    className="tanstack-th"
                    align="center"
                    justify="center"
                    px="0"
                    fw={700}
                    fz={12}
                    mih={40}
                    style={{
                      flex: '0 0 35px',
                      borderRight: '1px solid var(--mantine-color-default-border)',
                    }}
                  >
                    0
                  </Flex>
                  {headerGroup.headers.map((header, index) => (
                    <Flex
                      className="tanstack-th"
                      key={header.id}
                      w={header.getSize()}
                      pos="relative"
                      align="center"
                      px="8px"
                      py="8px"
                      fw={700}
                      fz={12}
                      h={40}
                      c="var(--mantine-color-text)"
                      tt="uppercase"
                      style={{
                        // If it's the last data column, allow it to grow (flex: 1)
                        flex: index === headerGroup.headers.length - 1 ? '1 1 auto' : '0 0 auto',
                        letterSpacing: '0.05em',
                        borderRight: '1px solid var(--mantine-color-default-border)',
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}

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
                  <Button
                    variant="subtle"
                    radius="0"
                    px="0"
                    h={40}
                    onClick={() => {
                      console.log(`Add column to table ${id}`);
                    }}
                    style={{
                      flex: '0 0 35px',
                    }}
                  >
                    <Plus size={16} />
                  </Button>
                </Flex>
              ))}

              {table.getRowModel().rows.map(row => (
                <Flex
                  className="tanstack-tr"
                  key={row.id}
                  w="100%"
                  style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}
                >
                  <Flex
                    className="tanstack-th"
                    align="center"
                    justify="center"
                    px="0"
                    fw={700}
                    fz={12}
                    mih={40}
                    style={{
                      flex: '0 0 35px',
                      borderRight: '1px solid var(--mantine-color-default-border)',
                    }}
                  >
                    {row.index + 1}
                  </Flex>
                  {row.getVisibleCells().map((cell, index) => (
                    <Flex
                      className="tanstack-td"
                      key={cell.id}
                      w={cell.column.getSize()}
                      align="center"
                      style={{
                        // If it's the last data column, allow it to grow (flex: 1)
                        flex: index === row.getVisibleCells().length - 1 ? '1 1 auto' : '0 0 auto',
                        borderRight: '1px solid var(--mantine-color-default-border)',
                      }}
                      fz={14}
                      mih={40}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Flex>
                  ))}
                  <Flex style={{ flex: '0 0 35px' }} />
                </Flex>
              ))}
              <Flex>
                <Button
                  variant="subtle"
                  radius="0"
                  px="0"
                  onClick={() => {
                    console.log(`Add row to table ${id}`);
                  }}
                  style={{
                    flex: '0 0 35px',
                    borderRight: '1px solid var(--mantine-color-default-border)'
                  }}
                >
                  <Plus size={16} />
                </Button>
              </Flex>
            </Flex>
          </Box>
        )}
      </Box>
    </Layout>
  );
}
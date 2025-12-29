import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { Box, Flex, Title, Loader, Center, Button, Checkbox } from "@mantine/core";
import { Plus } from "lucide-react";
import { 
  getCoreRowModel, 
  useReactTable, 
  flexRender, 
  RowSelectionState 
} from "@tanstack/react-table";
import Layout from "../../components/Layout";
import { getTable, createRow, deleteRows } from "../../utils/supabaseUtils";

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
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  // 1. Add Row Selection State
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

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

  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id]);

  useEffect(() => {
    if (headers.length > 0) {
      // Ensure 'select' is always the first item in the column order
      const initialOrder = [
        'select', 
        ...([...headers]
          .sort((a, b) => (a.col_position || 0) - (b.col_position || 0))
          .map(h => h.col_id))
      ];
      setColumnOrder(initialOrder);
    }
  }, [headers]);

  const columns = useMemo(() => {
    const sortedHeaders = [...headers].sort((a, b) => a.col_position - b.col_position);

    const dynamicColumns = sortedHeaders.map((h) => ({
      accessorKey: h.col_id,
      header: h.col_name.charAt(0).toUpperCase() + h.col_name.slice(1).replace(/_/g, ' '),
      cell: getCellComponent(h.col_type),
      size: 150,
      meta: {
        config: h.col_config,
        isRequired: h.col_is_required,
      }
    }));

    // 2. Prepend the selection column
    return [
      {
        id: 'select',
        size: 40,
        enableResizing: false, // Prevent resizing
        header: ({ table }: any) => (
          <Center w="100%">
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              indeterminate={table.getIsSomePageRowsSelected()}
              onChange={table.getToggleAllPageRowsSelectedHandler()}
              styles={{ input: { cursor: 'pointer' } }}
            />
          </Center>
        ),
        cell: ({ row }: any) => (
          <Center w="100%">
            <Checkbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
              styles={{ input: { cursor: 'pointer' } }}
            />
          </Center>
        ),
      },
      ...dynamicColumns
    ];
  }, [headers]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnOrder,
      rowSelection,
    },
    enableRowSelection: true, // This enables shift-click selection by default
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: setColumnOrder,
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
        <Flex justify="space-between" align="center" mb="xl">
          <Title order={1}>{tableInfo?.table_name || "Loading..."}</Title>
          {Object.keys(rowSelection).length > 0 && (
            <Button color="red" variant="light" onClick={() => {
              const selectedIds = table.getSelectedRowModel().rows.map(r => r.original.id);
              handleDeleteRows(selectedIds);
            }}>
              Delete Selected ({Object.keys(rowSelection).length})
            </Button>
          )}
        </Flex>

        {loading ? (
          <Center h={200}><Loader /></Center>
        ) : (
          <Box
            style={{ overflowX: 'auto', borderRadius: 'var(--mantine-radius-md)' }}
            bd="1px solid var(--mantine-color-default-border)"
            w="100%"
          >
            <Flex className="tanstack-table" w="100%" direction="column" bg="var(--mantine-color-body)">
              {table.getHeaderGroups().map(headerGroup => (
                <Flex
                  className="tanstack-tr-header"
                  key={headerGroup.id}
                  w="100%"
                  bg="var(--mantine-color-body)"
                  style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}
                >
                  {headerGroup.headers.map((header, index) => {
                    const isSelect = header.id === 'select';
                    return (
                      <Flex
                        className="tanstack-th"
                        key={header.id}
                        w={header.getSize()}
                        pos="relative"
                        align="center"
                        px={isSelect ? "0" : "8px"}
                        py="8px"
                        fw={700}
                        fz={12}
                        h={40}
                        style={{
                          flex: index === headerGroup.headers.length - 1 ? '1 1 auto' : '0 0 auto',
                          borderRight: '1px solid var(--mantine-color-default-border)',
                        }}
                      >
                        {/* Only show move buttons for non-selection columns, and don't allow moving into index 0 */}
                        {!isSelect && index > 1 && (
                          <Button
                            variant="subtle"
                            size="compact-xs"
                            onClick={() => {
                              const newOrder = [...columnOrder];
                              const [movedColumn] = newOrder.splice(index, 1);
                              newOrder.splice(index - 1, 0, movedColumn);
                              setColumnOrder(newOrder);
                            }}
                          >
                            ←
                          </Button>
                        )}
                        
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        
                        {/* Only show resizer if column is resizable */}
                        {header.column.getCanResize() && (
                          <div
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className="resizer"
                            style={{
                              position: 'absolute', right: 0, top: 0, bottom: 0, width: 4,
                              cursor: 'col-resize', zIndex: 1,
                            }}
                          />
                        )}
                      </Flex>
                    );
                  })}
                </Flex>
              ))}

              {table.getRowModel().rows.map(row => (
                <Flex
                  className="tanstack-tr"
                  key={row.id}
                  w="100%"
                  bg={row.getIsSelected() ? 'var(--mantine-color-blue-light)' : 'transparent'}
                  style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <Flex
                      className="tanstack-td"
                      key={cell.id}
                      w={cell.column.getSize()}
                      align="center"
                      style={{
                        flex: index === row.getVisibleCells().length - 1 ? '1 1 auto' : '0 0 auto',
                        borderRight: '1px solid var(--mantine-color-default-border)',
                      }}
                      mih={40}
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
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { Box, Flex, Title, Loader, Center, Button, Checkbox } from "@mantine/core";
import { Plus } from "lucide-react";
import { getCoreRowModel, useReactTable, flexRender, RowSelectionState, RowData } from "@tanstack/react-table";
import Layout from "../../components/Layout";
import { getTable, createColumn, createRow, deleteRows, updateCells, CellDataTypes } from "../../utils/supabaseUtils";

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

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    colDataType?: CellDataTypes;
    config?: any;
    isRequired?: boolean | null;
  }
}

export default function TablePage() {
  const router = useRouter();
  const { id } = router.query;

  const [tableInfo, setTableInfo] = useState<{ table_name: string } | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
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
      const initialOrder = [
        'select',
        ...([...headers]
          .sort((a, b) => (a.col_position || 0) - (b.col_position || 0))
          .map(h => h.col_id))
      ];
      setColumnOrder(initialOrder);
    }
  }, [headers]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(
          (document.activeElement as HTMLElement)?.tagName
        );

        if (!isTyping) setRowSelection({});
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const columns = useMemo(() => {
    const sortedHeaders = [...headers].sort((a, b) => a.col_position - b.col_position);

    const dynamicColumns = sortedHeaders.map((h) => ({
      accessorKey: h.col_id,
      header: h.col_name.charAt(0).toUpperCase() + h.col_name.slice(1).replace(/_/g, ' '),
      cell: getCellComponent(h.col_type),
      minSize: 120,
      size: 150,
      meta: {
        config: h.col_config,
        isRequired: h.col_is_required,
        colDataType: h.col_type,
      }
    }));

    // 2. Prepend the selection column
    return [
      {
        id: 'select',
        size: 35,
        enableResizing: false, // Prevent resizing
        header: ({ table }: any) => (
          <Center w="100%">
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              indeterminate={table.getIsSomePageRowsSelected()}
              onChange={table.getToggleAllPageRowsSelectedHandler()}
              size="xs"
              radius="sm"
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
              onClick={(e) => e.stopPropagation()}
              size="xs"
              radius="sm"
              styles={{ input: { cursor: 'pointer' } }}
            />
          </Center>
        ),
      },
      ...dynamicColumns
    ];
  }, [headers]);

  const handleSaveOrder = async () => {
    try {
      // Map the current string order to objects for Supabase
      const updates = columnOrder.map((colId, index) => ({
        col_id: colId,
        col_position: index, // New position based on array index
      }));

      // TODO in supabaseUtils
      // await updateColumnPositions(id, updates); 

      console.log("Saved new order:", updates);
    } catch (error) {
      console.error("Failed to save column order", error);
    }
  };

  const handleAddColumn = async () => {
    // await createColumn(id as string, {
    //   _name: "",
    //   _data_type: "",
    //   _config: "",
    //   _is_required: false,
    // });
  }


  const handleAddRow = async () => {
    console.log("Adding row");
    await createRow(id as string);
    fetchData();
  }

  const handleDeleteRows = async (rowIds: string[]) => {
    await deleteRows(rowIds);
    setRowSelection({})
    fetchData();
  }

  const handleUpdateCell = async (e: any, colDataType: string, colId: string, rowId: string) => {
    console.log("Updating cell");
    console.log(colId);
    console.log(rowId);
    console.log(colDataType);
    console.log(e.target.value);

    let data_type = "_value_text";
    switch (colDataType) {
      case "text": data_type = "_value_text"; break;
      case "enum_single": data_type = "_value_text"; break;
      case "enum_multi": data_type = "_value_text"; break;
      case "number": data_type = "_value_number"; break;
      case "boolean": data_type = "_value_boolean"; break;
      case "date": data_type = "_value_date"; break;
      case "json": data_type = "_value_json"; break;
    }
    await updateCells([{ _col_id: colId, _row_id: rowId, _data_type: data_type as CellDataTypes, _value: e.target.value }]);
    fetchData();
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      columnOrder,
      rowSelection,
    },
    enableRowSelection: true,
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
              const selectedIds = table.getSelectedRowModel().rows.map(r => r.original.row_id);
              handleDeleteRows(selectedIds as string[]);
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
                        c="var(--mantine-color-text)"
                        tt="uppercase"
                        style={{
                          // If it's the last data column, allow it to grow (flex: 1)
                          flex: index === headerGroup.headers.length - 1 ? '1 1 auto' : '0 0 auto',
                          letterSpacing: '0.05em',
                          borderRight: '1px solid var(--mantine-color-default-border)',
                        }}
                      >
                        {/* Simple Move Left Button TODO make drag and drop */}
                        {!isSelect && index > 1 && (
                          <Button
                            variant="subtle"
                            size="compact-xs"
                            onClick={() => {
                              const newOrder = [...columnOrder];
                              const [movedColumn] = newOrder.splice(index, 1);
                              newOrder.splice(index - 1, 0, movedColumn);
                              setColumnOrder(newOrder);
                              handleSaveOrder();
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
                  {row.getVisibleCells().map((cell, index) => (
                    <Flex
                      className="tanstack-td"
                      key={cell.id}
                      w={cell.column.getSize()}
                      align="center"
                      onBlur={(e) => handleUpdateCell(e, cell.column.columnDef.meta?.colDataType || "_value_text", cell.column.id, row.original.row_id)}
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
                  onClick={handleAddRow}
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
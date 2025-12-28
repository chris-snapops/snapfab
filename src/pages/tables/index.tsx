import React, { useEffect, useState } from "react";
import { Center, Loader, Stack, Text } from "@mantine/core";
import TablePicker from "../../components/tables/TablePicker";
import NewTableDrawer from "../../components/tables/NewTableDrawer";
import Layout from "../../components/Layout";
import { listTables, createTable } from "../../utils/supabaseUtils";
import { useDisclosure } from "@mantine/hooks";

export default function Tables() {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpened, { open, close }] = useDisclosure(false);

  // 1. Define the fetch function at the component level
  const fetchTables = async () => {
    try {
      setLoading(true);
      const orgId = localStorage.getItem("snapfab-org");
      const tableData = await listTables(orgId);

      const formattedTables = tableData
        .filter((t: any) => !t.table_archived)
        .map((t: any) => ({
          table_name: t.table_name,
          table_id: t.table_id,
          href: `/tables/${t.table_id}`,
        }));

      setTables(formattedTables);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load tables.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Run it on mount
  useEffect(() => {
    fetchTables();
  }, []);

  // 3. Simple refresh function
  const refreshTables = () => {
    fetchTables();
    close();
  };

  const handleCreateTable = async (data: { name: string; description: string; orgId: string }) => {
    const orgId = localStorage.getItem("snapfab-org");
    if (!orgId) return alert("Please select an organization.");

    try {
      // Note: Added 'await' so it finishes before refreshing
      await createTable(orgId, {
        _name: data.name,
        _description: data.description,
        _archived: false
      });
      
      refreshTables();
    } catch (err) {
      console.error("Creation failed", err);
    }
  };

  const openTableCreateDrawer = () => {
    open();
  };

  return (
    <Layout title="Tables">
      <Center p="xl">
        {loading ? (
          <Stack align="center">
            <Loader size="lg" />
            <Text size="sm">Fetching your tables...</Text>
          </Stack>
        ) : error ? (
          <Text>{error}</Text>
        ) : (
          <>
            <TablePicker tables={tables} onCreate={openTableCreateDrawer} />
            <NewTableDrawer
              opened={drawerOpened}
              onClose={close}
              onSubmit={handleCreateTable}
              orgId={localStorage.getItem("snapfab-org") || ""}
            />
          </>
        )}
      </Center>
    </Layout>
  );
}

import React, { useEffect, useState } from "react";
import { Center, Loader, Stack, Text } from "@mantine/core";
import TablePicker from "../../components/TablePicker";
import Layout from "../../components/Layout";
import { listTables } from "../../utils/supabaseUtils";

export default function Tables() {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTables() {
      try {
        setLoading(true);
        const orgId = localStorage.getItem("snapfab-org");
        const tableData = await listTables(orgId || "");
        
        const formattedTables = tableData.map((t: any) => ({
          table_name: t.table_name,
          table_id: t.table_id,
          href: `/tables/${t.table_id}`,
        }));

        setTables(formattedTables);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load tables. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchTables();
  }, []);

  const handleCreate = () => {
    alert("Create new table clicked");
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
          <TablePicker tables={tables} onCreate={handleCreate} />
        )}
      </Center>
    </Layout>
  );
}

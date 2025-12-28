import React, { useEffect, useState } from "react";
import { Center } from "@mantine/core";
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
  const [orgId, setOrgId] = useState<string | null>(null);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const orgId = localStorage.getItem("snapfab-org");
      setOrgId(orgId);

      const tableData = await listTables(orgId) || [];

      const formattedTables = tableData.map((t: any) => ({
        table_name: t.table_name,
        table_description: t.table_description,
        table_id: t.table_id,
        href: `/tables/${t.table_id}`,
      }));

      setTables(formattedTables);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load tables.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleCreateTable = async (data: { name: string; description: string }) => {
    if (!orgId) return;

    try {
      await createTable(orgId, {
        _name: data.name,
        _description: data.description,
        _archived: false
      });

      // Refresh list and close drawer
      fetchTables();
      close();
    } catch (err) {
      console.error("Creation failed", err);
    }
  };

  return (
    <Layout title="Tables">
      <Center p="xl">
        <TablePicker
          tables={tables}
          loading={loading}
          error={error}
          orgId={orgId}
          onCreate={open}
        />

        <NewTableDrawer
          opened={drawerOpened}
          onClose={close}
          onSubmit={handleCreateTable}
          orgId={orgId || ""}
        />
      </Center>
    </Layout>
  );
}
import { useEffect, useState } from 'react';
import { getTable, listTables, listOrgs, createTable } from '../utils/supabaseUtils';
import Layout from "../components/Layout";
import { Container, Title, Code, Loader, Alert, Box, TextInput, ActionIcon, Group, Grid, Button } from '@mantine/core';
import { RefreshCw, Copy, Check } from 'lucide-react';


export default function TestingPage() {
  const [orgId, setOrgId] = useState('7046697c-981b-4f43-82dd-b5c8eb0bf1cc');
  const [tableId, setTableId] = useState('eaa2329b-55a8-4279-854e-71289f27975d');
  const [cellData, setCellData] = useState<any>(null);
  const [tables, setTables] = useState<any>(null);
  const [orgs, setOrgs] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedTables, setCopiedTables] = useState(false);
  const [copiedData, setCopiedData] = useState(false);


  const fetchOrgs = async () => {
    setLoading(true);
    setError(null);
    try {
      const orgsList = await listOrgs();
      setOrgs(orgsList);
    } catch (err: any) {
      setError(`listOrgs error: ${err.message}`);
      setOrgs(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchTables = async () => {
    setLoading(true);
    setError(null);
    try {
      const tablesList = await listTables(orgId);
      setTables(tablesList);
    } catch (err: any) {
      setError(`listTables error: ${err.message}`);
      setTables(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const tableData = await getTable(tableId, false);
      setCellData(tableData);
    } catch (err: any) {
      setError(`getTable error: ${err.message}`);
      setCellData(null);
    } finally {
      setLoading(false);
    }
  };


  const handleCopyJson = async (data: any, type: 'tables' | 'data') => {
    if (data) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        if (type === 'tables') {
          setCopiedTables(true);
          setTimeout(() => setCopiedTables(false), 1000);
        } else {
          setCopiedData(true);
          setTimeout(() => setCopiedData(false), 1000);
        }
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  useEffect(() => {
    fetchData();
    fetchTables();
    fetchOrgs();
  }, [tableId, orgId]);

  return (
    <Layout>
      <Container p="md">
        <Title order={2} mb="md">Testing Page</Title>

        <Button
          mb="md"
          variant="outline"
          aria-label="Do thing"
          onClick={async () => {
            console.log('Do thing');
          }}
        >
          Do thing
        </Button>

        {error && (
          <Alert color="red" title="Error" mb="md">
            {error}
          </Alert>
        )}

        <Group mb="md">
          <TextInput
            label="Organization ID"
            placeholder="Enter organization ID"
            value={orgId}
            onChange={(e) => setOrgId(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
        </Group>

        <Group mb="md">
          <TextInput
            label="Table ID"
            placeholder="Enter table ID"
            value={tableId}
            onChange={(e) => setTableId(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
        </Group>

        {loading && <Loader />}

        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Box mt="md">
              <Group mb="xs" justify="space-between">
                <Title order={4}>Tables ({tables?.length || 0})</Title>
                <ActionIcon
                  variant="subtle"
                  size="md"
                  onClick={() => handleCopyJson(tables, 'tables')}
                  color={copiedTables ? 'green' : 'gray'}
                  aria-label="Copy JSON data"
                >
                  {copiedTables ? <Check size={18} /> : <Copy size={18} />}
                </ActionIcon>
              </Group>
              <Code block style={{ whiteSpace: 'pre-wrap' }}>
                {tables ? JSON.stringify(tables
                  .filter((table: any) => !table.table_archived)
                  .map((table: any) => {
                    return {
                      table_name: table.table_name,
                      table_description: table.table_description,
                      table_id: table.table_id,
                      org_name: table.org_name,
                      org_id: table.org_id,
                      headers: table.headers,
                    };
                  }), null, 2) : "Organization not found."}
              </Code>
            </Box>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Box mt="md">
              <Group mb="xs" justify="space-between">
                <Title order={4}>Data ({cellData?.data?.length || 0})</Title>
                <ActionIcon
                  variant="subtle"
                  size="md"
                  onClick={() => handleCopyJson(cellData, 'data')}
                  color={copiedData ? 'green' : 'gray'}
                  aria-label="Copy JSON data"
                >
                  {copiedData ? <Check size={18} /> : <Copy size={18} />}
                </ActionIcon>
              </Group>
              <Code block style={{ whiteSpace: 'pre-wrap' }}>
                {cellData ? JSON.stringify({
                  table: {
                    table_name: cellData.table.table_name,
                    table_description: cellData.table.table_description,
                    table_id: cellData.table.table_id,
                    table_archived: cellData.table.table_archived,
                    org_name: cellData.table.org_name,
                    org_id: cellData.table.org_id,
                  },
                  headers: cellData.headers,
                  data: cellData.data
                }, null, 2) : "Table not found."}
              </Code>
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
    </Layout>
  );
}
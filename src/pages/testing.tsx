import { useEffect, useState } from 'react';
import { getTable, listTables } from '../utils/supabaseUtils';
import Layout from "../components/Layout";
import { Container, Title, Code, Loader, Alert, Box, TextInput, ActionIcon, Group, Grid } from '@mantine/core';
import { RefreshCw, Copy, Check } from 'lucide-react';


export default function TestingPage() {
  const [orgName, setOrgName] = useState('SnapFab Demo Org');
  const [tableName, setTableName] = useState('eaa2329b-55a8-4279-854e-71289f27975d');
  const [data, setData] = useState<any>(null);
  const [tables, setTables] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedTables, setCopiedTables] = useState(false);
  const [copiedData, setCopiedData] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const tableData = await getTable(tableName);
      setData(tableData);
    } catch (err: any) {
      setError(`getTable error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };


  const fetchTables = async () => {
    setLoading(true);
    setError(null);
    try {
      const tablesList = await listTables(orgName);
      setTables(tablesList);
    } catch (err: any) {
      setError(`listTables error: ${err.message}`);
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
  }, [tableName, orgName]);

  return (
    <Layout>
      <Container p="md">
        <Title order={2} mb="md">Testing Page</Title>

        {error && (
          <Alert color="red" title="Error" mb="md">
            {error}
          </Alert>
        )}

        <Group mb="md">
          <TextInput
            label="Organization Name"
            placeholder="Enter organization name"
            value={orgName}
            onChange={(e) => setOrgName(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
        </Group>

        <Group mb="md">
          <TextInput
            label="Table Name"
            placeholder="Enter table name"
            value={tableName}
            onChange={(e) => setTableName(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <ActionIcon
            variant="filled"
            size="lg"
            onClick={fetchData}
            style={{ marginTop: '25px' }}
            aria-label="Refresh data"
          >
            <RefreshCw size={18} />
          </ActionIcon>
        </Group>

        {loading && <Loader />}

        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            {tables && (
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
                  {JSON.stringify(tables.map((table: any) => {
                    return {
                      table_name: table.table_name,
                      table_id: table.table_id,
                      org_name: table.org_name,
                      org_id: table.org_id,
                      headers: table.headers,
                    };
                  }), null, 2)}
                </Code>
              </Box>
            )}
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            {data && (
              <Box mt="md">
                <Group mb="xs" justify="space-between">
                  <Title order={4}>Data ({data?.data?.length || 0})</Title>
                  <ActionIcon
                    variant="subtle"
                    size="md"
                    onClick={() => handleCopyJson(data, 'data')}
                    color={copiedData ? 'green' : 'gray'}
                    aria-label="Copy JSON data"
                  >
                    {copiedData ? <Check size={18} /> : <Copy size={18} />}
                  </ActionIcon>
                </Group>
                <Code block style={{ whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify({
                    table: {
                      table_name: data.table.table_name,
                      table_id: data.table.table_id,
                      org_name: data.table.org_name,
                      org_id: data.table.org_id,
                    },
                    headers: data.headers,
                    data: data.data
                  }, null, 2)}
                </Code>
              </Box>
            )}
          </Grid.Col>
        </Grid>
      </Container>
    </Layout>
  );
}
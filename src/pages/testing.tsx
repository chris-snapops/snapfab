import { useEffect, useState } from 'react';
import { getTable } from '../utils/supabaseUtils';
import Layout from "../components/Layout";
import { Container, Title, Code, Loader, Alert, Box, TextInput, ActionIcon, Group } from '@mantine/core';
import { RefreshCw, Copy, Check } from 'lucide-react';


export default function TestingPage() {
  const [tableName, setTableName] = useState('Ingredients');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const tableData = await getTable(tableName);
      setData(tableData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyJson = async () => {
    if (data) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [tableName]);

  return (
    <Layout>
      <Container p="md">
        <Title order={2} mb="md">Testing Page</Title>

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

        {error && (
          <Alert color="red" title="Error" mb="md">
            {error}
          </Alert>
        )}

        {data && (
          <Box mt="md">
            <Group mb="xs" justify="space-between">
              <Title order={4}>Data ({data?.data?.length || 0})</Title>
              <ActionIcon
                variant="subtle"
                size="md"
                onClick={handleCopyJson}
                color={copied ? 'green' : 'gray'}
                aria-label="Copy JSON data"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </ActionIcon>
            </Group>
            <Code block style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(data, null, 2)}
            </Code>
          </Box>
        )}
      </Container>
    </Layout>
  );
}
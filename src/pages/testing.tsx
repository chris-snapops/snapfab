import { useEffect, useState } from 'react';
import { getTable } from '../utils/supabaseUtils';
import Layout from "../components/Layout";
import { Container, Title, Code, Loader, Alert, Box } from '@mantine/core';


export default function TestingPage() {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const rows = await getTable('Ingredients');
        setData(rows);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <Container p="md">
        <Title order={2} mb="md">Testing Page</Title>

        {loading && <Loader />}

        {error && (
          <Alert color="red" title="Error" mb="md">
            {error}
          </Alert>
        )}

        {data && (
          <Box mt="md">
            <Title order={4} mb="xs">Record Count: {data.length}</Title>
            <Code block style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(data, null, 2)}
            </Code>
          </Box>
        )}
      </Container>
    </Layout>
  );
}
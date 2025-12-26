import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Container, Title, Code, Loader, Alert, Box } from '@mantine/core';

export default function TestingPage() {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: userTables, error } = await supabase
          .from('user_rows')
          .select('*');

        if (error) throw error;
        setData(userTables);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container p="md">
      <Title order={2} mb="md">Supabase Data: test01</Title>
      
      {loading && <Loader />}
      
      {error && (
        <Alert color="red" title="Error" mb="md">
          {error}
        </Alert>
      )}

      {data && (
        <Box>
           <Title order={4} mb="xs">Record Count: {data.length}</Title>
           <Code block style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(data, null, 2)}
          </Code>
        </Box>
      )}
    </Container>
  );
}

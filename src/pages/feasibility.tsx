import { Title, Text, Container, Card } from "@mantine/core";
import Layout from "../components/Layout";

export default function Feasibility() {
  return (
    <Layout title="Feasibility">
      <Container size="sm" py="xl">
        <Title order={1} mb="md">Feasibility Analysis</Title>
        <Card withBorder padding="xl" radius="lg">
          <Text c="dimmed">
            The feasibility calculation module is currently being optimized. 
            Stay tuned for advanced manufacturing projections and analytics.
          </Text>
        </Card>
      </Container>
    </Layout>
  );
}

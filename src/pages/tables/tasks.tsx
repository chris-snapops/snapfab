import { Box, Title } from "@mantine/core";
import TaskTable from "../../components/tables/TaskTable";
import Layout from "../../components/Layout";

function App() {
  return (
    <Layout title="Tasks">
      <Box>
        <Title order={1} mb="xl">TanStack Table</Title>
        <TaskTable />
      </Box>
    </Layout>
  );
}

export default App;
import { Box, Heading } from "@chakra-ui/react";
import TaskTable from "../../components/tables/TaskTable";
import Layout from "../../components/Layout";

function App() {
  return (
    <Layout>
      <Box>
        <Heading mb={10}>TanStack Table</Heading>
        <TaskTable />
      </Box>
    </Layout>
  );
}

export default App;
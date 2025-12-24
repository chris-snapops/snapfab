import { Box, Heading } from "@chakra-ui/react";
import TaskTable from "../../components/tables/TaskTable";
import Layout from "../../components/Layout";

function App() {
  return (
    <Layout>
      <Box maxW={1000} mx="auto" px={6} pt={24} fontSize="sm">
        <Heading mb={10}>TanStack Table</Heading>
        <TaskTable />
      </Box>
    </Layout>
  );
}

export default App;
import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Flex minH="100vh">
      <Sidebar />
      <Box as="main" flex="1" ml={{ base: 0, md: "64" }} bg="bg.app" p="6">
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;
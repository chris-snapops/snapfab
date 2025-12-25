import Head from "next/head";
import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  const fullTitle = title ? `SnapFab | ${title}` : "SnapFab";

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
      </Head>
      <Flex minH="100vh">
        <Sidebar />
        <Box as="main" flex="1" ml={{ base: 0, md: "44" }} bg="bg.app" p="6">
          {children}
        </Box>
      </Flex>
    </>
  );
};

export default Layout;
import Layout from "../components/Layout";
import { Heading, useColorMode, Button, Text, Box, Flex, Icon, Divider } from "@chakra-ui/react";
import { Sun, Moon } from "lucide-react";

export default function Settings() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Layout>
      <Box maxW="600px">
        <Heading mb={6} size="lg">Settings</Heading>
        
        <Box bg="bg.card" p={6} borderRadius="lg" border="1px solid" borderColor="border.subtle">
          <Flex align="center" justify="space-between">
            <Box>
              <Text fontWeight="semibold" mb={1}>Appearance</Text>
              <Text fontSize="sm" color="text.secondary">
                Switch between light and dark themes.
              </Text>
            </Box>
            <Button
              onClick={toggleColorMode}
              leftIcon={<Icon as={colorMode === "light" ? Moon : Sun} size={18} />}
              variant="outline"
              size="md"
            >
              {colorMode === "light" ? "Dark Mode" : "Light Mode"}
            </Button>
          </Flex>
          
          <Divider my={6} borderColor="border.subtle" />
          
          <Box>
            <Text fontWeight="semibold" mb={1}>App Info</Text>
            <Text fontSize="sm" color="text.secondary">
              SnapFab v0.1.0 - Utility first database automation.
            </Text>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}

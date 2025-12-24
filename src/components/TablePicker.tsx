// components/TablePicker.tsx
import React from "react";
import Link from "next/link";
import { Plus, Table as TableIcon } from "lucide-react";
import { Box, Flex, Input, Button, Text, Link as ChakraLink, Icon, VStack } from "@chakra-ui/react";

interface TablePickerProps {
  tables: { name: string; rows?: number; href: string }[];
  onCreate: () => void;
}

const TablePicker: React.FC<TablePickerProps> = ({ tables, onCreate }) => {
  return (
    <Box
      w="full"
      maxW="800px"
      bg="bg.card"
      border="1px solid"
      borderColor="border.subtle"
      borderRadius="xl"
      boxShadow="sm"
      overflow="hidden"
    >
      {/* Header with Search & New Table */}
      <Flex
        align="center"
        justify="space-between"
        p="4"
        borderBottom="1px solid"
        borderColor="border.subtle"
        bg="bg.sidebar"
      >
        <Input
          placeholder="Search tables..."
          size="sm"
          borderRadius="md"
          variant="filled"
          bg="bg.muted"
          _focus={{ bg: "bg.card", borderColor: "accent.primary" }}
        />
        <Button
          onClick={onCreate}
          ml="3"
          leftIcon={<Plus size={16} />}
          colorScheme="blue"
          size="sm"
          px="4"
        >
          New Table
        </Button>
      </Flex>

      {/* Table list */}
      <VStack spacing="0" align="stretch" maxH="72" overflowY="auto">
        {tables.length === 0 && (
          <Text p="4" color="text.secondary" fontSize="sm" textAlign="center">
            No tables available
          </Text>
        )}
        {tables.map((table) => (
          <ChakraLink
            as={Link}
            key={table.name}
            href={table.href}
            display="flex"
            alignItems="center"
            px="4"
            py="3"
            gap="3"
            transition="all 0.2s"
            _hover={{ bg: "bg.hover", textDecoration: "none" }}
          >
            <Icon as={TableIcon} size={18} color="text.secondary" />
            <Box flex="1">
              <Text fontSize="sm" fontWeight="medium" color="text.primary">
                {table.name}
              </Text>
              {table.rows !== undefined && (
                <Text fontSize="xs" color="text.secondary">
                  {table.rows} rows
                </Text>
              )}
            </Box>
          </ChakraLink>
        ))}
      </VStack>
    </Box>
  );
};

export default TablePicker;
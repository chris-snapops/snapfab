import React from "react";
import Link from "next/link";
import { Plus, Table as TableIcon, ArrowRight } from "lucide-react";
import { Box, Flex, TextInput, Button, Text, Stack, Card, Group, Title, ThemeIcon, Center } from "@mantine/core";

interface TablePickerProps {
  tables: {
    table_name: string;
    table_id: string;
    href: string;
  }[];
  onCreate: () => void;
}

const TablePicker: React.FC<TablePickerProps> = ({ tables, onCreate }) => {
  return (
    <Card
      w="100%"
      maw={800}
      p={0}
      shadow="md"
      radius="lg"
      withBorder
      styles={(theme) => ({
        root: {
          overflow: 'hidden',
          backgroundColor: 'var(--mantine-color-body)',
        }
      })}
    >
      <Box
        p="lg"
        style={{
          borderBottom: '1px solid var(--mantine-color-default-border)',
          background: 'linear-gradient(to right, var(--mantine-primary-color-light), transparent)',
          '[dataMantineColorScheme="dark"] &': {
            background: 'none'
          }
        }}
      >
        <Group justify="space-between" wrap="nowrap">
          <Box flex={1}>
            <Title order={4} mb={4}>Data Tables</Title>
            <Text size="xs" c="dimmed">Select a table to view and manage your data</Text>
          </Box>
          <Button
            onClick={onCreate}
            leftSection={<Plus size={16} />}
            variant="light"
            radius="md"
          >
            New Table
          </Button>
        </Group>
      </Box>

      <Stack gap={0}>
        {tables.length === 0 && (
          <Center p="xl">
            <Stack gap="xs" align="center">
              <TableIcon size={32} strokeWidth={1} color="var(--mantine-color-dimmed)" />
              <Text c="dimmed" size="sm">No tables available</Text>
            </Stack>
          </Center>
        )}
        {tables.map((table) => (
          <Link
            key={table.table_name}
            href={table.href}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Group
              p="lg"
              gap="md"
              wrap="nowrap"
              style={{
                cursor: 'pointer',
                borderBottom: '1px solid var(--mantine-color-default-border)',
                transition: 'all 0.2s ease'
              }}
              className="table-picker-item"
              styles={{
                root: {
                  '&:hover': {
                    backgroundColor: 'var(--mantine-primary-color-light)',
                    paddingLeft: 'var(--mantine-spacing-xl)',
                  },
                  '&:last-child': {
                    borderBottom: 'none'
                  }
                }
              }}
            >
              <ThemeIcon variant="light" size="md" radius="md">
                <TableIcon size={16} />
              </ThemeIcon>
              <Box flex={1}>
                <Text size="sm" fw={600}>
                  {table.table_name}
                </Text>
              </Box>
              <ArrowRight size={16} color="var(--mantine-color-dimmed)" />
            </Group>
          </Link>
        ))}
      </Stack>
    </Card>
  );
};

export default TablePicker;
import React, { useEffect, useState } from "react";
import { Drawer, Button, TextInput, Textarea, Stack, Title, Text, Box, Group, Loader } from "@mantine/core";
import { listTables } from "../../utils/supabaseUtils";

interface NewTableDrawerProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; orgId: string }) => void;
  orgId: string;
}

const NewTableDrawer: React.FC<NewTableDrawerProps> = ({ opened, onClose, onSubmit, orgId }) => {
  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Validation & Data State
  const [existingTables, setExistingTables] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch tables when the drawer is opened
  useEffect(() => {
    const fetchExistingTables = async () => {
      if (opened) {
        setLoading(true);
        try {
          const tables = await listTables(orgId, false);
          setExistingTables(tables?.map((t: any) => t.table_name.toLowerCase()) || []);
        } catch (error) {
          console.error("Failed to fetch tables:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // Reset state when drawer closes
        setName("");
        setDescription("");
      }
    };

    fetchExistingTables();
  }, [opened]);

  // Logic to check for duplicates
  const isDuplicate = existingTables.includes(name.trim().toLowerCase());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && orgId && !isDuplicate) {
      onSubmit({ name, description, orgId });
      onClose();
    }
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="md"
      title={
        <Stack gap={4}>
          <Title order={4}>Create New Table</Title>
          <Text size="xs" c="dimmed">Define your table structure and ownership</Text>
        </Stack>
      }
    >
      <Box pos="relative">
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Table Name"
              placeholder="e.g. Inventory Management"
              required
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              error={isDuplicate ? "A table with this name already exists" : null}
            />

            <Textarea
              label="Description"
              placeholder="What kind of data will this table hold?"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
            />

            <Group justify="flex-end" mt="xl">
              <Button variant="subtle" onClick={onClose} color="gray">
                Cancel
              </Button>
              <Button
                type="submit"
                radius="md"
                disabled={isDuplicate || !name || loading}
              >
                Create Table
              </Button>
            </Group>
          </Stack>
        </form>
      </Box>
    </Drawer >
  );
};

export default NewTableDrawer;
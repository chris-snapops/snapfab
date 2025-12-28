import React, { useEffect, useState } from "react";
import { Drawer, Button, TextInput, Textarea, Select, Stack, Title, Text, Divider, LoadingOverlay, Box, Group } from "@mantine/core";

interface NewTableDrawerProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; orgId: string }) => void;
  orgId: string; // Passed down from your settings/app state
}

const NewTableDrawer: React.FC<NewTableDrawerProps> = ({ opened, onClose, onSubmit, orgId }) => {

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && orgId) {
      onSubmit({ name, description, orgId });
      // Clear form and close
      setName("");
      setDescription("");
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
      styles={{
        header: {
          borderBottom: '1px solid var(--mantine-color-default-border)',
          paddingBottom: 'var(--mantine-spacing-md)',
          marginBottom: 'var(--mantine-spacing-md)',
        },
        content: {
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <Box pos="relative" style={{ flex: 1 }}>
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Table Name"
              placeholder="e.g. Inventory Management"
              required
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
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
              <Button type="submit" radius="md">
                Create Table
              </Button>
            </Group>
          </Stack>
        </form>
      </Box>
    </Drawer>
  );
};

export default NewTableDrawer;
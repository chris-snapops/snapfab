import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Title, Text, Box, Group, Button, Divider, useMantineColorScheme, Card, Container, ColorSwatch, useMantineTheme, CheckIcon, Center, Stack } from "@mantine/core";
import { Sun, Moon } from "lucide-react";

interface SettingsProps {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

const THEME_COLORS = [
  { name: 'indigo', color: '#5359ff' },
  { name: 'violet', color: '#8b5cf6' },
  { name: 'rose', color: '#f43f5e' },
  { name: 'emerald', color: '#10b981' },
  { name: 'amber', color: '#f59e0b' },
];

export default function Settings({ primaryColor, setPrimaryColor }: SettingsProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleColorChange = (color: string) => {
    setPrimaryColor(color);
    localStorage.setItem("snapfab-primary-color", color);
  };

  return (
    <Layout title="Settings">
      <Container size="sm" py="xl">
        <Title order={1} mb="xl">Settings</Title>
        
        <Card withBorder padding="xl" radius="lg">
          <Text fw={700} size="lg" mb="md">General Preferences</Text>
          
          <Group justify="space-between" wrap="nowrap" mb="xl">
            <Box>
              <Text fw={600} mb={4}>Appearance</Text>
              <Text size="sm" c="dimmed">
                Toggle between light and dark modes to suit your preference.
              </Text>
            </Box>
            <Button
              onClick={toggleColorScheme}
              leftSection={mounted && (colorScheme === "light" ? <Moon size={18} /> : <Sun size={18} />)}
              variant="light"
              color={primaryColor}
              radius="md"
            >
              {mounted ? (colorScheme === "light" ? "Dark Mode" : "Light Mode") : "Loading..."}
            </Button>
          </Group>
          
          <Divider my="xl" />

          <Box mb="xl">
            <Text fw={600} mb={4}>Theme Color</Text>
            <Text size="sm" c="dimmed" mb="md">
              Select your preferred primary color for the application.
            </Text>
            <Group gap="sm">
              {THEME_COLORS.map((c) => (
                <Stack key={c.name} align="center" gap={4}>
                  <ColorSwatch
                    color={c.color}
                    onClick={() => handleColorChange(c.name)}
                    style={{ cursor: 'pointer', width: 32, height: 32 }}
                  >
                    {primaryColor === c.name && (
                      <CheckIcon style={{ width: 14, height: 14, color: '#fff' }} />
                    )}
                  </ColorSwatch>
                  <Text size="xs" tt="capitalize" fw={primaryColor === c.name ? 700 : 400}>
                    {c.name}
                  </Text>
                </Stack>
              ))}
            </Group>
          </Box>
          
          <Divider my="xl" />
          
          <Box>
            <Text fw={600} mb={4}>Application Information</Text>
            <Text size="sm" c="dimmed">
              SnapFab is a utility-first manufacturing database orchestration platform.
            </Text>
          </Box>
        </Card>
      </Container>
    </Layout>
  );
}


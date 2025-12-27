import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Title, Text, Box, Group, Button, Divider, useMantineColorScheme, Card, Container, ColorSwatch, useMantineTheme, CheckIcon, Center, Stack, TextInput, PasswordInput, Select } from "@mantine/core";
import { Sun, Moon } from "lucide-react";
import { listOrgs } from "../utils/supabaseUtils"; // Assuming this is the path

interface SettingsProps {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  dateValueFormat: string;
  setDateValueFormat: (format: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  login: (email: string, password: string) => Promise<any>;
  org: string;
  setOrg: (org: string) => void;
}


const THEME_COLORS = [
  { name: 'indigo', color: '#5359ff' },
  { name: 'violet', color: '#8b5cf6' },
  { name: 'rose', color: '#f43f5e' },
  { name: 'emerald', color: '#10b981' },
  { name: 'amber', color: '#f59e0b' },
];

const DATE_FORMATS = [
  { label: "Default (Dec 26, 2025)", value: "MMM D, YYYY" },
  { label: "DD/MM/YYYY (26/12/2025)", value: "DD/MM/YYYY" },
  { label: "MM/DD/YYYY (12/26/2025)", value: "MM/DD/YYYY" },
  { label: "YYYY-MM-DD (2025-12-26)", value: "YYYY-MM-DD" },
];

export default function Settings({ primaryColor, setPrimaryColor, dateValueFormat, setDateValueFormat, email, setEmail, password, setPassword, login, org, setOrg }: SettingsProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [mounted, setMounted] = useState(false);

  const [localEmail, setLocalEmail] = useState(email);
  const [localPassword, setLocalPassword] = useState(password);
  const [orgs, setOrgs] = useState<{ label: string; value: string; org_id: string }[]>([]); // local storage of available orgs

  useEffect(() => {
    setMounted(true);
    fetchOrgs();
  }, []);

  // Sync prop changes to local state (e.g. initial load)
  useEffect(() => {
     setLocalEmail(email);
     setLocalPassword(password);
  }, [email, password]);

  const fetchOrgs = async () => {
    try {
      const data = await listOrgs();
      const formattedOrgs = data.map((org: any) => ({
        label: org.org_name,
        value: org.org_id, // Mantine Select uses 'value' for the key
        org_id: org.org_id
      }));
      setOrgs(formattedOrgs);
    } catch (err) {
      console.error("Failed to load organizations", err);
    }
  };

  const handleColorChange = (color: string) => {
    setPrimaryColor(color);
    localStorage.setItem("snapfab-primary-color", color);
  };

  const handleDateFormatChange = (format: string) => {
    setDateValueFormat(format);
    localStorage.setItem("snapfab-date-format", format);
  };

  const handleOrgChange = (org: string) => {
    setOrg(org);
    if (org) {
      localStorage.setItem("snapfab-org", org);
    }
  };

  const handleSaveCredentials = async () => {
    setEmail(localEmail);
    setPassword(localPassword);
    const { error } = await login(localEmail, localPassword);

    if (error) {
      alert(`Login failed: ${error.message}`);
    } else {
      localStorage.setItem("snapfab-email", localEmail);
      localStorage.setItem("snapfab-password", localPassword);
      fetchOrgs(); // Refresh org list after new login
      alert("Credentials saved and logged in successfully!");
    }
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

          <Box mb="xl">
            <Text fw={600} mb={4}>Date Format</Text>
            <Text size="sm" c="dimmed" mb="md">
              Choose how dates are displayed throughout the application.
            </Text>
            <Group gap="sm">
              {DATE_FORMATS.map((format) => (
                <Button
                  key={format.value}
                  variant={dateValueFormat === format.value ? "filled" : "light"}
                  color={primaryColor}
                  onClick={() => handleDateFormatChange(format.value)}
                  size="sm"
                  radius="md"
                >
                  {format.label}
                </Button>
              ))}
            </Group>
          </Box>

          <Divider my="xl" />

          <Box mb="xl">
            <Text fw={600} mb={4}>Account</Text>
            <Text size="sm" c="dimmed" mb="md">
              Manage your authentication credentials.
            </Text>
            <Stack>
              <TextInput
                label="Email"
                placeholder="your@email.com"
                value={localEmail}
                onChange={(e) => setLocalEmail(e.currentTarget.value)}
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                value={localPassword}
                onChange={(e) => setLocalPassword(e.currentTarget.value)}
              />
              <Button onClick={handleSaveCredentials} color={primaryColor}>
                Save & Sign In
              </Button>
            </Stack>
          </Box>

          <Divider my="xl" />

          {/* New Organization Selection Section */}
          <Box mb="xl">
            <Text fw={600} mb={4}>Organization</Text>
            <Text size="sm" c="dimmed" mb="md">
              Select the organization workspace you wish to view.
            </Text>
            <Select
              label="Active Organization"
              placeholder="Pick an organization"
              data={orgs}
              value={org}
              onChange={(value) => handleOrgChange(value || '')}
              searchable
              nothingFoundMessage="No organizations found"
              renderOption={({ option }) => (
                <Group justify="space-between" style={{ flex: 1 }}>
                  <Text size="sm">{option.label}</Text>
                  <Text size="xs" c="dimmed" ff="monospace">
                    {option.value}
                  </Text>
                </Group>
              )}
            />
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

/*
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Title, Text, Box, Group, Button, Divider, useMantineColorScheme, Card, Container, ColorSwatch, useMantineTheme, CheckIcon, Center, Stack, TextInput, PasswordInput } from "@mantine/core";
import { Sun, Moon } from "lucide-react";

interface SettingsProps {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  dateValueFormat: string;
  setDateValueFormat: (format: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  login: (email: string, password: string) => Promise<any>;
}

const THEME_COLORS = [
  { name: 'indigo', color: '#5359ff' },
  { name: 'violet', color: '#8b5cf6' },
  { name: 'rose', color: '#f43f5e' },
  { name: 'emerald', color: '#10b981' },
  { name: 'amber', color: '#f59e0b' },
];

const DATE_FORMATS = [
  { label: "Default (Dec 26, 2025)", value: "MMM D, YYYY" },
  { label: "DD/MM/YYYY (26/12/2025)", value: "DD/MM/YYYY" },
  { label: "MM/DD/YYYY (12/26/2025)", value: "MM/DD/YYYY" },
  { label: "YYYY-MM-DD (2025-12-26)", value: "YYYY-MM-DD" },
];

export default function Settings({ primaryColor, setPrimaryColor, dateValueFormat, setDateValueFormat, email, setEmail, password, setPassword, login }: SettingsProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const [mounted, setMounted] = useState(false);
  
  const [localEmail, setLocalEmail] = useState(email);
  const [localPassword, setLocalPassword] = useState(password);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Sync prop changes to local state (e.g. initial load)
  useEffect(() => {
     setLocalEmail(email);
     setLocalPassword(password);
  }, [email, password]);

  const handleColorChange = (color: string) => {
    setPrimaryColor(color);
    localStorage.setItem("snapfab-primary-color", color);
  };

  const handleDateFormatChange = (format: string) => {
    setDateValueFormat(format);
    localStorage.setItem("snapfab-date-format", format);
  };

  const handleSaveCredentials = async () => {
    setEmail(localEmail);
    setPassword(localPassword);
    
    // Refresh auth
    const { error } = await login(localEmail, localPassword);
    
    if (error) {
       console.error("Login failed:", error.message);
       alert(`Login failed: ${error.message}`);
    } else {
       localStorage.setItem("snapfab-email", localEmail);
       localStorage.setItem("snapfab-password", localPassword);
       alert("Credentials saved and logged in successfully!");
    }
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

          <Box mb="xl">
            <Text fw={600} mb={4}>Date Format</Text>
            <Text size="sm" c="dimmed" mb="md">
              Choose how dates are displayed throughout the application.
            </Text>
            <Group gap="sm">
                {DATE_FORMATS.map((format) => (
                  <Button
                    key={format.value}
                    variant={dateValueFormat === format.value ? "filled" : "light"}
                    color={primaryColor}
                    onClick={() => handleDateFormatChange(format.value)}
                    size="sm"
                    radius="md"
                  >
                    {format.label}
                  </Button>
                ))}
            </Group>
          </Box>

          <Divider my="xl" />

          <Box mb="xl">
            <Text fw={600} mb={4}>Account</Text>
            <Text size="sm" c="dimmed" mb="md">
              Manage your authentication credentials.
            </Text>
            <Stack>
              <TextInput
                label="Email"
                placeholder="your@email.com"
                value={localEmail}
                onChange={(e) => setLocalEmail(e.currentTarget.value)}
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                value={localPassword}
                onChange={(e) => setLocalPassword(e.currentTarget.value)}
              />
              <Button onClick={handleSaveCredentials} color={primaryColor}>
                 Save & Sign In
              </Button>
            </Stack>
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

*/
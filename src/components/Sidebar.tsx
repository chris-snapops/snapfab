import Link from "next/link";
import { useRouter } from "next/router";
import { NavLink, Text, Box, Stack, Group, Title, ThemeIcon } from "@mantine/core";
import { Home, Table, BarChart2, Settings, Wrench } from "lucide-react";

interface SidebarProps {
  closeMobileNav: () => void;
}

const Sidebar = ({ closeMobileNav }: SidebarProps) => {
  const router = useRouter();

  const navItems = [
    { name: "Home", href: "/", icon: <Home size={20} strokeWidth={1.5} /> },
    { name: "Tables", href: "/tables", icon: <Table size={20} strokeWidth={1.5} /> },
    { name: "Feasibility", href: "/feasibility", icon: <BarChart2 size={20} strokeWidth={1.5} /> },
    { name: "Testing", href: "/testing", icon: <Wrench size={20} strokeWidth={1.5} /> },
    { name: "Settings", href: "/settings", icon: <Settings size={20} strokeWidth={1.5} /> },
  ];

  return (
    <Box h="100%" p="md" display="flex" style={{ flexDirection: 'column' }}>
      <Group h={40} px="md" mb="xl" visibleFrom="md">
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Title order={3} fw={800} lts="-0.5px">SnapFab</Title>
        </Link>
      </Group>

      <Stack gap="xs" style={{ flex: 1 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            component={Link}
            href={item.href}
            label={item.name}
            leftSection={item.icon}
            active={router.pathname === item.href}
            onClick={closeMobileNav}
            variant="filled"
            p="md"
            style={{ 
              borderRadius: 'var(--mantine-radius-md)',
              fontWeight: router.pathname === item.href ? 600 : 400
            }}
          />
        ))}
      </Stack>
      
      <Box pt="md" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
        <Text size="xs" c="dimmed" ta="center">© 2025 SnapFab v1.1</Text>
      </Box>
    </Box>
  );
};

export default Sidebar;
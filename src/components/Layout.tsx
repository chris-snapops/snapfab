import Head from "next/head";
import { AppShell, Burger, Group, Text, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  const [opened, { toggle, close }] = useDisclosure();
  const fullTitle = title ? `SnapFab | ${title}` : "SnapFab";

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
      </Head>
      <AppShell
        header={{ height: { base: 60, md: 0 } }}
        navbar={{
          width: 280,
          breakpoint: "md",
          collapsed: { mobile: !opened },
        }}
        padding="xl"
        styles={(theme) => ({
          main: {
            backgroundColor: 'var(--mantine-color-body)',
            minHeight: '100vh',
          },
          navbar: {
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(var(--mantine-color-body-rgb), 0.8)',
            borderRight: '1px solid var(--mantine-color-default-border)',
          },
          header: {
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(var(--mantine-color-body-rgb), 0.8)',
            borderBottom: '1px solid var(--mantine-color-default-border)',
          },
        })}
      >
        <AppShell.Header hiddenFrom="md">
          <Group h="100%" px="md">
            <Burger opened={opened} onClick={toggle} size="sm" />
            <Text fw="bold" size="lg" c="primary">SnapFab</Text>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar>
          <Sidebar closeMobileNav={close} />
        </AppShell.Navbar>

        <AppShell.Main>
          <Box maw={1200} mx="auto">
            {children}
          </Box>
        </AppShell.Main>
      </AppShell>
    </>
  );
};

export default Layout;
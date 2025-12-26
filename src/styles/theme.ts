import { createTheme, MantineThemeOverride } from '@mantine/core';

export const getTheme = (primaryColor: string, dateValueFormat: string): MantineThemeOverride => {
  return createTheme({
    other: {
      dateValueFormat,
    },
    primaryColor: primaryColor,
    primaryShade: { light: 6, dark: 8 },
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    headings: {
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      fontWeight: '700',
    },
    defaultRadius: 'md',
    cursorType: 'pointer',
    colors: {
      // Custom premium shades
      indigo: [
        '#f0f1ff',
        '#dde0ff',
        '#b9bcff',
        '#9195ff',
        '#6e73ff',
        '#5359ff',
        '#444bff',
        '#353fd9',
        '#2d37c2',
        '#242ea9',
      ],
      rose: [
        '#fff1f2',
        '#ffe4e6',
        '#fecdd3',
        '#fda4af',
        '#fb7185',
        '#f43f5e',
        '#e11d48',
        '#be123c',
        '#9f1239',
        '#881337',
      ],
      emerald: [
        '#ecfdf5',
        '#d1fae5',
        '#a7f3d0',
        '#6ee7b7',
        '#34d399',
        '#10b981',
        '#059669',
        '#047857',
        '#065f46',
        '#064e3b',
      ],
      amber: [
        '#fffbeb',
        '#fef3c7',
        '#fde68a',
        '#fcd34d',
        '#fbbf24',
        '#f59e0b',
        '#d97706',
        '#b45309',
        '#92400e',
        '#78350f',
      ],
      violet: [
        '#f5f3ff',
        '#ede9fe',
        '#ddd6fe',
        '#c4b5fd',
        '#a78bfa',
        '#8b5cf6',
        '#7c3aed',
        '#6d28d9',
        '#5b21b6',
        '#4c1d95',
      ],
    },
    shadows: {
      xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
      sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    components: {
      AppShell: {
        styles: {
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
        },
      },
      Button: {
        defaultProps: {
          fw: 500,
        },
      },
      Card: {
        defaultProps: {
          padding: 'xl',
          radius: 'lg',
          withBorder: true,
        },
      },
      NavLink: {
        defaultProps: {
          variant: 'light',
        },
      },
    },
  });
};

export const defaultPrimaryColor = 'indigo';


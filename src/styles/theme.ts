import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import styles from "./styles";
import { sidebarStyles } from "./components/sidebar.styles";
import { tableStyles } from "./components/table.styles";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles,
  semanticTokens: {
    colors: {
      "bg.app": {
        default: "gray.50",
        _dark: "gray.900",
      },
      "bg.sidebar": {
        default: "white",
        _dark: "gray.800",
      },
      "bg.card": {
        default: "white",
        _dark: "gray.800",
      },
      "bg.muted": {
        default: "gray.50",
        _dark: "gray.700",
      },
      "bg.hover": {
        default: "gray.100",
        _dark: "gray.700",
      },
      "bg.active": {
        default: "gray.200",
        _dark: "gray.600",
      },
      "text.primary": {
        default: "gray.900",
        _dark: "gray.50",
      },
      "text.secondary": {
        default: "gray.600",
        _dark: "gray.400",
      },
      "border.subtle": {
        default: "gray.200",
        _dark: "gray.700",
      },
      "border.table": {
        default: "gray.300",
        _dark: "gray.600",
      },
      "accent.primary": {
        default: "blue.600",
        _dark: "blue.400",
      },
    },
  },
  components: {
    Sidebar: {
      baseStyle: sidebarStyles.container,
      variants: {
        navItem: sidebarStyles.navItem,
      },
    },
    Table: {
      baseStyle: tableStyles.container,
    },
  },
});

export default theme;

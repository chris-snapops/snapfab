
export const sidebarStyles = {
  container: {
    bg: "bg.sidebar",
    borderRight: "1px",
    borderColor: "border.subtle",
    boxShadow: "sm",
    w: "64",
    h: "full",
  },
  navItem: {
    px: "4",
    py: "2",
    rounded: "md",
    transition: "all 0.2s",
    _hover: { bg: "bg.hover" },
    _active: { bg: "bg.active", fontWeight: "semibold" },
    display: "block",
  },
  logo: {
    fontSize: "xl",
    fontWeight: "bold",
    color: "text.primary",
  }
};

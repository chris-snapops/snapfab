import { tanstackTableStyles } from "./components/table.styles";

const styles = {
  global: {
    "html, body": {
      backgroundColor: "bg.app",
      color: "text.primary",
      transitionProperty: "background-color",
      transitionDuration: "normal",
    },
    "a.blue-link": {
      color: "accent.primary",
      textDecoration: "underline",
      textUnderlineOffset: "2px",
    },
    svg: {
      cursor: "pointer",
    },
    ...tanstackTableStyles,
  },
};

export default styles;

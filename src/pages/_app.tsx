import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { getTheme, defaultPrimaryColor } from "../styles/theme";

export default function App({ Component, pageProps }: AppProps) {
  const [primaryColor, setPrimaryColor] = useState(defaultPrimaryColor);

  useEffect(() => {
    const savedColor = localStorage.getItem("snapfab-primary-color");
    if (savedColor) {
      setPrimaryColor(savedColor);
    }
  }, []);

  const theme = getTheme(primaryColor);

  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Component {...pageProps} setPrimaryColor={setPrimaryColor} primaryColor={primaryColor} />
    </MantineProvider>
  );
}


import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { getTheme, defaultPrimaryColor } from "../styles/theme";

export default function App({ Component, pageProps }: AppProps) {
  const [primaryColor, setPrimaryColor] = useState(defaultPrimaryColor);
  const [dateValueFormat, setDateValueFormat] = useState("MMM D, YYYY");

  useEffect(() => {
    const savedColor = localStorage.getItem("snapfab-primary-color");
    if (savedColor) {
      setPrimaryColor(savedColor);
    }
    const savedDateFormat = localStorage.getItem("snapfab-date-format");
    if (savedDateFormat) {
      setDateValueFormat(savedDateFormat);
    }
  }, []);

  const theme = getTheme(primaryColor, dateValueFormat);

  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Component 
        {...pageProps} 
        setPrimaryColor={setPrimaryColor} 
        primaryColor={primaryColor}
        dateValueFormat={dateValueFormat}
        setDateValueFormat={setDateValueFormat}
      />
    </MantineProvider>
  );
}


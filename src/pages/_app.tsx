import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { getTheme, defaultPrimaryColor } from "../styles/theme";
import { supabase } from "../../supabaseClient";

export default function App({ Component, pageProps }: AppProps) {
  // Always initialize with default to avoid hydration mismatch
  const [primaryColor, setPrimaryColor] = useState(defaultPrimaryColor);
  const [dateValueFormat, setDateValueFormat] = useState("MMM D, YYYY");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mounted, setMounted] = useState(false);

  // Load from localStorage immediately after mount
  useEffect(() => {
    setMounted(true);
    
    const savedColor = localStorage.getItem("snapfab-primary-color");
    if (savedColor) {
      setPrimaryColor(savedColor);
    }
    
    const savedDateFormat = localStorage.getItem("snapfab-date-format");
    if (savedDateFormat) {
      setDateValueFormat(savedDateFormat);
    }
    
    const savedEmail = localStorage.getItem("snapfab-email");
    if (savedEmail) {
      setEmail(savedEmail);
    }

    const savedPassword = localStorage.getItem("snapfab-password");
    if (savedPassword) {
      setPassword(savedPassword);
    }
  }, []);

  // Sign in when credentials are available
  useEffect(() => {
    if (!email || !password) return;
    
    const signInUser = async () => {
       const { data: { session } } = await supabase.auth.getSession();
       if (!session) {
         await supabase.auth.signInWithPassword({
            email,
            password,
         });
       }
    };
    signInUser();
  }, [email, password]);



  const login = async (e: string, p: string) => {
    await supabase.auth.signOut();
    return await supabase.auth.signInWithPassword({
      email: e,
      password: p,
    });
  };

  const theme = getTheme(primaryColor, dateValueFormat);

  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Component 
        {...pageProps} 
        setPrimaryColor={setPrimaryColor} 
        primaryColor={primaryColor}
        dateValueFormat={dateValueFormat}
        setDateValueFormat={setDateValueFormat}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        login={login}
      />
    </MantineProvider>
  );
}


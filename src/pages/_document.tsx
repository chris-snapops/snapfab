import { Html, Head, Main, NextScript } from "next/document";
import { ColorSchemeScript } from "@mantine/core";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <ColorSchemeScript defaultColorScheme="light" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var savedColor = localStorage.getItem('snapfab-primary-color');
                if (savedColor) {
                  document.documentElement.setAttribute('data-primary-color', savedColor);
                }
              } catch (e) {}
            `,
          }}
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}


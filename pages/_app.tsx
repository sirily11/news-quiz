import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { lightBlue } from "@mui/material/colors";
import { teal } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: teal,
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;

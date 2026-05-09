"use client";

import type { ReactNode } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1f2f6b" },
    background: { default: "transparent", paper: "#ffffff" },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", "Noto Sans Thai", sans-serif',
    fontSize: 14,
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: 14,
          backgroundColor: "var(--background)",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: 14 },
      },
    },
  },
});

export function MuiProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
}

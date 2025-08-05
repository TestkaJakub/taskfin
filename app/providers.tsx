"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: ReactNode }) {
  return (
  <ThemeProvider attribute="class" defaultTheme="system">
    <SessionProvider>{children}</SessionProvider>
  </ThemeProvider>);
}
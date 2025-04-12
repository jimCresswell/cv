// src/components/providers/theme-provider.tsx
"use client";

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: Readonly<ThemeProviderProps>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange // Optional: recommended for smoother transitions
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

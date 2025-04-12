import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

import { PrintButton } from "@/components/print-button";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jim Cresswell | Hands-On Engineering Leadership",
  description: "CV of Jim Cresswell, Hands-On Engineering Leader",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-gb" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div id="root" className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 py-8 max-w-[45rem] print:px-0 print:py-2">
              <header className="flex justify-between gap-2 mb-4 print:hidden">
                <Link href="/">Home</Link>
                <div className="flex gap-2">
                  <PrintButton />
                  <ThemeToggle />
                </div>
              </header>
              <main className="mt-8">{children}</main>
              <footer className="mt-8">
                <p className="text-center text-muted-foreground">
                  Jim Cresswell &copy; {new Date().getFullYear()}
                </p>
              </footer>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import ErrorBoundary from "@/components/error-handling/error-boundary";
import { MobileMenu } from "@/components/mobile-menu";
import { NavigationBar } from "@/components/navigation-bar";
import { PrintButton } from "@/components/print-button";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SkipToContentLink } from "@/components/skip-to-content-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { getIconMetadata } from "@/data-generation/icon";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  icons: getIconMetadata(),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-gb" suppressHydrationWarning>
      <body className={inter.className}>
        <SkipToContentLink />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div id="root" className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 py-8 max-w-[45rem] print:px-0 print:py-2">
              <ErrorBoundary>
                <header className="flex justify-between gap-2 mb-4 print:hidden">
                  <Button
                    variant="link"
                    size="icon"
                    className="border-double border-3 border-muted-foreground **:rounded-full min-w-16 min-h-16 dark-only"
                    asChild
                  >
                    <Link href="/" aria-label="Home page">
                      <Image
                        src="/icon/icon-128-dark"
                        alt="Click to go to home page"
                        width={128}
                        height={128}
                        className="dark-only "
                      />
                      <Image
                        src="/icon/icon-128-light"
                        alt="Click to go to home page"
                        width={128}
                        height={128}
                        className="light-only"
                      />
                      <span className="sr-only">Home page</span>
                    </Link>
                  </Button>
                  <NavigationBar />
                  <div className="flex gap-2">
                    <PrintButton />
                    <ThemeToggle />
                    <MobileMenu />
                  </div>
                </header>

                <main id="main-content" className="mt-8">
                  {children}
                </main>
              </ErrorBoundary>
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

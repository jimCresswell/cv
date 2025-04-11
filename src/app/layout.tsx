import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Script from "next/script";

import { PrintButton } from "@/components/print-button";
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
    <html lang="en-gb">
      <body className={inter.className}>
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

        {/* Script to prevent flash of wrong theme */}
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function() {
              try {
                const savedTheme = localStorage.getItem('theme');
                
                if (savedTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else if (savedTheme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  // Check system preference if no saved theme or if theme is 'system'
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (prefersDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  
                  // Add listener for system theme changes
                  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                    if (localStorage.getItem('theme') === 'system') {
                      if (e.matches) {
                        document.documentElement.classList.add('dark');
                      } else {
                        document.documentElement.classList.remove('dark');
                      }
                    }
                  });
                }
              } catch (e) {
                console.error('Theme initialization error:', e);
              }
            })();
          `}
        </Script>

        {/* Script to handle click outside for dropdowns */}
        <Script id="click-outside-handler">
          {`
            document.addEventListener('click', function(event) {
              const dropdowns = document.querySelectorAll('[aria-expanded="true"]');
              dropdowns.forEach(dropdown => {
                // Check if the click is outside the dropdown
                if (!dropdown.contains(event.target)) {
                  // Find the closest parent with role="menu"
                  const menu = dropdown.nextElementSibling;
                  if (menu && menu.getAttribute('role') === 'menu') {
                    // Simulate a click on the dropdown to close it
                    dropdown.click();
                  }
                }
              });
            });
          `}
        </Script>
      </body>
    </html>
  );
}

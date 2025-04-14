"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "radix-ui";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { navLinks, type NavLink } from "@/lib/constants/navigation";
import { cn } from "@/lib/shared/utilities";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {/* Use Button component for consistent styling */}
        <Button
          variant="outline"
          size="icon"
          className="md:hidden" // Keep the md:hidden class
          aria-label="Open main menu"
        >
          <span className="sr-only">Open main menu</span>
          <Menu className={cn("h-6 w-6")} aria-hidden="true" />
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed inset-x-4 top-8 z-50 rounded-lg shadow-lg p-6 bg-background ring-1 ring-black/5 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%]">
          <Dialog.Title className="sr-only">Main Menu</Dialog.Title>
          <Dialog.Description className="sr-only">
            Navigation links for the site.
          </Dialog.Description>

          <div className="flex items-center justify-between mb-4">
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                aria-label="Close main menu"
              >
                <span className="sr-only">Close main menu</span>
                <X className={cn("h-6 w-6")} aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>
          <nav className="grid gap-y-4">
            {navLinks.map((link: NavLink) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-lg text-muted-foreground hover:text-primary",
                  pathname === link.href && "font-semibold text-primary",
                )}
                onClick={() => setOpen(false)}
                // Optional: Add aria-current if needed based on pathname
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

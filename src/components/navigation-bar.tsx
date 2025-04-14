"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navLinks, type NavLink } from "@/lib/constants/navigation";
import { cn } from "@/lib/shared/utilities";

export function NavigationBar() {
  const pathname = usePathname();

  const getLinkClass = (href: string) => {
    return pathname === href
      ? "text-lg font-medium text-primary"
      : "text-lg text-muted-foreground hover:text-primary";
  };

  return (
    <nav
      aria-label="Main Navigation"
      className="hidden md:flex justify-center md:justify-start gap-4 border-b mb-8 pb-4 print:hidden"
    >
      <ul className="flex gap-4">
        {navLinks.map((link: NavLink) => (
          <li key={link.href}>
            <Link href={link.href} className={cn(getLinkClass(link.href))}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

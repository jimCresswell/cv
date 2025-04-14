// src/lib/constants/navigation.ts

/**
 * Represents a single navigation link.
 */
export interface NavLink {
  href: string;
  label: string;
}

/**
 * Array of navigation links used in both the main navigation bar
 * and the mobile menu.
 */
export const navLinks: readonly NavLink[] = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/cv",
    label: "CV",
  },
  // Add more links here as needed
] as const;

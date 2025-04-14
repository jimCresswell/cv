import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { navLinks } from "@/lib/constants/navigation";

import { NavigationBar } from "./navigation-bar";

// Mock next/link if needed, though often not necessary for basic rendering
// vi.mock('next/link', () => {
//   return {
//     __esModule: true,
//     default: ({ children, href }: { children: React.ReactNode; href: string }) => (
//       <a href={href}>{children}</a>
//     ),
//   };
// });

describe("NavigationBar", () => {
  it("should render the navigation landmark with a list", () => {
    render(<NavigationBar />);
    const nav = screen.getByRole("navigation", { name: /main navigation/i });
    expect(nav).toBeInTheDocument();
    const list = within(nav).getByRole("list"); // ul has list role
    expect(list).toBeInTheDocument();
  });

  it("should render all navigation links from constants within list items", () => {
    render(<NavigationBar />);
    const list = screen.getByRole("navigation", { name: /main navigation/i });
    const links = within(list).getAllByRole("link");

    expect(links).toHaveLength(navLinks.length);

    for (const [index, navLink] of navLinks.entries()) {
      expect(links[index]).toHaveTextContent(navLink.label);
      expect(links[index]).toHaveAttribute("href", navLink.href);
      // Check link is within an li
      expect(links[index].closest("li")).toBeInTheDocument();
    }
  });

  it("should apply responsive classes to be hidden on small screens", () => {
    render(<NavigationBar />);
    const navElement = screen.getByRole("navigation", { name: /main navigation/i });
    // Check for the presence of Tailwind classes responsible for hiding/showing
    expect(navElement).toHaveClass("hidden"); // Initially hidden
    expect(navElement).toHaveClass("md:flex"); // Flex on medium screens and up
  });
});

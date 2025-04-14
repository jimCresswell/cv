import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";

import { MobileMenu } from "@/components/mobile-menu";
import { navLinks } from "@/lib/constants/navigation";

// Mock next/link
vi.mock("next/link", () => {
  return {
    default: ({
      children,
      href,
      onClick,
      ...props
    }: ComponentProps<"a"> & { children: React.ReactNode }) => (
      <a href={href ?? "#"} onClick={onClick} {...props}>
        {children}
      </a>
    ),
  };
});

// Mock usePathname hook
vi.mock("next/navigation", () => ({
  usePathname: () => "/", // Default mock path
}));

describe("MobileMenu", () => {
  const user = userEvent.setup();

  it("should render the trigger button and hide the menu initially", () => {
    render(<MobileMenu />);

    const triggerButton = screen.getByRole("button", { name: /open main menu/i });
    expect(triggerButton).toBeInTheDocument();
    // Radix Dialog content is often rendered but hidden until open
    // We query by role 'dialog' which Radix adds to Dialog.Content
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(); // More accurately, it might be present but hidden
    // Let's check if the links are present *initially*
    for (const link of navLinks) {
      expect(screen.queryByRole("link", { name: link.label })).not.toBeInTheDocument();
    }
  });

  it("should open the menu panel when trigger is clicked", async () => {
    render(<MobileMenu />);
    const triggerButton = screen.getByRole("button", { name: /open main menu/i });

    await user.click(triggerButton);

    const dialog = screen.getByRole("dialog", { name: /main menu/i }); // Dialog.Content should have an accessible name via aria-label or aria-labelledby
    expect(dialog).toBeInTheDocument();

    // Verify close button and links are now visible within the dialog
    expect(within(dialog).getByRole("button", { name: /close main menu/i })).toBeInTheDocument();
    for (const link of navLinks) {
      expect(within(dialog).getByRole("link", { name: link.label })).toBeInTheDocument();
    }
  });

  it("should close the menu panel when close button is clicked", async () => {
    render(<MobileMenu />);
    const triggerButton = screen.getByRole("button", { name: /open main menu/i });

    // Open menu
    await user.click(triggerButton);
    const dialog = screen.getByRole("dialog", { name: /main menu/i });
    expect(dialog).toBeInTheDocument();

    // Click close button
    const closeButton = within(dialog).getByRole("button", { name: /close main menu/i });
    await user.click(closeButton);

    // Check if dialog is gone (or hidden)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should close the menu panel when a navigation link is clicked", async () => {
    render(<MobileMenu />);
    const triggerButton = screen.getByRole("button", { name: /open main menu/i });

    // Open menu
    await user.click(triggerButton);
    const dialog = screen.getByRole("dialog", { name: /main menu/i });
    expect(dialog).toBeInTheDocument();

    // Click the first navigation link (wrapped in Dialog.Close)
    const firstLink = within(dialog).getByRole("link", { name: navLinks[0].label });
    await user.click(firstLink);

    // Wait for the dialog to disappear as state update might be async
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("should close the menu panel when Escape key is pressed", async () => {
    render(<MobileMenu />);
    const triggerButton = screen.getByRole("button", { name: /open main menu/i });

    // Open menu
    await user.click(triggerButton);
    expect(screen.getByRole("dialog", { name: /main menu/i })).toBeInTheDocument();

    // Press Escape
    await user.keyboard("{Escape}");

    // Check if dialog is gone
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should focus the close button when opened and return focus to trigger when closed", async () => {
    render(<MobileMenu />);
    const triggerButton = screen.getByRole("button", { name: /open main menu/i });
    expect(triggerButton).not.toHaveFocus();

    // Open menu
    await user.click(triggerButton);
    const dialog = screen.getByRole("dialog", { name: /main menu/i });
    const closeButton = within(dialog).getByRole("button", { name: /close main menu/i });

    // Radix Dialog usually focuses the first focusable element (close button here)
    expect(closeButton).toHaveFocus();

    // Close menu using Escape key
    await user.keyboard("{Escape}");

    // Focus should return to the trigger button
    expect(triggerButton).toHaveFocus();
  });
});

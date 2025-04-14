// src/components/theme-toggle.unit.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event"; // Ensure userEvent is imported
import { useTheme } from "next-themes";
import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";

// Import the component to test
import { ThemeToggle } from "./theme-toggle";

// Mock next-themes
vi.mock("next-themes", () => ({
  useTheme: vi.fn(),
}));

// Cast the mocked hook to Mock
const mockedUseTheme = useTheme as Mock;

describe("ThemeToggle", () => {
  // Reset mocks before each test
  beforeEach(() => {
    mockedUseTheme.mockReset();
    // Default mock return value (can be overridden in specific tests)
    mockedUseTheme.mockReturnValue({
      theme: "system",
      setTheme: vi.fn(),
      resolvedTheme: "light", // Assume system resolves to light initially
    });
  });

  it("should render the toggle button", () => {
    // Arrange
    render(<ThemeToggle />);

    // Assert
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
  });

  it("should render both sun and moon icons", () => {
    // Arrange
    render(<ThemeToggle />);

    // Assert: Check that *both* icons are always present in the button's DOM.
    // Visibility is handled by CSS based on the html class, which we don't reliably test here.
    const button = screen.getByRole("button", { name: /toggle theme/i });
    expect(button.querySelector(".lucide-sun")).toBeInTheDocument();
    expect(button.querySelector(".lucide-moon")).toBeInTheDocument();
  });

  it("should open the menu when the toggle button is clicked", async () => { // Make test async
    // Arrange
    const user = userEvent.setup(); // Setup userEvent
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /toggle theme/i });

    // Assert initial state (menu not visible)
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "false");

    // Act: Click the button
    await user.click(button); // Use userEvent.click

    // Assert final state (menu is visible)
    const menu = await screen.findByRole("menu"); // Use findByRole
    expect(menu).toBeInTheDocument();
    expect(await screen.findByRole("menuitemradio", { name: /light/i })).toBeInTheDocument(); // Check for an item too
    expect(await screen.findByRole("menuitemradio", { name: /dark/i })).toBeInTheDocument();
    expect(await screen.findByRole("menuitemradio", { name: /system/i })).toBeInTheDocument();
  });

  it("should call setTheme with the correct value when a menu item is clicked", async () => { // Make test async
    // Arrange
    const user = userEvent.setup(); // Setup userEvent
    const mockSetTheme = vi.fn();
    mockedUseTheme.mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme, // Use our trackable mock function
      resolvedTheme: "light",
    });
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /toggle theme/i });

    // Act: Open menu and click 'Dark'
    await user.click(button); // Use userEvent.click
    const darkMenuItem = await screen.findByRole("menuitemradio", { name: /dark/i }); // Use findByRole
    await user.click(darkMenuItem); // Use userEvent.click

    // Assert
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith("dark");

    // Act: Open menu again and click 'System'
    await user.click(button); // Re-open (assuming it closed on selection)
    const systemMenuItem = await screen.findByRole("menuitemradio", { name: /system/i }); // Use findByRole
    await user.click(systemMenuItem); // Use userEvent.click

    // Assert
    expect(mockSetTheme).toHaveBeenCalledTimes(2); // Called again
    expect(mockSetTheme).toHaveBeenCalledWith("system"); // Called with 'system'
  });

  // Add more failing tests later for Escape key, outside click etc.
  // These tests should fail because the component logic hasn't been updated yet.
});

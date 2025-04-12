// src/components/theme-toggle.unit.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { useTheme } from "next-themes";
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
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
    expect(screen.getByRole("button", { name: /select theme/i })).toBeInTheDocument();
  });

  it("should display the correct icon based on resolved theme (light)", () => {
    // Arrange
    // Default mock returns resolvedTheme: 'light'
    render(<ThemeToggle />);

    // Assert: Check for Sun icon (assuming it's associated with light theme)
    // Note: The actual selector might depend on how the icon is implemented (e.g., class name, data attribute)
    // Assuming lucide-react adds class names like 'lucide-sun'
    const button = screen.getByRole("button", { name: /select theme/i });
    expect(button.querySelector(".lucide-sun")).toBeInTheDocument();
    expect(button.querySelector(".lucide-moon")).not.toBeInTheDocument();
  });

  it("should display the correct icon based on resolved theme (dark)", () => {
    // Arrange
    mockedUseTheme.mockReturnValue({
      // Override default mock
      theme: "dark",
      setTheme: vi.fn(),
      resolvedTheme: "dark",
    });
    render(<ThemeToggle />);

    // Assert: Check for Moon icon
    const button = screen.getByRole("button", { name: /select theme/i });
    expect(button.querySelector(".lucide-moon")).toBeInTheDocument();
    expect(button.querySelector(".lucide-sun")).not.toBeInTheDocument();
  });

  it("should open the menu when the toggle button is clicked", () => {
    // Arrange
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /select theme/i });

    // Assert initial state (menu not visible)
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "false");

    // Act
    fireEvent.click(button);

    // Assert final state (menu is visible)
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menuitem", { name: /light/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /dark/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /system/i })).toBeInTheDocument();
  });

  it("should call setTheme with the correct value when a menu item is clicked", () => {
    // Arrange
    const mockSetTheme = vi.fn();
    mockedUseTheme.mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme, // Use our trackable mock function
      resolvedTheme: "light",
    });
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /select theme/i });

    // Act: Open menu and click 'Dark'
    fireEvent.click(button);
    const darkMenuItem = screen.getByRole("menuitem", { name: /dark/i });
    fireEvent.click(darkMenuItem);

    // Assert
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith("dark");

    // Act: Open menu again and click 'System'
    fireEvent.click(button); // Re-open (assuming it closed on selection)
    const systemMenuItem = screen.getByRole("menuitem", { name: /system/i });
    fireEvent.click(systemMenuItem);

    // Assert
    expect(mockSetTheme).toHaveBeenCalledTimes(2); // Called again
    expect(mockSetTheme).toHaveBeenCalledWith("system"); // Called with 'system'
  });

  // Add more failing tests later for Escape key, outside click etc.
  // These tests should fail because the component logic hasn't been updated yet.
});

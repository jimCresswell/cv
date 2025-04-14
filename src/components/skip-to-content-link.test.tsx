import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SkipToContentLink } from "./skip-to-content-link";

describe("SkipToContentLink", () => {
  it("should render the link with the correct href", () => {
    render(<SkipToContentLink />);

    const link = screen.getByRole("link", { name: /skip to main content/i });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#main-content");
  });

  it("should have accessibility attributes", () => {
    render(<SkipToContentLink />);
    const link = screen.getByRole("link", { name: /skip to main content/i });

    // Check for classes that handle visibility on focus
    // Checking key classes related to sr-only and focus behavior
    expect(link).toHaveClass(
      "absolute", // Base positioning
      "-translate-y-12", // Initially hidden off-screen
      "focus:translate-y-0", // Becomes visible on focus
      // Tailwind sr-only related classes are complex, check core ones
      "h-[1px]",
      "w-[1px]",
      "overflow-hidden",
      "focus:h-auto", // Restores dimensions on focus
      "focus:w-auto",
      "focus:overflow-visible",
    );
  });
});

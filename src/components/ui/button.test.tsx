import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("should render the button with default props", () => {
    render(<Button>Click Me</Button>);

    const buttonElement = screen.getByRole("button", { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
  });

  // Test variants
  it.each(["default", "destructive", "outline", "secondary", "ghost", "link"] as const)(
    "should render the button with variant '%s'",
    (variant) => {
      render(<Button variant={variant}>Click Me</Button>);
      const buttonElement = screen.getByRole("button", { name: /click me/i });
      expect(buttonElement).toBeInTheDocument();
      // More specific class checks could be added here if needed
    },
  );

  // Test sizes
  it.each(["default", "sm", "lg", "icon"] as const)(
    "should render the button with size '%s'",
    (size) => {
      render(<Button size={size}>Click Me</Button>);
      const buttonElement = screen.getByRole("button", { name: /click me/i });
      expect(buttonElement).toBeInTheDocument();
      // More specific class checks could be added here if needed
    },
  );

  it("should render as a different element when asChild is true", () => {
    render(
      <Button asChild>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Testing plain element rendering */}
        <a href="/">Link Button</a>
      </Button>,
    );

    const linkElement = screen.getByRole("link", { name: /link button/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.tagName).toBe("A");

    // Check that it's not rendered as a button
    expect(screen.queryByRole("button", { name: /link button/i })).not.toBeInTheDocument();
  });

  it("should render a disabled button", () => {
    render(<Button disabled>Click Me</Button>);

    const buttonElement = screen.getByRole("button", { name: /click me/i });
    expect(buttonElement).toBeDisabled();
  });
});

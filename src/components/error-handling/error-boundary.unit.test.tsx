import { render, screen } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, it, expect, vi, afterEach } from "vitest";

import { logger } from "../../lib/logging";

import ErrorBoundary from "./error-boundary";

// Mock the logger
vi.mock("../../lib/logging", () => {
  // Explicitly create the mock logger object
  const mockLogger = {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  };
  // Return an object with the 'logger' key pointing to the mock logger
  return { logger: mockLogger };
});

// A component that throws an error
const ProblemChild: React.FC = () => {
  throw new Error("Test error from child");
  return <></>; // Unreachable but needed for TSX
};

// A component that renders normally
const GoodChild: React.FC = () => <div>Everything is fine</div>;

describe("ErrorBoundary", () => {
  // Suppress console.error output from React about the caught error
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders children correctly when there is no error", () => {
    render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Everything is fine")).toBeInTheDocument();
  });

  it("catches an error thrown by a child component and displays fallback UI", () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>,
    );

    // Check for actual fallback UI elements
    expect(screen.getByRole("heading", { name: /something went wrong/i })).toBeInTheDocument();
    expect(screen.getByText(/we've been notified and are looking into it/i)).toBeInTheDocument();
    // Check that the good child content is NOT rendered
    expect(screen.queryByText("Everything is fine")).not.toBeInTheDocument();
  });

  it("logs the error when componentDidCatch is invoked", () => {
    const testError = new Error("Test error from child");
    // Need a way to simulate the error being caught. Rendering the problematic child
    // inside the boundary handles this via React's lifecycle.
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>,
    );

    // Check if logger.error was called
    expect(logger.error).toHaveBeenCalled();
    // Optional: Check if it was called with the expected error object and info
    // Note: The exact 'errorInfo' object might be complex to match perfectly.
    // Checking the error message might be sufficient.
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("ErrorBoundary caught an error:"),
      expect.objectContaining({
        error: expect.objectContaining({ message: testError.message }), // Check nested error message
        componentStack: expect.any(String), // Check componentStack exists
      }),
    );
  });
});

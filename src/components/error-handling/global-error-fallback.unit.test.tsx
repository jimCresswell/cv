import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { NetworkError } from "@/lib/shared/errors/network/network-error";
import { logger } from "@/lib/shared/logging";

import GlobalErrorFallback from "./global-error-fallback";

vi.mock("@/lib/shared/logging", () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

const mockedLogger = vi.mocked(logger, true);

describe("GlobalErrorFallback Component", () => {
  const mockReset = vi.fn();
  const mockError = new Error("Test error message") as Error & {
    digest?: string;
  };
  mockError.stack = "Test stack trace";
  mockError.digest = "test-digest-123";

  const mockNetworkError = new NetworkError(500, "Server Error") as Error & {
    digest?: string;
  };
  mockNetworkError.digest = "network-digest-456";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the fallback UI correctly", () => {
    render(<GlobalErrorFallback error={mockError} reset={mockReset} />);

    expect(
      screen.getByRole("heading", { name: /oops! something went wrong/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/an unexpected error occurred\. we/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("calls the reset function when the 'Try again' button is clicked", () => {
    render(<GlobalErrorFallback error={mockError} reset={mockReset} />);

    const tryAgainButton = screen.getByRole("button", { name: /try again/i });
    fireEvent.click(tryAgainButton);

    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('button has explicit type="button"', () => {
    render(<GlobalErrorFallback error={mockError} reset={mockReset} />);
    const tryAgainButton = screen.getByRole("button", { name: /try again/i });
    expect(tryAgainButton).toHaveAttribute("type", "button");
  });

  it("logs the error details on mount", () => {
    render(<GlobalErrorFallback error={mockError} reset={mockReset} />);

    expect(mockedLogger.error).toHaveBeenCalledTimes(1);

    expect(mockedLogger.error).toHaveBeenCalledWith(
      "Unhandled Application Error caught by GlobalErrorFallback:",
      expect.objectContaining({
        error: mockError,
        digest: mockError.digest,
      }),
    );
  });

  it("logs the error details including statusCode for NetworkError", () => {
    render(<GlobalErrorFallback error={mockNetworkError} reset={mockReset} />);

    expect(mockedLogger.error).toHaveBeenCalledTimes(1);
    expect(mockedLogger.error).toHaveBeenCalledWith(
      "Unhandled Application Error caught by GlobalErrorFallback:",
      expect.objectContaining({
        error: mockNetworkError,
        digest: mockNetworkError.digest,
        statusCode: 500,
      }),
    );
  });

  it("logs again if the error prop changes", () => {
    const { rerender } = render(<GlobalErrorFallback error={mockError} reset={mockReset} />);
    expect(mockedLogger.error).toHaveBeenCalledTimes(1);

    const newError = new Error("Another error") as Error & { digest?: string };
    newError.digest = "new-digest-789";

    rerender(<GlobalErrorFallback error={newError} reset={mockReset} />);

    expect(mockedLogger.error).toHaveBeenCalledTimes(2);
    expect(mockedLogger.error).toHaveBeenLastCalledWith(
      "Unhandled Application Error caught by GlobalErrorFallback:",
      expect.objectContaining({
        error: newError,
        digest: newError.digest,
      }),
    );
  });
});

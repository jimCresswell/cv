import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { logger } from "@/lib/logging"; // Import logger to potentially spy on

import FetchExampleClient from "./fetch-example-client";

// Mock the logger to prevent console noise during tests and allow spying
vi.mock("@/lib/logging", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(), // Mock error method specifically
    debug: vi.fn(),
  },
}));

// Helper to create a mock Fetch Response
const createMockResponse = (status: number, body: any, ok: boolean): Response => {
  return {
    ok,
    status,
    statusText: `Status ${status}`,
    json: async () => body,
    // Add other Response properties/methods if needed by the component
  } as Response;
};

describe("FetchExampleClient Integration Tests", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    // Assign the mock to global fetch before each test
    globalThis.fetch = mockFetch;
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore global fetch
    vi.restoreAllMocks();
  });

  it("should display success result on successful fetch", async () => {
    const mockData = { message: "Success!" };
    mockFetch.mockResolvedValue(createMockResponse(200, mockData, true));

    render(<FetchExampleClient />);

    const successButton = screen.getByRole("button", { name: /fetch success/i });
    fireEvent.click(successButton);

    // Wait directly for the success result to appear
    const resultDiv = await screen.findByTestId("success-result");
    expect(resultDiv).toBeInTheDocument();
    // Use toContain for less strict matching, ignoring the 'Success Result:' heading
    expect(resultDiv.textContent).toContain(JSON.stringify(mockData, undefined, 2));
    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
    // Ensure loading is gone (implicitly handled by findBy, but good practice)
    expect(screen.queryByTestId("loading-indicator")).not.toBeInTheDocument();

    // Verify fetch was called correctly
    expect(mockFetch).toHaveBeenCalledOnce();
    expect(mockFetch).toHaveBeenCalledWith("https://httpbin.org/get");
    // Verify logger was NOT called for success
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("should display NotFoundError message on 404 fetch", async () => {
    mockFetch.mockResolvedValue(createMockResponse(404, {}, false));

    render(<FetchExampleClient />);

    const notFoundButton = screen.getByRole("button", { name: /fetch not found/i });
    fireEvent.click(notFoundButton);

    // Wait directly for the error message to appear
    const errorDiv = await screen.findByTestId("error-message");
    expect(errorDiv).toBeInTheDocument();
    // processError uses http.STATUS_CODES['404'] which is 'Not Found'
    expect(errorDiv).toHaveTextContent("Error (NotFoundError): Not Found");
    expect(screen.queryByTestId("success-result")).not.toBeInTheDocument();
    expect(screen.queryByTestId("loading-indicator")).not.toBeInTheDocument();

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(mockFetch).toHaveBeenCalledWith("https://httpbin.org/status/404");
    // Verify logger WAS called by processError
    expect(logger.error).toHaveBeenCalledOnce();
    expect(logger.error).toHaveBeenCalledWith(
      "Processed error: NotFoundError - Not Found",
      expect.objectContaining({
        originalError: expect.objectContaining({
          message: "HTTP error! status: 404",
          response: { status: 404, statusText: "Status 404" },
        }),
        processedError: expect.objectContaining({
          name: "NotFoundError",
          message: "Not Found",
          statusCode: 404,
          isOperational: true,
        }),
      }),
    );
  });

  it("should display NetworkError message on 500 fetch", async () => {
    mockFetch.mockResolvedValue(createMockResponse(500, {}, false));

    render(<FetchExampleClient />);

    const serverErrorButton = screen.getByRole("button", { name: /fetch server error/i });
    fireEvent.click(serverErrorButton);

    // Wait directly for the error message to appear
    const errorDiv = await screen.findByTestId("error-message");
    expect(errorDiv).toBeInTheDocument();
    // processError uses http.STATUS_CODES['500'] which is 'Internal Server Error'
    expect(errorDiv).toHaveTextContent("Error (NetworkError): Internal Server Error");
    expect(screen.queryByTestId("success-result")).not.toBeInTheDocument();
    expect(screen.queryByTestId("loading-indicator")).not.toBeInTheDocument();

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(mockFetch).toHaveBeenCalledWith("https://httpbin.org/status/500");
    expect(logger.error).toHaveBeenCalledOnce();
    expect(logger.error).toHaveBeenCalledWith(
      "Processed error: NetworkError - Internal Server Error",
      expect.objectContaining({
        originalError: expect.objectContaining({
          message: "HTTP error! status: 500",
          response: { status: 500, statusText: "Status 500" },
        }),
        processedError: expect.objectContaining({
          name: "NetworkError",
          message: "Internal Server Error",
          statusCode: 500,
          isOperational: false,
        }),
      }),
    );
  });

  it("should display AppError message on network failure (fetch reject)", async () => {
    const networkErrorMessage = "Failed to fetch";
    // Simulate fetch rejecting (e.g., DNS error, network down)
    mockFetch.mockRejectedValue(new TypeError(networkErrorMessage));

    render(<FetchExampleClient />);

    const networkErrorButton = screen.getByRole("button", { name: /fetch network error/i });
    fireEvent.click(networkErrorButton);

    // Wait directly for the error message to appear
    const errorDiv = await screen.findByTestId("error-message");
    expect(errorDiv).toBeInTheDocument();
    // processError wraps generic Errors into AppError (non-operational)
    expect(errorDiv).toHaveTextContent(`Error (AppError): ${networkErrorMessage}`);
    expect(screen.queryByTestId("success-result")).not.toBeInTheDocument();
    expect(screen.queryByTestId("loading-indicator")).not.toBeInTheDocument();

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(mockFetch).toHaveBeenCalledWith("https://non-existent-domain.invalid/");
    expect(logger.error).toHaveBeenCalledOnce();
    expect(logger.error).toHaveBeenCalledWith(
      `Processed error: AppError - ${networkErrorMessage}`,
      expect.objectContaining({
        originalError: expect.any(TypeError),
        processedError: expect.objectContaining({
          name: "AppError",
          message: networkErrorMessage,
          isOperational: false,
        }),
      }),
    );
  });
});

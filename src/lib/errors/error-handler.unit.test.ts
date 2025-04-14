// src/lib/errors/error-handler.unit.test.ts
import { expect, describe, it, vi, beforeEach } from "vitest";

import { logger } from "@/lib/logging"; // Mock this

import { AppError } from "./app-error"; // Correct import path
import { processError } from "./error-handler"; // Import the function under test
import { AuthenticationError } from "./network/authentication-error"; // Import new error type
import { AuthorizationError } from "./network/authorization-error";
import { DatabaseError } from "./network/database-error";
import { NetworkError } from "./network/network-error";
import { NotFoundError } from "./network/not-found-error";
import { ValidationError } from "./network/validation-error";

// Import and mock the logger
vi.mock("@/lib/logging", () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

// Helper to create mock Response objects
const createMockResponse = (status: number, body?: unknown): Response => {
  return {
    status,
    ok: status >= 200 && status < 300,
    json: async () => body,
    // Add other Response properties/methods if needed by the handler
  } as Response;
};

// Helper to create mock FetchError objects
class MockFetchError extends Error {
  response?: Response;
  constructor(message: string, response?: Response) {
    super(message);
    this.name = "MockFetchError"; // Or appropriate name like 'FetchError'
    this.response = response;
  }
}

describe("processError Handler", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it("should return NotFoundError for a 404 FetchError", () => {
    const originalError = new MockFetchError("Not Found", createMockResponse(404));
    const processed = processError(originalError);

    expect(processed).toBeInstanceOf(NotFoundError);
    expect((processed as NetworkError).statusCode).toBe(404);
    expect(processed?.message).toBe("Not Found"); // Default message
    expect(processed?.cause).toBe(originalError); // Cause should still be set for Error types
    expect(logger.error).toHaveBeenCalledOnce();
    // Update assertion to match actual logged structure
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("Processed error: NotFoundError - Not Found"), // Match the log message string
      expect.objectContaining({
        // Match the metadata object
        originalError: originalError, // Expect the original error object directly
        processedError: expect.objectContaining({
          // Expect a processedError object containing...
          name: "NotFoundError",
          message: "Not Found",
          isOperational: true,
          statusCode: 404,
          // We don't need to assert on stack or cause within the logged processedError object
        }),
      }),
    );
  });

  it("should return AuthenticationError for a 401 FetchError", () => {
    const originalError = new MockFetchError("Unauthorized", createMockResponse(401));
    const processed = processError(originalError);

    expect(processed).toBeInstanceOf(AuthenticationError);
    expect((processed as NetworkError).statusCode).toBe(401);
    expect(processed?.message).toBe("Unauthorized"); // Prefers default message
    expect(processed?.cause).toBe(originalError);
    expect(logger.error).toHaveBeenCalledOnce();
  });

  it("should return AuthorizationError for a 403 FetchError", () => {
    const originalError = new MockFetchError("Forbidden", createMockResponse(403));
    const processed = processError(originalError);

    expect(processed).toBeInstanceOf(AuthorizationError);
    expect((processed as NetworkError).statusCode).toBe(403);
    // The handler now prefers the default http message
    expect(processed?.message).toBe("Forbidden");
    expect(processed?.cause).toBe(originalError);
    expect(logger.error).toHaveBeenCalledOnce();
  });

  it("should return ValidationError for a 400 FetchError", () => {
    // Consider adding mock body for fieldErrors later if needed
    const originalError = new MockFetchError("Bad Request", createMockResponse(400));
    const processed = processError(originalError);

    expect(processed).toBeInstanceOf(ValidationError);
    expect((processed as NetworkError).statusCode).toBe(400);
    expect(processed?.message).toBe("Bad Request");
    expect(processed?.cause).toBe(originalError);
    expect(logger.error).toHaveBeenCalledOnce();
  });

  it("should return NetworkError for a 500 FetchError", () => {
    const originalError = new MockFetchError("Server Error", createMockResponse(500));
    const processed = processError(originalError);

    expect(processed).toBeInstanceOf(NetworkError);
    expect(processed).not.toBeInstanceOf(NotFoundError); // Ensure it's the base NetworkError
    expect((processed as NetworkError).statusCode).toBe(500);
    expect(processed?.message).toBe("Internal Server Error"); // Prefers default
    expect(processed?.cause).toBe(originalError);
    // Check isOperational is correctly set to false for 500
    expect(processed?.isOperational).toBe(false);
    expect(logger.error).toHaveBeenCalledOnce();
  });

  it("should return AppError (non-operational) for a generic Error", () => {
    const originalError = new Error("Something unexpected happened");
    const processed = processError(originalError);

    expect(processed).toBeInstanceOf(AppError);
    expect(processed).not.toBeInstanceOf(NetworkError);
    expect(processed?.message).toBe("Something unexpected happened");
    expect(processed?.isOperational).toBe(false); // Default for generic errors
    expect(processed?.cause).toBe(originalError);
    expect(logger.error).toHaveBeenCalledOnce();
  });

  it("should return AppError for a thrown string", () => {
    const originalError = "Failed";
    const processed = processError(originalError);

    expect(processed).toBeInstanceOf(AppError);
    expect(processed?.message).toMatch(/Unknown non-error value caught/i);
    expect(processed?.message).toContain(originalError);
    expect(processed?.isOperational).toBe(false);
    // Remove assertion for .cause as it's not set for non-Errors by default
    // expect(processed?.cause).toBe(originalError);
    expect(logger.error).toHaveBeenCalledOnce();
    // Optionally, verify the logging includes the original string
    expect(logger.error).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ originalError: originalError }),
    );
  });

  it("should return AppError for undefined input", () => {
    const originalError = undefined;
    const processed = processError(originalError);

    expect(processed).toBeInstanceOf(AppError);
    expect(processed?.message).toBe(`Unknown non-error value caught: ${originalError}`);
    expect(processed?.isOperational).toBe(false);
    expect(logger.error).toHaveBeenCalledOnce();
    // Optionally, verify the logging includes the original undefined value
    expect(logger.error).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ originalError }),
    );
  });

  it("should return the original AppError if an AppError is passed in", () => {
    const originalError = new DatabaseError("DB connection lost");
    const processed = processError(originalError);

    expect(processed).toBe(originalError); // Should return the same instance
    expect(logger.warn).toHaveBeenCalledOnce(); // Maybe just warn if re-processing?
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining("Attempted to re-process AppError"),
      expect.objectContaining({ originalError }),
    );
    expect(logger.error).not.toHaveBeenCalled(); // No new error log needed
  });
});

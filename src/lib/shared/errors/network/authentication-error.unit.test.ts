// src/lib/errors/network/authentication-error.unit.test.ts
import { describe, it, expect } from "vitest";

import { HttpStatus } from "@/lib/shared/constants";

import { AuthenticationError } from "./authentication-error";

describe("AuthenticationError", () => {
  it("should create an instance with default message and status code", () => {
    const error = new AuthenticationError();
    expect(error).toBeInstanceOf(AuthenticationError);
    expect(error.message).toBe("Unauthorized");
    expect(error.statusCode).toBe(HttpStatus.UNAUTHORIZED.code);
    expect(error.name).toBe("AuthenticationError");
    expect(error.isOperational).toBe(true); // Default for NetworkError
  });

  it("should create an instance with custom message", () => {
    const customMessage = "Credentials required";
    const error = new AuthenticationError(customMessage);
    expect(error.message).toBe(customMessage);
    expect(error.statusCode).toBe(HttpStatus.UNAUTHORIZED.code);
  });

  it("should create an instance with cause", () => {
    const cause = new Error("Original issue");
    const error = new AuthenticationError("Auth failed", { cause });
    expect(error.cause).toBe(cause);
  });

  it("should create an instance and allow setting isOperational to false", () => {
    const error = new AuthenticationError("Auth system down", { isOperational: false });
    expect(error.isOperational).toBe(false);
  });
});

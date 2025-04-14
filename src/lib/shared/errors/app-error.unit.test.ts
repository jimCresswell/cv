import { describe, it, expect } from "vitest";

import { AppError } from "./app-error";

describe("AppError", () => {
  it("should be an instance of Error", () => {
    const error = new AppError("Test message");
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });

  it("should capture the correct message", () => {
    const message = "This is a test error message";
    const error = new AppError(message);
    expect(error.message).toBe(message);
  });

  it("should set the name property to the class name", () => {
    const error = new AppError("Test message");
    expect(error.name).toBe("AppError");
  });

  it("should default isOperational to true", () => {
    const error = new AppError("Test message");
    expect(error.isOperational).toBe(true);
  });

  it("should set isOperational when provided", () => {
    const error = new AppError("Test", { isOperational: false });
    expect(error.isOperational).toBe(false);
  });

  it("should set cause when provided as an Error", () => {
    const cause = new Error("Original cause");
    const error = new AppError("Test", { cause });
    expect(error.cause).toBe(cause);
  });

  it("should not set cause when provided but not an Error", () => {
    const cause = "string cause";
    const error = new AppError("Test", { cause });
    expect(error.cause).toBe(cause);
  });

  it("should capture a stack trace", () => {
    const error = new AppError("Test message");
    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe("string");
    expect(error.stack).toContain("app-error.unit.test.ts");
  });

  it("should correctly use options together", () => {
    const cause = new Error("Underlying issue");
    const error = new AppError("Complex error", {
      isOperational: false,
      cause,
    });
    expect(error.message).toBe("Complex error");
    expect(error.isOperational).toBe(false);
    expect(error.cause).toBe(cause);
  });
});

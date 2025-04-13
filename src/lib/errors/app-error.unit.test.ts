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

  it("should handle optional statusCode", () => {
    const errorWithCode = new AppError("Test", { statusCode: 400 });
    const errorWithoutCode = new AppError("Test");

    expect(errorWithCode.statusCode).toBe(400);
    expect(errorWithoutCode.statusCode).toBeUndefined();
  });

  it("should default isOperational to true", () => {
    const error = new AppError("Test");
    expect(error.isOperational).toBe(true);
  });

  it("should set isOperational when provided", () => {
    const errorTrue = new AppError("Test", { isOperational: true });
    const errorFalse = new AppError("Test", { isOperational: false });

    expect(errorTrue.isOperational).toBe(true);
    expect(errorFalse.isOperational).toBe(false);
  });

  it("should set cause when provided as an Error", () => {
    const originalCause = new Error("Original cause");
    const error = new AppError("Test", { cause: originalCause });
    expect(error.cause).toBe(originalCause);
  });

  it("should not set cause when provided but not an Error", () => {
    const nonErrorCause = "this is not an error object";
    const error = new AppError("Test", { cause: nonErrorCause });
    expect(error.cause).toBeUndefined();
  });

  it("should capture a stack trace", () => {
    const error = new AppError("Test");
    expect(error.stack).toBeDefined();
    // Check if the stack trace includes the class name (basic check)
    expect(error.stack).toContain("AppError");
  });

  it("should correctly use all options together", () => {
    const message = "Combined options test";
    const statusCode = 418; // I'm a teapot
    const isOperational = false;
    const cause = new Error("Underlying issue");
    const error = new AppError(message, { statusCode, isOperational, cause });

    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(statusCode);
    expect(error.isOperational).toBe(isOperational);
    expect(error.cause).toBe(cause);
    expect(error.name).toBe("AppError");
    expect(error.stack).toBeDefined();
  });
});

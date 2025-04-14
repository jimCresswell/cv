import { describe, it, expect } from "vitest";

import { AppError } from "../app-error";

import { ValidationError } from "./validation-error";

describe("ValidationError", () => {
  it("should be an instance of Error, AppError, and ValidationError", () => {
    const error = new ValidationError();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(ValidationError);
  });

  it("should have the correct name", () => {
    const error = new ValidationError();
    expect(error.name).toBe("ValidationError");
  });

  it('should have the default message "Validation failed" if no message is provided', () => {
    const error = new ValidationError();
    expect(error.message).toBe("Validation failed");
  });

  it("should accept a custom message", () => {
    const customMessage = "Invalid email format";
    const error = new ValidationError(customMessage);
    expect(error.message).toBe(customMessage);
  });

  it("should have statusCode 400", () => {
    const error = new ValidationError();
    expect(error.statusCode).toBe(400);
  });

  it("should be an operational error", () => {
    const error = new ValidationError();
    expect(error.isOperational).toBe(true);
  });

  it("should accept a cause", () => {
    const cause = new Error("Underlying parser error");
    const error = new ValidationError("Parsing failed", { cause });
    expect(error.cause).toBe(cause);
  });

  it("should accept optional fieldErrors", () => {
    const fieldErrors = { email: ["must be a valid email"] };
    const error = new ValidationError("Invalid input", { fieldErrors });
    expect(error.fieldErrors).toEqual(fieldErrors);
  });

  it("should have undefined fieldErrors if not provided", () => {
    const error = new ValidationError();
    expect(error.fieldErrors).toBeUndefined();
  });
});

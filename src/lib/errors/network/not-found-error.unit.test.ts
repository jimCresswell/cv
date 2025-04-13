import { describe, it, expect } from "vitest";

import { AppError } from "../app-error";

import { NotFoundError } from "./not-found-error";

describe("NotFoundError", () => {
  it("should be an instance of Error, AppError, and NotFoundError", () => {
    const error = new NotFoundError();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(NotFoundError);
  });

  it("should have the correct name", () => {
    const error = new NotFoundError();
    expect(error.name).toBe("NotFoundError");
  });

  it('should have the default message "Resource not found" if no message is provided', () => {
    const error = new NotFoundError();
    expect(error.message).toBe("Resource not found");
  });

  it("should accept a custom message", () => {
    const customMessage = "User profile with ID 123 not found";
    const error = new NotFoundError(customMessage);
    expect(error.message).toBe(customMessage);
  });

  it("should have statusCode 404", () => {
    const error = new NotFoundError();
    expect(error.statusCode).toBe(404);
  });

  it("should be an operational error", () => {
    const error = new NotFoundError();
    expect(error.isOperational).toBe(true);
  });

  it("should accept a cause", () => {
    const cause = new Error("Query returned no results");
    const error = new NotFoundError("No results found", cause);
    expect(error.cause).toBe(cause);
  });
});

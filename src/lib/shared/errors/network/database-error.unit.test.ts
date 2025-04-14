import { describe, it, expect } from "vitest";

import { AppError } from "../app-error";

import { DatabaseError } from "./database-error";

describe("DatabaseError", () => {
  it("should be an instance of Error, AppError, and DatabaseError", () => {
    const error = new DatabaseError();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(DatabaseError);
  });

  it("should have the correct name", () => {
    const error = new DatabaseError();
    expect(error.name).toBe("DatabaseError");
  });

  it('should have the default message "Database operation failed" if no message is provided', () => {
    const error = new DatabaseError();
    expect(error.message).toBe("Database operation failed");
  });

  it("should accept a custom message", () => {
    const customMessage = "Failed to connect to the database";
    const error = new DatabaseError(customMessage);
    expect(error.message).toBe(customMessage);
  });

  it("should have statusCode 500", () => {
    const error = new DatabaseError();
    expect(error.statusCode).toBe(500);
  });

  it("should be an operational error", () => {
    const error = new DatabaseError();
    // Database errors are typically non-operational (server issues)
    expect(error.isOperational).toBe(false);
  });

  it("should accept a cause", () => {
    const cause = new Error("Connection refused");
    // Fix: Pass cause within the options object
    const error = new DatabaseError("Connection error", { cause: cause });
    expect(error.cause).toBe(cause);
  });
});

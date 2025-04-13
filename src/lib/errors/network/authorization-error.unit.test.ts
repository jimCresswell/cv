import { describe, it, expect } from "vitest";

import { AppError } from "../app-error";

import { AuthorizationError } from "./authorization-error";

describe("AuthorizationError", () => {
  it("should be an instance of Error, AppError, and AuthorizationError", () => {
    const error = new AuthorizationError();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(AuthorizationError);
  });

  it("should have the correct name", () => {
    const error = new AuthorizationError();
    expect(error.name).toBe("AuthorizationError");
  });

  it('should have the default message "Permission denied" if no message is provided', () => {
    const error = new AuthorizationError();
    expect(error.message).toBe("Permission denied");
  });

  it("should accept a custom message", () => {
    const customMessage = "User does not have admin rights";
    const error = new AuthorizationError(customMessage);
    expect(error.message).toBe(customMessage);
  });

  it("should have statusCode 403", () => {
    const error = new AuthorizationError();
    expect(error.statusCode).toBe(403);
  });

  it("should be an operational error", () => {
    const error = new AuthorizationError();
    expect(error.isOperational).toBe(true);
  });

  it("should accept a cause", () => {
    const cause = new Error("Original reason");
    const error = new AuthorizationError("Failed", cause);
    expect(error.cause).toBe(cause);
  });
});

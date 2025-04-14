import http from "node:http";

import { describe, it, expect } from "vitest";

import { AppError } from "../app-error";

import { AuthorizationError } from "./authorization-error";
import { NetworkError } from "./network-error";

describe("AuthorizationError", () => {
  it("should be an instance of Error, AppError, NetworkError and AuthorizationError", () => {
    const error = new AuthorizationError();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(NetworkError);
    expect(error).toBeInstanceOf(AuthorizationError);
  });

  it("should have the correct name", () => {
    const error = new AuthorizationError();
    expect(error.name).toBe("AuthorizationError");
  });

  it("should have the correct statusCode (403)", () => {
    const error = new AuthorizationError();
    expect(error.statusCode).toBe(403);
  });

  it("should have the default message 'Forbidden' if none provided", () => {
    const error = new AuthorizationError();
    expect(error.message).toBe(http.STATUS_CODES[403]);
  });

  it("should use the provided message when given", () => {
    const customMessage = "You shall not pass!";
    const error = new AuthorizationError(customMessage);
    expect(error.message).toBe(customMessage);
  });

  it("should accept a cause", () => {
    const cause = new Error("Original reason for denial");
    const error = new AuthorizationError(undefined, { cause });
    expect(error.cause).toBe(cause);
  });

  it("should have isOperational set to true by default", () => {
    const error = new AuthorizationError();
    expect(error.isOperational).toBe(true);
  });
});

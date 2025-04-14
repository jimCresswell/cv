// src/lib/errors/network/network-error.unit.test.ts
import http from "node:http"; // Node built-in

import { describe, it, expect } from "vitest"; // External package

import { AppError } from "../app-error"; // Project files

import { NetworkError } from "./network-error";

describe("NetworkError", () => {
  it("should be an instance of Error, AppError, and NetworkError", () => {
    const error = new NetworkError(500);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(NetworkError);
  });

  it("should set the correct statusCode", () => {
    const error = new NetworkError(404);
    expect(error.statusCode).toBe(404);
  });

  it("should set the message from http.STATUS_CODES if not provided", () => {
    const error = new NetworkError(403);
    expect(error.message).toBe(http.STATUS_CODES[403]); // "Forbidden"
  });

  it("should use the provided message when given", () => {
    const customMessage = "Custom specific error";
    const error = new NetworkError(500, customMessage);
    expect(error.message).toBe(customMessage);
  });

  it("should fallback to 'Unknown Network Error' for invalid status codes", () => {
    const error = new NetworkError(999); // Invalid status code
    expect(error.message).toBe("Unknown Network Error");
  });

  it("should set the name property correctly", () => {
    const error = new NetworkError(501);
    expect(error.name).toBe("NetworkError");
  });

  // Tests inherited properties from AppError
  it("should default isOperational to true", () => {
    const error = new NetworkError(500);
    expect(error.isOperational).toBe(true);
  });

  it("should set isOperational when provided", () => {
    const error = new NetworkError(500, undefined, { isOperational: false });
    expect(error.isOperational).toBe(false);
  });

  it("should accept a cause", () => {
    const cause = new Error("Underlying issue");
    const error = new NetworkError(500, undefined, { cause });
    expect(error.cause).toBe(cause);
  });
});

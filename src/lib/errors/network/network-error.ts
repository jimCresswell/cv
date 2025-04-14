// src/lib/errors/network/network-error.ts
import http from "node:http";

import { AppError, type AppErrorOptions } from "../app-error";

/**
 * Base class for network-related errors that map to HTTP status codes.
 * Uses standard HTTP status codes and messages by default.
 */
export interface NetworkErrorOptions extends AppErrorOptions {
  statusCode?: number; // Allow overriding statusCode via options if needed
}

export class NetworkError extends AppError {
  public readonly statusCode: number;

  constructor(statusCode: number, message?: string, options?: NetworkErrorOptions) {
    // Determine the final message: use provided message, or lookup standard HTTP message, or fallback
    const finalMessage = message ?? http.STATUS_CODES[statusCode] ?? "Unknown Network Error";

    // Call the AppError constructor
    super(finalMessage, options);

    // Assign the status code
    this.statusCode = statusCode;

    // Ensure the name is set correctly for this class
    this.name = this.constructor.name;

    // Re-capture stack trace if necessary, pointing to this constructor
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

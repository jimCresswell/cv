// src/lib/errors/network/network-error.ts
import { getHttpMessageForCode } from "@/lib/shared/constants";

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
    let finalMessage: string;
    if (message) {
      finalMessage = message;
    } else {
      try {
        finalMessage = getHttpMessageForCode(statusCode);
      } catch {
        // If the status code is unknown and no message was provided, use a fallback
        finalMessage = `Unknown Network Error with status code ${statusCode}`;
        // Optionally log the original error for debugging purposes
        // console.error(`NetworkError: Failed to get message for status code ${statusCode}`);
      }
    }

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

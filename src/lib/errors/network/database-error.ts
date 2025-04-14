import { HttpStatus } from "@/lib/constants";

import { NetworkError } from "./network-error";

/**
 * Represents a database-related error (e.g., connection issues, query failures).
 */
export class DatabaseError extends NetworkError {
  constructor(
    // Use specific default message
    message = "Database operation failed",
    options?: { cause?: Error | unknown; isOperational?: boolean },
  ) {
    // Pass the specific message and explicitly default isOperational to false
    super(HttpStatus.INTERNAL_SERVER_ERROR, message, {
      ...options, // Spread existing options first
      isOperational: options?.isOperational ?? false, // Default to false
    });
    this.name = "DatabaseError";
  }
}

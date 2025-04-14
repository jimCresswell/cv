import { HttpStatus } from "@/lib/constants";

import { NetworkError } from "./network-error";

/**
 * Represents an error when a requested resource is not found (HTTP 404).
 */
export class NotFoundError extends NetworkError {
  constructor(
    // Use specific default message
    message = "Resource not found",
    options?: { cause?: Error | unknown; isOperational?: boolean },
  ) {
    // Pass the specific message to super.
    // NetworkError correctly defaults isOperational to true for 404.
    super(HttpStatus.NOT_FOUND, message, options);
    this.name = "NotFoundError";
  }
}

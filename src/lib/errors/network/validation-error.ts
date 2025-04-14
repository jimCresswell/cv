import { HttpStatus } from "@/lib/constants";
import type { FieldErrorDetail } from "@/lib/types";

import { NetworkError } from "./network-error";

/**
 * Represents an error due to invalid input data (HTTP 400).
 * Can optionally contain detailed field errors.
 */
export class ValidationError extends NetworkError {
  public readonly fieldErrors?: FieldErrorDetail;

  constructor(
    // Use specific default message
    message = "Validation failed",
    options?: {
      cause?: Error | unknown;
      fieldErrors?: FieldErrorDetail;
      isOperational?: boolean;
    },
  ) {
    // Pass the specific message to super.
    // NetworkError correctly defaults isOperational to true for 400.
    super(HttpStatus.BAD_REQUEST, message, options);
    this.name = "ValidationError";
    this.fieldErrors = options?.fieldErrors;
  }
}

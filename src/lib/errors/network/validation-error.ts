import { AppError } from "../app-error";

export class ValidationError extends AppError {
  public readonly details?: unknown; // Optional: To hold Zod error details, etc.

  constructor(
    message = "Validation failed", // Corrected default message
    options?: {
      cause?: Error | unknown;
      details?: unknown;
      isOperational?: boolean; // Allow overriding operational status if needed
    },
  ) {
    // Pass message and relevant options (excluding details) to AppError
    super(message, {
      statusCode: 400,
      cause: options?.cause,
      isOperational: options?.isOperational ?? true,
    });
    this.details = options?.details; // Assign details from options
  }
}

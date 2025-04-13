/**
 * Base class for custom application errors.
 * Allows distinguishing operational errors from programmer errors.
 * Supports error codes and the standard 'cause' property.
 */
export class AppError extends Error {
  public readonly statusCode?: number;
  public readonly isOperational;

  constructor(
    message: string,
    options?: {
      statusCode?: number;
      isOperational?: boolean;
      cause?: Error | unknown;
    },
  ) {
    super(message, { cause: options?.cause instanceof Error ? options.cause : undefined });
    this.name = this.constructor.name; // Ensure correct error name
    this.statusCode = options?.statusCode;
    this.isOperational = options?.isOperational ?? true;

    // Capture stack trace, excluding constructor call from it
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

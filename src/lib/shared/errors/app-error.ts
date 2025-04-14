/**
 * Represents the options that can be passed to the AppError constructor.
 */
export interface AppErrorOptions {
  /**
   * The original error or value that caused this error.
   * Useful for preserving the error chain.
   */
  cause?: unknown;
  /**
   * Indicates whether the error is operational (expected, like user input validation)
   * or programmatic (unexpected bug).
   * Defaults to true for base AppError, subclasses might override.
   */
  isOperational?: boolean;
}

/**
 * Base class for custom application errors.
 * Allows distinguishing operational errors from programmer errors.
 * Supports the standard 'cause' property.
 */
export class AppError extends Error {
  public readonly isOperational: boolean;
  public readonly cause?: unknown;

  constructor(message: string, options?: AppErrorOptions) {
    super(message, { cause: options?.cause instanceof Error ? options.cause : undefined });
    this.name = this.constructor.name; // Ensure correct error name
    this.isOperational = options?.isOperational ?? true;
    this.cause = options?.cause;

    // Capture stack trace, excluding constructor call from it
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

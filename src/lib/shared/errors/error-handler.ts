import { getHttpMessageForCode } from "../constants";
import { logger } from "../logging";

import { AppError } from "./app-error";
import { AuthenticationError } from "./network/authentication-error";
import { AuthorizationError } from "./network/authorization-error";
import { NetworkError } from "./network/network-error";
import { NotFoundError } from "./network/not-found-error";
import { ValidationError } from "./network/validation-error";

/**
 * Checks if the error object resembles a Fetch API Response error.
 * This is a basic check; real-world Fetch errors might differ slightly
 * depending on the environment or libraries used.
 */
function isFetchError(
  error: unknown,
): error is Error & { response: Response & { status: number } } {
  return (
    error instanceof Error &&
    typeof error === "object" &&
    "response" in error &&
    typeof (error as { response: unknown }).response === "object" &&
    (error as { response: unknown }).response !== null &&
    "status" in (error as { response: object }).response &&
    typeof (error as { response: { status: unknown } }).response.status === "number"
  );
}

/**
 * Processes an unknown caught value (error or otherwise), attempts to map it
 * to a known AppError type, logs it, and returns the AppError instance.
 *
 * @param originalError - The value caught in a catch block.
 * @returns An instance of AppError or one of its subclasses.
 */
export function processError(originalError: unknown): AppError {
  let processedError: AppError;

  if (originalError instanceof AppError) {
    logger.warn("Attempted to re-process AppError", { originalError });
    return originalError;
  }

  if (isFetchError(originalError)) {
    const { status } = originalError.response;
    const message = getHttpMessageForCode(status) || originalError.message || "Network Error";

    switch (status) {
      case 400: {
        processedError = new ValidationError(message, { cause: originalError });
        break;
      }
      case 401: {
        processedError = new AuthenticationError(message, { cause: originalError });
        break;
      }
      case 403: {
        processedError = new AuthorizationError(message, { cause: originalError });
        break;
      }
      case 404: {
        processedError = new NotFoundError(message, { cause: originalError });
        break;
      }
      default: {
        // Explicitly set isOperational: false for 500+ errors
        const isOperational = status < 500;
        processedError = new NetworkError(status, message, { cause: originalError, isOperational });
        break;
      }
    }
  } else if (originalError instanceof Error) {
    processedError = new AppError(originalError.message, {
      cause: originalError,
      isOperational: false,
    });
  } else {
    const message = `Unknown non-error value caught: ${String(originalError)}`;
    processedError = new AppError(message, {
      cause: originalError,
      isOperational: false,
    });
  }

  logger.error(`Processed error: ${processedError.name} - ${processedError.message}`, {
    originalError: originalError,
    processedError: {
      name: processedError.name,
      message: processedError.message,
      isOperational: processedError.isOperational,
      statusCode: (processedError as NetworkError).statusCode,
      stack: processedError.stack,
    },
  });

  return processedError;
}

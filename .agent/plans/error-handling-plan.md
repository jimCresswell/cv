# Plan: Error Handling Foundations

**1. Goal:**

Establish foundational error handling mechanisms for the `@jimcresswell/personal-site` project using the existing **Winston** logging library. This includes structured logging, custom error types, and root-level UI error catching, providing a solid base before implementing features like API routes or complex UI components. This plan aligns with the principles defined in `../best-practices.md`.

**2. Implementation Order Context:**

This plan represents the **first** major implementation phase, followed by the Design System and then Structured Data Handling.

**3. Prerequisites:**

*   Existing Next.js project structure.
*   `pnpm` package manager.
*   `winston` already installed (`package.json`).
*   `../best-practices.md` document (specifically the Error Handling section).

**4. Implementation Steps:**

*   **Step 1: Configure Winston Logging Utility**
    *   **Action:** Create `src/lib/logging.ts`.
    *   **Content (`src/lib/logging.ts`):**
        ```typescript
        import winston from 'winston';

        const { combine, timestamp, json, printf, colorize, errors } = winston.format;

        const logLevel = process.env.LOG_LEVEL || 'info';

        // Custom format for development console: timestamp, level, message, stack trace
        const devFormat = combine(
          colorize(),
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          errors({ stack: true }), // Include stack trace
          printf(({ timestamp, level, message, stack }) => {
            let log = `${timestamp} ${level}: ${message}`;
            if (stack) {
              // Append stack trace on a new line if it exists
              log += `\n${stack}`;
            }
            return log;
          })
        );

        // Standard JSON format for production/other environments
        const prodFormat = combine(
          timestamp(),
          errors({ stack: true }), // Include stack trace in the JSON
          json() // Output as JSON
        );

        const transport = process.env.NODE_ENV === 'development'
          ? new winston.transports.Console({ format: devFormat })
          : new winston.transports.Console({ format: prodFormat }); // Default to JSON console

        export const logger = winston.createLogger({
          level: logLevel,
          format: combine(
              errors({ stack: true }), // Ensure stack traces are captured early
              timestamp(),
              json() // Default base format, transports can override
          ),
          transports: [transport],
          exitOnError: false, // Do not exit on handled exceptions
        });

        logger.info(`Logger initialized with level: ${logLevel} in ${process.env.NODE_ENV} mode`);

        // Example usage (can be removed later):
        // logger.debug('This is a debug message');
        // logger.info('This is an info message');
        // try {
        //   throw new Error('Something went wrong!');
        // } catch (e) {
        //   logger.error('Caught an error', { error: e }); // Log error object with stack
        // }
        ```
    *   **Action:** Add `LOG_LEVEL` to `.env.development` (e.g., `LOG_LEVEL=debug`) and ensure it's mentioned in environment variable requirements.
    *   **Rationale:** Uses existing Winston library, provides structured JSON logging in production and readable console logs in development, includes stack traces.

*   **Step 2: Define Custom Error Types**
    *   **Action:** Create base application error `src/lib/errors/AppError.ts`.
    *   **Content (`src/lib/errors/AppError.ts`):**
        ```typescript
        /**
         * Base class for custom application errors.
         * Allows distinguishing operational errors from programmer errors.
         * Supports error codes and the standard 'cause' property.
         */
        export class AppError extends Error {
          public readonly statusCode: number;
          public readonly isOperational: boolean;

          constructor(
            message: string,
            statusCode: number = 500, // Default to Internal Server Error
            isOperational: boolean = true, // Assume operational unless specified
            cause?: Error | unknown
          ) {
            super(message, { cause: cause instanceof Error ? cause : undefined });
            this.name = this.constructor.name; // Ensure correct error name
            this.statusCode = statusCode;
            this.isOperational = isOperational;

            // Capture stack trace, excluding constructor call from it
            if (Error.captureStackTrace) {
              Error.captureStackTrace(this, this.constructor);
            }
          }
        }
        ```
    *   **Action:** Create specific error types extending `AppError` in `src/lib/errors/`:
        *   `ValidationError.ts` (e.g., `statusCode: 400`)
        *   `NotFoundError.ts` (e.g., `statusCode: 404`)
        *   `AuthorizationError.ts` (e.g., `statusCode: 401` or `403`)
        *   `DatabaseError.ts` (e.g., `statusCode: 500`, potentially wrapping Prisma errors)
    *   **Example (`src/lib/errors/ValidationError.ts`):**
        ```typescript
        import { AppError } from './AppError';

        export class ValidationError extends AppError {
          public readonly details?: unknown; // Optional: To hold Zod error details, etc.

          constructor(message: string = 'Invalid input data', details?: unknown, cause?: Error | unknown) {
            super(message, 400, true, cause); // 400 Bad Request
            this.details = details;
          }
        }
        ```
    *   **(Implement similar structures for `NotFoundError`, `AuthorizationError`, `DatabaseError`)**
    *   **Rationale:** Aligns with using specific error types, preserving context (`cause`), and distinguishing error sources.

*   **Step 3: Implement Root Error Boundary (Client-Side)**
    *   **Action:** Create `src/components/error-handling/ErrorBoundary.tsx`.
    *   **Content (`src/components/error-handling/ErrorBoundary.tsx`):**
        ```typescript
        'use client'; // This component must be a Client Component

        import React, { Component, ErrorInfo, ReactNode } from 'react';
        import { logger } from '@/lib/logging'; // Use our Winston logger

        interface Props {
          children: ReactNode;
          fallback?: ReactNode; // Optional custom fallback UI
        }

        interface State {
          hasError: boolean;
          error: Error | null;
        }

        // Default fallback UI (simple version)
        const DefaultFallback = () => (
          <div className="p-4 text-center text-red-600 border border-red-300 rounded-md bg-red-50">
            <h2>Something went wrong.</h2>
            <p>We've been notified and are looking into it. Please try refreshing the page.</p>
          </div>
        );

        class ErrorBoundary extends Component<Props, State> {
          public state: State = {
            hasError: false,
            error: null,
          };

          public static getDerivedStateFromError(error: Error): State {
            // Update state so the next render will show the fallback UI.
            return { hasError: true, error };
          }

          public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
            // Log the error using our Winston logger
            // Pass the error object directly, Winston's 'errors' format handles the stack.
            logger.error('ErrorBoundary caught an error:', {
                // Include component stack separately if desired
                componentStack: errorInfo.componentStack,
                // Log the error object itself for Winston to handle
                error: error
            });
            // Note: Winston will automatically include stack from the error object if configured.
            // TODO: Integrate with Sentry or similar service here in the future
            // Sentry.captureException(error, { extra: { errorInfo } });
          }

          public render() {
            if (this.state.hasError) {
              // You can render any custom fallback UI
              return this.props.fallback || <DefaultFallback />;
            }

            return this.props.children;
          }
        }

        export default ErrorBoundary;
        ```
    *   **Action:** Wrap the `children` in `src/app/layout.tsx` with this `<ErrorBoundary>`.
    *   **Example (`src/app/layout.tsx` modification):**
        ```typescript
        import ErrorBoundary from '@/components/error-handling/ErrorBoundary';
        // ... other imports

        export default function RootLayout({ children }: { children: React.ReactNode }) {
          return (
            <html lang="en">
              <body>
                {/* Wrap main content area */}
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </body>
            </html>
          );
        }
        ```
    *   **Rationale:** Implements React best practice for catching client-side rendering errors, provides fallback UI, logs errors using Winston.

*   **Step 4: Implement `global-error.tsx` (App Router Production Catch-all)**
    *   **Action:** Create `src/app/global-error.tsx`.
    *   **Content (`src/app/global-error.tsx`):**
        ```typescript
        'use client'; // global-error must be a Client Component

        import { useEffect } from 'react';
        import { logger } from '@/lib/logging'; // Use Winston logger

        export default function GlobalError({
          error,
          reset,
        }: {
          error: Error & { digest?: string }; // digest is added by Next.js for server errors
          reset: () => void; // Function to attempt recovery
        }) {
          useEffect(() => {
            // Log the error using our Winston logger
            // Pass the error object directly
            logger.error('GlobalError caught an error:', {
                digest: error.digest, // Include digest if available
                // Log the error object itself
                error: error
            });
            // TODO: Integrate with Sentry or similar service here
            // Sentry.captureException(error);
          }, [error]);

          return (
            <html>
              <body>
                <div className="p-4 text-center text-red-600 border border-red-300 rounded-md bg-red-50">
                  <h2>Something went wrong!</h2>
                  <p>An unexpected error occurred. We've logged the issue.</p>
                  <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={
                      // Attempt to recover by trying to re-render the segment
                      () => reset()
                    }
                  >
                    Try again
                  </button>
                </div>
              </body>
            </html>
          );
        }
        ```
    *   **Rationale:** Provides a production-only root error UI for errors not caught by specific Error Boundaries, aligning with Next.js App Router conventions and logging via Winston.

*   **Step 5: Plan for API Error Handling (Documentation within this plan)**
    *   API routes (when created later) **will**:
        *   Use `try...catch` blocks.
        *   Catch specific errors (e.g., `ValidationError`, `DatabaseError`).
        *   Log errors server-side using the Winston `logger`.
        *   Translate caught `AppError` instances (or other errors) into appropriate HTTP status codes and JSON responses.
        *   Avoid leaking sensitive details in production responses.
        *   Utilize the custom error types.

*   **Step 6: Plan for Observability Integration (Documentation within this plan)**
    *   Future integration with a service like Sentry **will** involve:
        *   Initializing the Sentry SDK.
        *   Capturing exceptions within `ErrorBoundary` (`componentDidCatch`) and `global-error.tsx` (`useEffect`).
        *   Potentially using Winston transports for Sentry (e.g., `winston-sentry-log`) or directly calling `Sentry.captureException`.
        *   Configuring Sentry source maps.

**5. Deliverable:**

*   This plan file (`.agent/plans/error-handling-plan.md`).
*   Code files and directories created in Steps 1-4 (using Winston).

**6. Next Steps:**

*   Begin implementation starting with Step 1: Configure Winston Logging Utility.

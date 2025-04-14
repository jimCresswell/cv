# Plan: Error Handling Foundations COMPLETE

**1. Goal:**

Establish foundational error handling mechanisms for the `@jimcresswell/personal-site` project using the existing **Winston** logging library. This includes structured logging, custom error types, and root-level UI error catching, providing a solid base before implementing features like API routes or complex UI components. This plan aligns with the principles defined in `../best-practices.md`.

**2. Implementation Order Context:**

This plan represents the **first** major implementation phase, followed by the Design System and then Structured Data Handling.

**3. Prerequisites:**

- Existing Next.js project structure.
- `pnpm` package manager.
- `winston` already installed (`package.json`).
- `../best-practices.md` document (specifically the Error Handling section).

**4. Implementation Steps:**

- **Step 1: Configure Winston Logging Utility (Code Implemented)**

  - **Action:** Create `src/lib/logging.ts`.
  - **Content (`src/lib/logging.ts`):**

    ```typescript
    import winston from "winston";

    const { combine, timestamp, json, printf, colorize, errors } = winston.format;

    const logLevel = process.env.LOG_LEVEL || "info";

    // Custom format for development console: timestamp, level, message, stack trace
    const devFormat = combine(
      colorize(),
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      errors({ stack: true }), // Include stack trace
      printf(({ timestamp, level, message, stack }) => {
        let log = `${timestamp} ${level}: ${message}`;
        if (stack) {
          // Append stack trace on a new line if it exists
          log += `\n${stack}`;
        }
        return log;
      }),
    );

    // Standard JSON format for production/other environments
    const prodFormat = combine(
      timestamp(),
      errors({ stack: true }), // Include stack trace in the JSON
      json(), // Output as JSON
    );

    const transport =
      process.env.NODE_ENV === "development"
        ? new winston.transports.Console({ format: devFormat })
        : new winston.transports.Console({ format: prodFormat }); // Default to JSON console

    export const logger = winston.createLogger({
      level: logLevel,
      format: combine(
        errors({ stack: true }), // Ensure stack traces are captured early
        timestamp(),
        json(), // Default base format, transports can override
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

  - **Action:** Add `LOG_LEVEL` to `.env.development` (e.g., `LOG_LEVEL=debug`) and ensure it's mentioned in environment variable requirements.
  - **Rationale:** Uses existing Winston library, provides structured JSON logging in production and readable console logs in development, includes stack traces.

- **Step 2: Define Custom Error Types (Code Implemented, Tests Implemented)**

  - **Action:** Create base application error `src/lib/errors/app-error.ts`.
  - **(Update)**: The `AppError` constructor and subsequently all subclasses were refactored to accept an `options` object for `statusCode`, `isOperational`, and `cause` for better readability and flexibility.
  - **(Note)**: Filenames were initially created using PascalCase (e.g., `AppError.ts`). For future consistency, follow the project's preference for kebab-case (e.g., `app-error.ts`), although existing files haven't been renamed yet.
  - \*\*Content (`src/lib/errors/app-error.ts` - Post-Refactor Example Structure):

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
        options: {
          statusCode?: number;
          isOperational?: boolean;
          cause?: Error | unknown;
        } = {},
      ) {
        super(message, { cause: options.cause instanceof Error ? options.cause : undefined });
        this.name = this.constructor.name; // Ensure correct error name
        this.statusCode = options.statusCode || 500; // Default to Internal Server Error
        this.isOperational = options.isOperational !== undefined ? options.isOperational : true; // Assume operational unless specified

        // Capture stack trace, excluding constructor call from it
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        }
      }
    }
    ```

  - **Action:** Create specific error types extending `AppError` in `src/lib/errors/`:
    - `ValidationError.ts` (e.g., `statusCode: 400`)
    - `NotFoundError.ts` (e.g., `statusCode: 404`)
    - `AuthorizationError.ts` (e.g., `statusCode: 401` or `403`)
    - `DatabaseError.ts` (e.g., `statusCode: 500`, potentially wrapping Prisma errors)
  - \*\*Example (`src/lib/errors/validation-error.ts`):

    ```typescript
    import { AppError } from "./app-error";

    export class ValidationError extends AppError {
      public readonly details?: unknown; // Optional: To hold Zod error details, etc.

      constructor(
        message: string = "Invalid input data",
        details?: unknown,
        options?: {
          cause?: Error | unknown;
        },
      ) {
        super(message, { statusCode: 400, cause: options?.cause }); // 400 Bad Request
        this.details = details;
      }
    }
    ```

  - **(Implement similar structures for `NotFoundError`, `AuthorizationError`, `DatabaseError`)**
  - **Rationale:** Aligns with using specific error types, preserving context (`cause`), and distinguishing error sources.

- **Step 3: Implement Root Error Boundary (Client-Side) (Code Implemented, Tests Implemented)**

  - **Action:** Create `src/components/error-handling/error-boundary.tsx`.
  - **(Update)**: Unit tests have been created and passed (`src/components/error-handling/error-boundary.unit.test.tsx`).
  - **(Update)**: This `ErrorBoundary` has been integrated into the root layout (`src/app/layout.tsx`) to wrap the main content.
  - \*\*Content (`src/components/error-handling/error-boundary.tsx`):

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
        <p>We have been notified and are looking into it. Please try refreshing the page.</p>
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

  - **Action:** Wrap the `children` in `src/app/layout.tsx` with this `<ErrorBoundary>`.
  - \*\*Example (`src/app/layout.tsx` modification):

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

  - **Rationale:** Implements React best practice for catching client-side rendering errors, provides fallback UI, logs errors using Winston.

- **Step 4: Implement `global-error.tsx` (App Router Production Catch-all) (Code Implemented, Tests Implemented)**

  - **Action:** Create `src/app/global-error.tsx`.
  - **(Update)**: Implemented `global-error.tsx` to catch unhandled errors, log them using the configured Winston logger, and render a fallback UI.
  - **(Update)**: Refactored the fallback UI into a separate component `src/components/error-handling/global-error-fallback.tsx` for better modularity and testability.
  - **(Update)**: Created/updated tests (`src/app/global-error.test.tsx`, `src/components/error-handling/global-error-fallback.test.tsx`) which are passing.
  - **Content (`src/app/global-error.tsx` - Updated):**

    ```typescript
    'use client'; // Required for error components

    import React, { useEffect } from 'react';
    import { logger } from '@/lib/logging';
    import GlobalErrorFallback from '@/components/error-handling/global-error-fallback'; // Import the separated fallback

    interface GlobalErrorProps {
      error: Error & { digest?: string }; // digest is added by Next.js for server errors
      reset: () => void; // Function to attempt recovery
    }

    export default function GlobalError({ error, reset }: GlobalErrorProps) {
      useEffect(() => {
        // Log the error including the digest if available
        logger.error('Unhandled error caught by global-error boundary:', {
            error: error, // Log the full error object (Winston handles stack)
            digest: error.digest,
        });
      }, [error]); // Log whenever the error changes

      return (
        <html lang="en">
          <body>
            {/* Render the separated fallback UI component */}
            <GlobalErrorFallback reset={reset} />
          </body>
        </html>
      );
    }

    ```

  - **Rationale:** Provides a user-friendly fallback for production errors caught by the App Router, ensuring errors are logged for debugging. Separation improves component structure.

**5. Testing:**

- **Action:** Create unit tests for custom errors (`*.test.ts` in `src/lib/errors/`). (Completed)
- **Action:** Create unit/integration tests for `ErrorBoundary` (`error-boundary.unit.test.tsx`). (Completed)
- **Action:** Create unit/integration tests for `global-error.tsx` (`global-error.test.tsx`). (Completed)
- **Action:** Create unit tests for `GlobalErrorFallback` (`global-error-fallback.test.tsx`). (Completed)
- **Rationale:** Ensure error classes behave correctly, and boundary components log errors and render fallbacks as expected.

**6. Next Steps:**

- **Add Tests (TDD):** Write unit/integration tests for the custom error classes (`app-error.ts` and derivatives) and the `error-boundary.tsx` component. **This must be the immediate next step and follow TDD.**
- **Leverage Next.js `app` Router Error Files:** Explore using `error.tsx` and `not-found.tsx` for more granular, segment-level error handling.
  - **Implement `not-found.tsx` for handling 404 errors specifically.**
  - **Refine the visual appearance and content of fallback UIs.**

**7. Status & Refinements (As of 2025-04-13):**

- **Code Implementation Completed:** Steps 1, 2, 3, and 4 have been implemented.
  - Winston logger configured in `src/lib/logging.ts`.
  - Custom error classes created in `src/lib/errors/`.
  - Root client-side `error-boundary.tsx` created and integrated.
  - `global-error.tsx` implemented for App Router catch-all.
  - Files renamed to kebab-case and imports updated.
- **Refinements Completed:**
  - The base `app-error.ts` class now uses an optional `statusCode` and an options object constructor for flexibility.
  - Derived error classes updated accordingly.

**8. TDD Adherence & Retrospective:**

- **TDD Requirement:** As per `../best-practices.md`, Test-Driven Development (TDD) is mandatory for this project.
- **Retrospective:** While the _code_ for the custom error classes (Step 2) and the `ErrorBoundary` component (Step 3) has been implemented, the corresponding tests were _not_ written beforehand as required by TDD.
- **Correction:** Going forward, TDD **must** be strictly adhered to. This includes the immediate next step: writing tests for the already implemented error handling components.

**9. Future Enhancements / Next Steps (Prioritized):**

- **1. API Error Handling Strategy:** Define and implement error handling for API routes (when created).
- **2. External Service Integration:** Plan for and implement integration with error tracking services like Sentry.

**10. Validation:**

- Regularly validate changes using the project's scripts:
  - `pnpm type-check`
  - `pnpm lint`
  - `pnpm test`

**11. Dependencies:**

- `winston`
- Potentially `react` types if not already covered.
- `vitest`, `@testing-library/react` (for tests)

**12. Deliverable:**

- This plan file (`.agent/plans/error-handling-plan.md`).
- Code files and directories created in Steps 1-4 (using Winston).

**13. Next Steps:**

- Begin **Step 7.2: Write tests for `global-error.tsx`, `not-found.tsx`, and `error.tsx` handlers**.

**Error Handling Refactoring Plan**

**Objective:** Implement a robust and maintainable error handling strategy for the Next.js application, utilizing custom error classes and a centralized handler for processing errors, especially those from network requests.

**Status:** In Progress

**Key Components:**

1.  **Custom Error Classes:** Define a hierarchy of error classes (`AppError`, `NetworkError`, specific network errors like `NotFoundError`, `AuthorizationError`, `DatabaseError`, `ValidationError`) for semantic error representation.
2.  **Centralized Error Handler:** A function/module responsible for catching raw errors (especially from `fetch` or other operations), inspecting them, creating the appropriate custom error instance (using the raw error's context, e.g., HTTP status), logging, reporting, and then potentially throwing/returning the custom error.
3.  **Global Error Boundary (`global-error.tsx`):** Catches unhandled errors, logs them, and displays a user-friendly fallback UI.
4.  **Not Found Boundary (`not-found.tsx`):** Handles specific 404 scenarios.
5.  **Logging:** Use Winston for structured logging.
6.  **Testing:** Use Vitest for unit and integration tests.

**Revised Plan:**

1.  **[Done]** Define Base `AppError` Class (`src/lib/errors/app-error.ts`) & Tests (`.unit.test.ts`).
2.  **[Done]** Define `NetworkError` Class (`src/lib/errors/network/network-error.ts`) extending `AppError`, handling `statusCode` and defaulting messages from `http.STATUS_CODES`.
3.  **[Done]** Refactor specific network errors (`AuthorizationError`, `NotFoundError`, `DatabaseError`, `ValidationError`) to extend `NetworkError`.
4.  **[Done]** Create Initial Tests for `NetworkError` (`network-error.unit.test.ts`).
5.  **[Done]** Create Central Error Handler Tests (TDD):
    - Create `src/lib/errors/error-handler.unit.test.ts`.
    - Test scenarios: successful response, 404, 403, 5xx, generic errors, non-errors.
    - Verify correct custom error type is generated.
    - Verify `statusCode` is extracted from the original error (if available).
    - Verify `cause` property is set to the original error.
    - Verify logging function is called (using mocks).
6.  **[Done]** Implement Central Error Handler:
    - Create `src/lib/errors/error-handler.ts`.
    - Implement the function (e.g., `handleOperationalError` or `processError`) based on the tests.
    - Include inspection logic and custom error instantiation.
    - Integrate Winston logging calls.
7.  **[Done]** Integrate Central Handler (Example):
    - Find/create an example of a `fetch` call.
    - Wrap it in `try-catch`.
    - Call the central error handler in the `catch` block.
8.  **[Done]** Update `global-error.tsx`:
    - Ensure it correctly handles custom errors potentially thrown/returned by the central handler.
    - Check `instanceof NetworkError` for status codes.
    - Log errors effectively.
9.  **[Done]** Implement `not-found.tsx` for specific 404 handling within Next.js routing.
10. **[Moved]** Refine Fallback UIs (`GlobalErrorFallback`, potentially `NotFoundFallback`) - Moved to `./error-handling-enhancement-plan.md`.
11. **[Moved]** Consider adding external error tracking (e.g., Sentry) integration points in the central handler - Moved to `./error-handling-enhancement-plan.md`.
12. **[Done]** Final Test Run (`pnpm test`).
13. **[Done]** Address any remaining linting issues (`pnpm lint --fix`).

**Notes:**

- Adhere to TDD principles.
- Use kebab-case for new filenames (per project preference).
- Ensure `cause` is used consistently to maintain error chains.
- Prioritize logging the _original_ error details within the handler.

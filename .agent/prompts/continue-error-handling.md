# Continue: Centralized Error Handling Implementation

This document summarizes the current state of the centralized error handling implementation task, based on the plan in [.agent/plans/error-handling-plan.md](/.agent/plans/error-handling-plan.md), to allow continuation in a new chat session.

## User Objective:

Implement a robust, centralized error handling strategy in the Next.js application (/Users/jim/code/cv). This involves:

- Refining custom error classes ([AppError](src/lib/errors/app-error.ts), [NetworkError](src/lib/errors/network/network-error.ts) and subclasses like [NotFoundError](src/lib/errors/network/not-found-error.ts), [ValidationError](src/lib/errors/network/validation-error.ts), [DatabaseError](src/lib/errors/network/database-error.ts), [AuthorizationError](src/lib/errors/network/authorization-error.ts)).
- Ensuring proper default messages and status codes.
- Maintaining error context using the `cause` property.
- Implementing and testing a central `processError` function ([error-handler.ts](src/lib/errors/error-handler.ts)) to map various errors (Fetch, generic, non-errors) to appropriate custom errors and log them.
- Adhering to TDD principles.

## Current Status:

**Completed:**

1.  **Refactored Error Classes:**
    - Base `AppError` created.
    - `NetworkError` created, extending `AppError` with `statusCode`.
    - Specific network errors (`NotFoundError`, `ValidationError`, `DatabaseError`, `AuthorizationError`) created, extending `NetworkError` with appropriate default status codes and messages.
    - Constructors updated to accept `message` and `options` (including `cause` and `isOperational`).
2.  **Implemented `processError` Function:**
    - Handles generic `Error` instances.
    - Handles non-Error types (string, null, undefined).
    - Includes basic detection for Fetch-like errors (`isFetchError` helper) and maps them based on status code (400 -> ValidationError, 403 -> AuthorizationError, 404 -> NotFoundError, 500 -> DatabaseError, others -> NetworkError).
    - Integrates with `logger.error` to log processed errors and original context.
3.  **Unit Tests:**
    - Tests created/updated for all error classes ([\*.unit.test.ts](src/lib/errors/**/*.unit.test.ts)) to verify constructors, properties (`message`, `statusCode`, `isOperational`, `cause`), and inheritance.
    - Tests created for `processError` ([error-handler.unit.test.ts](src/lib/errors/error-handler.unit.test.ts)) covering different input types (Fetch errors, generic errors, non-errors) and verifying the output error type, properties, and logging calls.
    - All tests in `src/lib/errors` were passing as of Step 201.
4.  **Missing Files Created:**
    - `src/lib/constants.ts` (with `HttpStatus` enum).
    - `src/lib/types.ts` (with `FieldErrorDetail` type).
5.  **Addressed Type Errors:**
    - Fixed TS2339 errors in `error-handler.unit.test.ts` by adding type assertions (`as NetworkError`) after `instanceof` checks.

**Work In Progress / Next Steps:**

1.  **Lint Errors in `error-handler.unit.test.ts`:**
    - An attempt was made in Step 227 to fix lint errors (module resolution, import order, null vs undefined).
    - **Current Blocker:** The last edit (Step 227) seems to have broken imports, causing TS errors (`Cannot find module '.'`, `Cannot find name 'processError'`) and new lint errors (unused `HttpStatus`, unresolved paths, etc.). This needs to be fixed.
    - Remaining TODO comments need addressing.
2.  **Run Lint Check:** After fixing the test file, run `pnpm lint` to identify and fix any remaining lint issues across the error handling modules.
3.  **Review & Refine:**
    - Review the `processError` logic, especially the `isFetchError` check and the mapping of status codes. Consider if more sophisticated Fetch error handling (e.g., parsing response body for validation errors) is needed.
    - Consider renaming files to kebab-case (e.g., `app-error.ts`) as per MEMORY[7a6767d0].

## Key Files Modified/Created:

- `src/lib/constants.ts`
- `src/lib/types.ts`
- `src/lib/errors/app-error.ts`
- `src/lib/errors/error-handler.ts`
- `src/lib/errors/network/network-error.ts`
- `src/lib/errors/network/authorization-error.ts`
- `src/lib/errors/network/database-error.ts`
- `src/lib/errors/network/not-found-error.ts`
- `src/lib/errors/network/validation-error.ts`
- All corresponding `.unit.test.ts` files.

## Relevant Memories:

- MEMORY[7a6767d0]: Filenames should be kebab-case.
- MEMORY[ad1e2f6b]: Project context (Next.js, TS, pnpm, vitest, etc.).

**Next action:** Fix the import/TS/lint errors introduced in `error-handler.unit.test.ts` in Step 227.

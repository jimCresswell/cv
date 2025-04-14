# Error Handling System

This document outlines the error handling strategy implemented in the `@jimcresswell/personal-site` project.

## Core Components

1.  **Winston Logger (`src/lib/logging.ts`)**

    - Provides structured logging.
    - Configurable log levels via `process.env.LOG_LEVEL`.
    - Outputs readable format in development and JSON format in production.
    - Includes stack traces for errors.

2.  **Custom Error Classes (`src/lib/errors/`)**

    - **`AppError` (`app-error.ts`):** Base class for all custom application errors. Supports `isOperational` flag to distinguish expected errors from programmer errors, and includes a `cause` property.
    - **`NetworkError` (`network/network-error.ts`):** Extends `AppError` for network-related issues. Includes an HTTP `statusCode` and defaults messages based on `http.STATUS_CODES`.
    - **Specific Network Errors (`network/*.ts`):**
      - `AuthenticationError` (401)
      - `AuthorizationError` (403)
      - `NotFoundError` (404)
      - `ValidationError` (400)
      - `DatabaseError` (Generic 500, intended for database operation failures)

3.  **Central Error Processor (`src/lib/errors/error-handler.ts**)\*\*

    - Exports the `processError` function.
    - Takes any caught error (`unknown`) as input.
    - Inspects the error:
      - If it's already an `AppError`, it's returned directly.
      - If it resembles a `fetch` error (has `response.status`), it maps the status code to the appropriate `NetworkError` subclass (e.g., 404 -> `NotFoundError`).
      - If it's a generic `Error`, it wraps it in a non-operational `AppError`.
      - If it's not an error object (e.g., a thrown string), it creates a generic non-operational `AppError`.
    - Sets the original caught item as the `cause` for the new `AppError`.
    - Logs the _processed_ error using the Winston logger.
    - Returns the processed `AppError` instance.
    - **Example Usage:** See `src/app/fetch-example/page.tsx` for how to use `processError` in a `try...catch` block around `fetch` calls.

4.  **Client-Side Layout Error Boundary (`src/components/error-handling/error-boundary.tsx`)**

    - A React Class Component using `getDerivedStateFromError` and `componentDidCatch`.
    - Wraps the main application content in `src/app/layout.tsx`.
    - Catches rendering errors in its component tree _during client-side navigation/interaction_, specifically for components within the main layout shell (header, main, footer).
    - Logs the caught error and component stack using Winston.
    - Displays a fallback UI (`DefaultFallback` within the component).

5.  **App Router Segment-Level Error Boundaries (`error.tsx`)**

    - Next.js convention: Create an `error.tsx` file alongside a `page.tsx` within a route segment (e.g., `src/app/fetch-example/error.tsx`).
    - This component acts as a UI boundary for errors occurring within that specific segment and its children, both during server-side rendering and client-side rendering/navigation.
    - It receives `error` (the error instance) and `reset` (a function to attempt re-rendering the segment) props.
    - Allows for more granular error handling and UI fallbacks compared to the global error boundary.
    - Errors caught here _do not_ propagate to `global-error.tsx`.
    - **Note:** You are responsible for implementing logging within segment-level `error.tsx` files if desired (e.g., using `useEffect` and the logger).

6.  **App Router Global Error Boundary (`src/app/global-error.tsx`)**

    - Catches _unhandled_ errors that occur anywhere in the application and were _not_ caught by a segment-level `error.tsx` or the client-side `ErrorBoundary`.
    - This component itself is minimal; its primary role is to render the `GlobalErrorFallback` component, passing the caught `error` and `reset` function to it.
    - It ensures a root HTML document is always rendered.

7.  **Global Error Fallback Component (`src/components/error-handling/global-error-fallback.tsx`)**

    - This component renders the actual fallback UI displayed when an error is caught by `global-error.tsx`.
    - It receives the `error` and `reset` props from `global-error.tsx`.
    - **Crucially, this component now handles the logging** of these globally caught errors using `useEffect` and the Winston logger. It logs details like the error message, stack, `digest` (for server errors), and `statusCode` (if available).

8.  **App Router Not Found Boundary (`src/app/not-found.tsx`)**
    - Automatically rendered by Next.js when `notFound()` is called or a route segment is missing.
    - Provides a specific UI for 404 errors.

## Workflow

1.  **Operational Errors (e.g., Fetch):**
    - `fetch` call is wrapped in `try...catch`.
    - On failure (e.g., non-ok status, network issue), the `catch` block calls `processError`.
    - `processError` identifies the type of error (e.g., `NotFoundError` from a 404 status), logs it, and returns the specific `AppError` instance.
    - The calling code receives the `AppError` and can decide how to update the UI (e.g., show an error message).
2.  **Client Rendering Errors (Layout):**
    - An error occurs during client-side rendering within a component wrapped by the main layout's `ErrorBoundary`.
    - `ErrorBoundary` catches the error via `componentDidCatch`.
    - The error is logged.
    - The fallback UI is displayed.
3.  **Segment-Level Errors (Server/Client):**
    - An error occurs within a route segment (e.g., `src/app/fetch-example/`) during server rendering or client interaction.
    - The corresponding `src/app/fetch-example/error.tsx` catches it.
    - If implemented, the error is logged within `error.tsx`.
    - The specific fallback UI defined in `error.tsx` is rendered for that segment.
4.  **Unhandled/Global Errors:**
    - An error occurs that isn't caught by `processError`, the layout `ErrorBoundary`, or a segment `error.tsx`.
    - `global-error.tsx` catches it.
    - `global-error.tsx` renders `GlobalErrorFallback`, passing `error` and `reset`.
    - `GlobalErrorFallback` logs the error via `useEffect`.
    - `GlobalErrorFallback` renders the global fallback UI.
5.  **Not Found Errors:**
    - User navigates to a non-existent route or `notFound()` is thrown.
    - Next.js automatically renders `not-found.tsx`.

## Future Enhancements

Refer to `.agent/plans/error-handling-enhancement-plan.md` for planned improvements, including:

- Refining fallback UI styling.
- Integrating external error tracking (e.g., Sentry).

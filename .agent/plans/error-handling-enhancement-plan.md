# Plan: Error Handling Enhancements

**1. Goal:**

Enhance the foundational error handling system established in `./error-handling-plan.md` for the `@jimcresswell/personal-site` project. This involves refining user-facing feedback (fallback UIs) and integrating with external monitoring services for better production observability, adhering to principles in `../best-practices.md`.

**2. Context:**

This plan follows the completion of the initial error handling setup, which included:

- Custom error class hierarchy (`AppError`, `NetworkError`, etc.)
- Centralized error processing (`processError` in `src/lib/errors/error-handler.ts`)
- Configured Winston logging (`src/lib/logging.ts`)
- Root client-side error boundary (`src/components/error-handling/error-boundary.tsx`)
- App Router error boundaries (`src/app/global-error.tsx`, `src/app/not-found.tsx`)

**3. Prerequisites:**

- Completion of tasks outlined in `./error-handling-plan.md`.
- Existing project structure and error handling components.

**4. Implementation Steps:**

These steps were originally identified as future work or refinements in the initial plan.

- **Step 1: Refine Fallback UIs:**

  - **Action:** Improve the styling and content of the `GlobalErrorFallback` component (`src/components/error-handling/global-error-fallback.tsx`) using Tailwind CSS and align it with the overall site design (once established).
  - **Action:** Create a dedicated `NotFoundFallback` component (`src/components/error-handling/not-found-fallback.tsx`) to be used by `src/app/not-found.tsx`.
  - **Action:** Style the `NotFoundFallback` component consistently with the site design.
  - **Rationale:** Provide a more polished and user-friendly experience when errors occur.

- **Step 2: Integrate External Error Tracking (e.g., Sentry):**
  - **Action:** Choose and configure an external error tracking service (Sentry is a common choice).
  - **Action:** Integrate the service's SDK into the application.
  - **Action:** Update the `processError` function (`src/lib/errors/error-handler.ts`) to report processed errors to the external service.
  - **Action:** Update the `componentDidCatch` method in `ErrorBoundary` (`src/components/error-handling/error-boundary.tsx`) to report client-side errors.
  - **Action:** Update `global-error.tsx` to report errors caught at the root level.
  - **Rationale:** Enable proactive monitoring, aggregation, and alerting for production errors, crucial for maintaining application health.

**5. Testing:**

- Tests for UI components (`GlobalErrorFallback`, `NotFoundFallback`) should verify rendering and props.
- Integration tests might be needed to verify that errors are correctly reported to the external service (potentially using mocks for the service's SDK).

**6. Dependencies:**

- SDK for the chosen error tracking service (e.g., `@sentry/nextjs`).

**7. Deliverable:**

- This plan file (`error-handling-enhancement-plan.md`).
- Updated/new fallback components.
- Integration code for the error tracking service.

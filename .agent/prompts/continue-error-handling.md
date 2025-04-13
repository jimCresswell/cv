# Prompt: Continue Error Handling Implementation

**Goal:** Continue implementing foundational error handling mechanisms for the `@jimcresswell/personal-site` project, following the plan outlined in `.agent/plans/error-handling-plan.md`.

**Current Status:**

- **Completed:**
  - Winston logger configured (`src/lib/logging.ts`).
  - Custom error classes (`AppError`, `ValidationError`, `NotFoundError`, `AuthorizationError`, `DatabaseError`) created and unit tested (`src/lib/errors/`). Constructors were refactored to use an options object.
  - Client-side `ErrorBoundary` component created (`src/components/error-handling/error-boundary.tsx`), unit tested, and integrated into the root layout (`src/app/layout.tsx`).
- **Reference:** The detailed plan and status are in `.agent/plans/error-handling-plan.md`. Note the project's preference for kebab-case filenames, although some existing error files use PascalCase. TDD approach is preferred.

**Next Step:**

- Implement **Step 4** from the plan: Create the Next.js App Router production catch-all error file `src/app/global-error.tsx`. This file should:
  - Be a Client Component (`'use client'`).
  - Accept `error` and `reset` props.
  - Log the error using the configured Winston logger (`src/lib/logging.ts`).
  - Render a user-friendly fallback UI (potentially reusing or adapting the `DefaultFallback` from `ErrorBoundary` or creating a new one).
  - Include a button to call the `reset()` function to attempt recovery.
- After creating the file, proceed to **Step 7.2**: Plan and potentially implement tests for `global-error.tsx`.

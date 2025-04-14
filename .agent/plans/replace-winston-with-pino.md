# Plan: Replace Winston with Pino for Isomorphic Logging

**Objective:** Replace the `winston` logging library with `pino` to ensure compatibility with Next.js server, browser, and edge environments. Winston relies on Node.js APIs, causing build failures when used in client components.

**Steps:**

1.  **Uninstall Winston:**

    - Run `pnpm remove winston`.

2.  **Install Pino:**

    - Run `pnpm add pino`.
    - Run `pnpm add -D pino-pretty` (for development-friendly console output).

3.  **Refactor `src/lib/logging.ts`:**

    - Import `pino`.
    - Initialize a Pino logger instance.
    - Configure Pino for different environments:
      - **Server-side (Node.js):** Log to `stdout`. Use `pino-pretty` conditionally based on `NODE_ENV === 'development'`. Set appropriate log level (`process.env.LOG_LEVEL || 'info'`).
      - **Client-side (Browser):** Configure Pino to use standard `console` methods (`console.log`, `console.info`, `console.warn`, `console.error`) or potentially a browser-specific transport if needed later. Check for `typeof window !== 'undefined'`.
    - Export the configured logger instance.

4.  **Update Logger Usage:**

    - Review files importing `logger` from `@/lib/logging`:
      - `src/lib/errors/error-handler.ts`
      - `src/components/error-handling/error-boundary.tsx`
      - `src/components/error-handling/global-error-fallback.tsx`
      - `src/app/fetch-example/error.tsx`
      - Any other files using the logger.
    - Ensure the logging calls conform to Pino's API (e.g., `logger.info({ key: value }, 'message')`, `logger.error(error, 'message')`).

5.  **Update Test Mocks:**

    - Locate `vi.mock('@/lib/logging', ...)` blocks in test files.
    - Adjust the mocked logger implementation to match Pino's API if necessary (likely minimal changes).

6.  **Verification:**

    - Run `pnpm test` to ensure all tests pass.
    - Run `pnpm build` to confirm the build succeeds without Node.js API errors in client components.

7.  **Update Documentation:**
    - Edit `docs/error-handling.md`.
    - Replace references to "Winston" with "Pino".
    - Update the description of the logging component.

**Rationale:** Pino provides high performance, structured logging, and is designed to work isomorphically across Node.js, browser, and edge environments, resolving the build issues caused by Winston's Node.js dependencies.

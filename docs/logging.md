# Logging System

This document outlines the logging strategy implemented in the `@jimcresswell/personal-site` project, using the [Pino](https://getpino.io/) library.

## Core Components

-   **Pino Logger (`src/lib/shared/logging.ts`)**
    -   Provides fast, structured JSON logging.
    -   Configurable log levels via the `LOG_LEVEL` environment variable (defaults to `info`).
    -   Designed to be **isomorphic**, working correctly in both server (Node.js) and client (browser) environments.

## Configuration

The logger instance is configured within `src/lib/shared/logging.ts`:

1.  **Environment Detection:** It checks `globalThis.window === undefined` to determine if it's running on the server or in the browser.
2.  **Log Level:** Reads `process.env.LOG_LEVEL` or defaults to `'info'`.
3.  **Error Serialization:** Uses `pino.stdSerializers.err` to ensure errors are logged with stack traces and relevant properties.

### Server-Side Configuration

-   When running in Node.js (`globalThis.window === undefined`):
    -   In **development** (`process.env.NODE_ENV === 'development'`), it uses the `pino-pretty` transport for human-readable, colorized console output.
    -   In **production**, it uses Pino's default behavior, outputting structured JSON logs to `stdout`.

### Client-Side Configuration

-   When running in a browser (`globalThis.window !== undefined`):
    -   It initializes Pino using its standard browser configuration.
    -   Logs are directed to the browser's developer console.
    -   Standard error serializers are included.

## Usage

1.  **Import the logger:**
    ```typescript
    import { logger } from "@/lib/shared/logging";
    ```
2.  **Use standard logging methods:**
    ```typescript
    logger.info("User logged in successfully.");
    try {
      // ... some operation ...
    } catch (error) {
      // It's often useful to log the original error if processing it
      logger.error({ err: error }, "Failed to perform operation X.");
      // You might then process the error further (e.g., using processError)
    }
    ```

## Log Levels

Standard Pino log levels apply: `fatal`, `error`, `warn`, `info`, `debug`, `trace`. Setting the `LOG_LEVEL` environment variable controls the minimum level that will be logged. For example, `LOG_LEVEL=debug` will show `debug`, `info`, `warn`, `error`, and `fatal` messages.

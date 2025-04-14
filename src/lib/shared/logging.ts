import { pino } from "pino";

const logLevel = process.env.LOG_LEVEL || "info";
const isDevelopment = process.env.NODE_ENV === "development";

let logger: pino.Logger;

// Check if running in a server environment first (satisfies unicorn/no-negated-condition)
if (globalThis.window === undefined) {
  // Server-side logging
  const serverOptions: pino.LoggerOptions = {
    level: logLevel,
    serializers: {
      err: pino.stdSerializers.err,
      error: pino.stdSerializers.err,
    },
  };

  if (isDevelopment) {
    serverOptions.transport = {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    };
  }

  logger = pino(serverOptions);

  logger.info(
    `Server-side logger initialized with level: ${logLevel} in ${process.env.NODE_ENV || "unknown"} mode`,
  );
} else {
  // Client-side logging: Initialize Pino for the browser
  logger = pino({
    level: logLevel,
    // Serializers should be top-level, not inside 'browser'
    serializers: {
      err: pino.stdSerializers.err,
      error: pino.stdSerializers.err,
    },
    browser: {
      // We can configure transports here if needed,
      // but the default console transport is usually sufficient.
      // Example: transmit logs to a backend service
      // transmit: {
      //   level: 'info',
      //   send: (level, logEvent) => { ... }
      // }
      // Disable browser features if they cause issues
      // asObject: true // Example: Log messages as objects
    },
  });

  logger.info(`Client-side Pino logger initialized with level: ${logLevel}`);
}

export { logger };

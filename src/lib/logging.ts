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

logger.info(
  `Logger initialized with level: ${logLevel} in ${process.env.NODE_ENV || "unknown"} mode`,
);

// Example usage (can be removed later):
// logger.debug('This is a debug message');
// logger.info('This is an info message');
// try {
//   throw new Error('Something went wrong!');
// } catch (e) {
//   logger.error('Caught an error', { error: e }); // Log error object with stack
// }

import type { Logger } from "winston";
import winston from "winston";

const logger: Logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" || process.env.DEBUG === "true" ? "debug" : "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple(),
  ),
  transports: [new winston.transports.Console()],
});

export { logger };

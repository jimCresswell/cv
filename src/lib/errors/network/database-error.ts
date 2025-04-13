import { AppError } from "../app-error";

export class DatabaseError extends AppError {
  constructor(message = "Database operation failed", cause?: Error | unknown) {
    super(message, { statusCode: 500, isOperational: true, cause }); // 500 Internal Server Error (default for DB issues)
  }
}

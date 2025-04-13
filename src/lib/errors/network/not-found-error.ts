import { AppError } from "../app-error";

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", cause?: Error | unknown) {
    super(message, { statusCode: 404, isOperational: true, cause }); // 404 Not Found
  }
}

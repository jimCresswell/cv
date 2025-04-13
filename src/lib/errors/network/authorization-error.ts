import { AppError } from "../app-error";

export class AuthorizationError extends AppError {
  constructor(message = "Permission denied", cause?: Error | unknown) {
    super(message, { statusCode: 403, isOperational: true, cause }); // 403 Forbidden
  }
}

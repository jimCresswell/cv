import { NetworkError } from "./network-error";

/**
 * Represents an error where an action is forbidden due to lack of authorization.
 * Defaults to HTTP status code 403 (Forbidden).
 */
export class AuthorizationError extends NetworkError {
  constructor(message?: string, options?: { cause?: Error | unknown }) {
    super(403, message, options);
    this.name = "AuthorizationError";
  }
}

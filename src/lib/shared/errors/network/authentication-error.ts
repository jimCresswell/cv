// src/lib/errors/network/authentication-error.ts
import { getHttpMessageForCode, HttpStatus } from "@/lib/shared/constants";

import { NetworkError, type NetworkErrorOptions } from "./network-error";

/**
 * Represents an HTTP 401 Unauthorized error.
 * Typically indicates that the request requires user authentication.
 */
export class AuthenticationError extends NetworkError {
  constructor(message?: string, options?: NetworkErrorOptions) {
    const defaultMessage = getHttpMessageForCode(HttpStatus.UNAUTHORIZED.code) || "Unauthorized";
    super(HttpStatus.UNAUTHORIZED.code, message || defaultMessage, options);
    this.name = "AuthenticationError";

    // Ensure the prototype chain is correctly set
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

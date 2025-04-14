// src/lib/errors/network/authentication-error.ts
import http from "node:http";

import { HttpStatus } from "@/lib/constants";

import { NetworkError, type NetworkErrorOptions } from "./network-error";

/**
 * Represents an HTTP 401 Unauthorized error.
 * Typically indicates that the request requires user authentication.
 */
export class AuthenticationError extends NetworkError {
  constructor(message?: string, options?: NetworkErrorOptions) {
    const defaultMessage = http.STATUS_CODES[HttpStatus.UNAUTHORIZED] || "Unauthorized";
    super(HttpStatus.UNAUTHORIZED, message || defaultMessage, options);
    this.name = "AuthenticationError";

    // Ensure the prototype chain is correctly set
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

"use client"; // This component must be a Client Component

import React, { Component } from "react";
import type { ErrorInfo, ReactNode } from "react"; // Use import type

import { logger } from "@/lib/logging"; // Use our Winston logger

interface Props {
  children: ReactNode;
  fallback?: ReactNode; // Optional custom fallback UI
}

interface State {
  hasError: boolean;
  error: Error | undefined;
}

// Default fallback UI (simple version)
const DefaultFallback = () => (
  <div className="p-4 text-center text-red-600 border border-red-300 rounded-md bg-red-50">
    <h2>Something went wrong.</h2>
    <p>We have been notified and are looking into it. Please try refreshing the page.</p>
  </div>
);

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: undefined,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error using our Winston logger
    // Pass the error object directly, Winston's 'errors' format handles the stack.
    logger.error("ErrorBoundary caught an error:", {
      // Include component stack separately if desired
      componentStack: errorInfo.componentStack,
      // Log the error object itself for Winston to handle
      error: error,
    });
    // Integrate with Sentry or similar once we have it.
    // Sentry.captureException(error, { extra: { errorInfo } });
  }

  // This is a standard React pattern for error boundaries
  // eslint-disable-next-line sonarjs/function-return-type
  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || <DefaultFallback />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

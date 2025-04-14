// src/components/error-handling/global-error-fallback.tsx
import React, { useEffect } from "react";

import { NetworkError } from "@/lib/errors/network/network-error"; // Import NetworkError
import { logger } from "@/lib/logging"; // Import logger

interface GlobalErrorFallbackProps {
  readonly error: Error & { digest?: string }; // Add error prop
  readonly reset: () => void;
}

export default function GlobalErrorFallback({
  error, // Destructure error
  reset,
}: GlobalErrorFallbackProps) {
  useEffect(() => {
    // Log the error including the digest if available and statusCode if NetworkError
    const logDetails: Record<string, unknown> = {
      error: error, // Pass the full error object
      digest: error.digest,
    };
    if (error instanceof NetworkError) {
      logDetails.statusCode = error.statusCode;
    }
    logger.error("Unhandled Application Error caught by GlobalErrorFallback:", logDetails);
  }, [error]); // Log whenever the error changes

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md rounded-lg border border-destructive bg-card p-6 text-center shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-destructive">Oops! Something went wrong.</h1>
        <p className="mb-6 text-muted-foreground">
          An unexpected error occurred. We have logged the issue and our team will look into it.
          Please try again.
        </p>
        <button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" // Added focus styles
          type="button" // Explicitly set type
        >
          Try again
        </button>
      </div>
    </main>
  );
}

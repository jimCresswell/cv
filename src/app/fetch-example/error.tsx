"use client"; // Error components must be Client Components

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logging";

interface FetchExampleErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function FetchExampleError({ error, reset }: Readonly<FetchExampleErrorProps>) {
  useEffect(() => {
    // Log the error to an error reporting service
    logger.error("Error caught in /fetch-example segment:", {
      error: error,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="container mx-auto p-4 text-center">
      <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong!</h2>
      <p className="mb-4">An error occurred within the fetch example page.</p>
      {error?.message && <p className="mb-4 text-muted-foreground">Error: {error.message}</p>}
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}

"use client";

import { useState } from "react";

import type { AppError } from "@/lib/shared/errors/app-error";
import { processError } from "@/lib/shared/errors/error-handler";

export default function FetchExampleClient() {
  const [result, setResult] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleFetch = async (url: string) => {
    setIsLoading(true);
    setResult(undefined);
    setError(undefined);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        // Create an actual error instance
        const error = new Error(`HTTP error! status: ${response.status}`);
        // Attach the response object to it, matching the expected structure for isFetchError
        // Use type intersection to satisfy the compiler and linter
        (error as Error & { response: { status: number; statusText: string } }).response = {
          status: response.status,
          statusText: response.statusText,
        };
        throw error;
      }

      const data = await response.json();
      setResult(JSON.stringify(data, undefined, 2));
    } catch (caughtError: unknown) {
      const processedAppError: AppError = processError(caughtError);
      setError(`Error (${processedAppError.name}): ${processedAppError.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Fetch Example with Error Handling</h1>
      <p>Click buttons to fetch data or trigger errors handled by `processError`.</p>

      <div style={{ margin: "1rem 0", display: "flex", gap: "1rem" }}>
        <button onClick={() => handleFetch("https://httpbin.org/get")} disabled={isLoading}>
          Fetch Success (200)
        </button>
        <button onClick={() => handleFetch("https://httpbin.org/status/404")} disabled={isLoading}>
          Fetch Not Found (404)
        </button>
        <button onClick={() => handleFetch("https://httpbin.org/status/500")} disabled={isLoading}>
          Fetch Server Error (500)
        </button>
        <button
          onClick={() => handleFetch("https://non-existent-domain.invalid/")}
          disabled={isLoading}
        >
          Fetch Network Error (DNS)
        </button>
      </div>

      {isLoading && <p data-testid="loading-indicator">Loading...</p>}

      {error && (
        <div
          data-testid="error-message"
          style={{
            marginTop: "1rem",
            padding: "1rem",
            border: "1px solid red",
            color: "red",
            backgroundColor: "#ffebee",
          }}
        >
          <h2>Error Occurred:</h2>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{error}</pre>
        </div>
      )}

      {result && (
        <div
          data-testid="success-result"
          style={{
            marginTop: "1rem",
            padding: "1rem",
            border: "1px solid green",
            backgroundColor: "#e8f5e9",
          }}
        >
          <h2>Success Result:</h2>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{result}</pre>
        </div>
      )}
    </div>
  );
}

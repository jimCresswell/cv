// src/app/fetch-example/page.tsx
"use client";

import { useState } from "react";

import type { AppError } from "@/lib/shared/errors/app-error";
import { processError } from "@/lib/shared/errors/error-handler";

export default function FetchExamplePage() {
  const [result, setResult] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleFetch = async (url: string) => {
    setIsLoading(true);
    setResult(undefined);
    setError(undefined);

    try {
      const response = await fetch(url);

      // Check if the response was successful (status in the range 200-299)
      if (!response.ok) {
        // Throw an error that processError can understand
        // We simulate a fetch error structure, though real fetch might not throw directly
        // processError expects an object with a 'response' property containing 'status'
        throw {
          message: `HTTP error! status: ${response.status}`,
          response: {
            status: response.status,
            statusText: response.statusText,
            // In a real scenario, you might try to read response.json() or response.text()
            // but be careful as reading the body consumes it.
          },
          name: "FetchErrorSimulated", // Give it a name for clarity
        };
      }

      const data = await response.json();
      setResult(JSON.stringify(data, undefined, 2));
    } catch (caughtError: unknown) {
      // Process the error using our central handler
      const processedAppError: AppError = processError(caughtError);
      // Display the message from the processed error
      setError(`Error (${processedAppError.name}): ${processedAppError.message}`);
      // The error is also logged centrally by processError
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

      {isLoading && <p>Loading...</p>}

      {error && (
        <div
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

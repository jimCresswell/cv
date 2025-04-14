"use client";

import React from "react";

import GlobalErrorFallback from "@/components/error-handling/global-error-fallback";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Readonly<GlobalErrorProps>) {
  return (
    <html lang="en">
      <body>
        <GlobalErrorFallback error={error} reset={reset} />
      </body>
    </html>
  );
}

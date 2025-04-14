// src/app/not-found.tsx
import Link from "next/link";
import React from "react";

// TODO: Style this component properly - create NotFoundFallback?
export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            fontFamily: "sans-serif",
          }}
        >
          <h1 style={{ fontSize: "2em", marginBottom: "0.5em" }}>404 - Page Not Found</h1>
          <p style={{ marginBottom: "1em" }}>Sorry, the page you are looking for does not exist.</p>
          <Link href="/" style={{ color: "blue", textDecoration: "underline" }}>
            Go back to Home
          </Link>
        </div>
      </body>
    </html>
  );
}

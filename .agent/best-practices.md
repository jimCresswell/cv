# Project Development Best Practices

## Introduction

This document outlines the core development principles and best practices to be followed for the `personal-site` project. As this repository also serves as a portfolio demonstrating technical expertise and adherence to modern standards, maintaining the highest quality is paramount. Consistency, clarity, testability, and maintainability are key goals.

## 1. Testing

- **Test-Driven Development (TDD)**: Adopt a TDD workflow wherever practical. Write tests (unit, integration, or end-to-end) _before_ writing the implementation code. This ensures testability and clarifies requirements.
  - **Unit Tests**: Use Vitest and React Testing Library for testing individual components, hooks, and utility functions in isolation. Focus on inputs, outputs, and rendered results.
  - **Integration Tests**: Test the interaction between multiple components or units.
  - **E2E Tests**: Consider Playwright or Cypress for critical user flows if the application complexity increases significantly.
- **Coverage**: Aim for high, meaningful test coverage, but prioritize testing critical paths and complex logic over achieving arbitrary percentage targets.
- **Assertion Clarity**: Write clear and specific assertions.

## 2. TypeScript & Type Safety

- **Strict Mode**: Ensure `tsconfig.json` uses strict settings (`"strict": true`).
- **Type Inference**: Leverage TypeScript's type inference as much as possible, but explicitly type function signatures, complex objects, and component props for clarity.
- **Runtime Validation First**: For data structures (especially those coming from external sources like APIs or potentially a future database), define the shape using a runtime validation library like **Zod**.
  - Define the Zod schema (e.g., `src/lib/schemas/cv-schema.ts`).
  - Infer the static TypeScript type directly from the Zod schema (`z.infer<typeof schema>`).
  - Use the Zod schema (`.parse()` or `.safeParse()`) to validate data at runtime boundaries (e.g., API responses/requests).
- **Type Guards Over Assertions**:
  - **Prefer Type Guards**: Use user-defined type guards (`function isType(arg: any): arg is Type`) or Zod's parsing methods to narrow types safely based on runtime checks.
  - **Avoid Type Assertions (`as`)**: Do _not_ use type assertions (`value as Type` or `<Type>value`) in application code. They bypass type checking and can hide runtime errors. Assertions may be acceptable _only_ within test files where the type is guaranteed by the test setup.
- **Utility Types**: Utilize built-in TypeScript utility types (`Partial`, `Required`, `Readonly`, `Pick`, `Omit`, etc.) to create new types effectively.
- **Enums**: Use TypeScript `enum` or `const` assertions for defining sets of named constants where appropriate.

## 3. Next.js (App Router)

- **Server Components by Default**: Leverage React Server Components (RSCs) for optimal performance. Fetch data directly within server components.
- **Client Components Selectively**: Use the `"use client"` directive only when necessary (e.g., for components requiring state, effects, event listeners, or browser APIs). Keep client components small and push state/effects down the tree.
- **Route Handlers**: Use Route Handlers (`src/app/api/.../route.ts`) for API endpoints, following RESTful principles where applicable. Validate request/response bodies using Zod.
- **Metadata API**: Use the Metadata API (`export const metadata: Metadata = {...}` or `generateMetadata`) for SEO and page information. Keep metadata generation co-located with pages/layouts.
- **Loading UI**: Implement `loading.tsx` files for better perceived performance during navigation and data fetching.
- **Error Handling**: Implement `error.tsx` for handling runtime errors within route segments and potentially a `global-error.tsx` for root layout errors. Use `notFound()` and `not-found.tsx` for 404 states.
- **Optimization APIs**:
  - Use `next/image` for automatic image optimization.
  - Use `next/font` for font optimization and preventing layout shifts.
  - Use `next/link` for client-side navigation prefetching.

## 4. React

- **Component Composition**: Build UIs by composing small, reusable components. Favour composition over inheritance.
- **Props**: Use clear and consistent prop naming. Destructure props for readability. Define prop types using TypeScript interfaces or types derived from Zod schemas.
- **State Management**:
  - Prefer local state (`useState`) for component-specific state.
  - Lift state up only when necessary for sharing between siblings.
  - Use Context API sparingly for global state that doesn't change often (e.g., theme).
  - For complex cross-component state, consider Zustand if Context becomes unwieldy, but prioritize RSCs to minimize client-side state.
- **Hooks**: Follow the Rules of Hooks (call only at the top level, call only from React functions). Create custom hooks to encapsulate reusable logic and stateful behaviour.
- **Keys**: Always provide stable and unique `key` props when rendering lists of elements. Avoid using array indices as keys if the list can change order or items can be inserted/deleted.

## 5. Styling (Tailwind CSS & Design System)

- **Utility-First**: Embrace Tailwind's utility-first approach for styling.
- **Theme Configuration**: Define design tokens (colors, spacing, typography) in `tailwind.config.ts` and `globals.css` (`@theme`). Avoid hardcoding magic values in utility classes.
- **Consistency**: Adhere strictly to the established Design System (see `.agent/plans/design-system-plan.md` and eventually `docs/DESIGN_SYSTEM.md`).
- **Component Abstraction**: For complex or repeated UI patterns, extract reusable components styled with Tailwind utilities, potentially using `@apply` sparingly within component-specific CSS (or CSS Modules) if necessary, but prefer composing utilities directly.
- **CSS Modules**: Use CSS Modules for component-scoped styles that are difficult or verbose to achieve with utilities alone (e.g., the planned integration of `retro.css` animations).
- **Shadcn UI**: Leverage Shadcn UI components, customizing them via the theme configuration and utility classes where needed.

## 6. Code Quality & Maintainability

- **Readability**: Write clear, concise, and self-explanatory code. Use meaningful variable and function names.
- **Formatting & Linting**: Adhere strictly to the configured ESLint and Prettier rules. Ensure these are run automatically (e.g., via Husky pre-commit hooks).
- **Modularity**: Keep functions and components focused on a single responsibility (Single Responsibility Principle).
- **DRY (Don't Repeat Yourself)**: Avoid duplicating code; extract reusable logic into functions, hooks, or components.
- **Comments**: Write comments only when necessary to explain _why_ something is done a certain way, not _what_ the code does (the code should explain the 'what'). Consider JSDoc for complex functions or public APIs.
- **Dependency Management**: Keep dependencies up-to-date (use `pnpm up --latest`). Review dependencies before adding them.

## 7. Version Control & Collaboration

- **Git Workflow**: Use a standard Git workflow (e.g., feature branches, pull requests).
- **Commit Messages**: Follow the Conventional Commits specification (enforced by `commitlint`). Write clear and concise commit messages.
- **Pull Requests (PRs)**: Keep PRs small and focused on a single feature or fix. Include clear descriptions and link to relevant issues or plan documents. Code reviews are encouraged.

## 8. Security

- **Secrets Management**: Never commit secrets (API keys, database URLs) directly to the repository. Use environment variables (`.env`) and Vercel's environment variable management.
- **Input Validation**: Validate all external inputs (API requests, user input) using Zod schemas.
- **Cross-Site Scripting (XSS)**: Be mindful of XSS vulnerabilities. React automatically escapes content rendered in JSX, but be careful when using `dangerouslySetInnerHTML` (avoid if possible) or injecting content in other ways.
- **Dependencies**: Regularly audit dependencies for known vulnerabilities (`pnpm audit`).

## 9. Accessibility (A11y)

- **Semantic HTML**: Use appropriate HTML5 elements (e.g., `<nav>`, `<main>`, `<article>`, `<aside>`, `<button>`) to convey structure and meaning.
- **WCAG Compliance**: Aim for WCAG 2.1 AA compliance.
- **Keyboard Navigation**: Ensure all interactive elements are focusable and operable via keyboard. Maintain logical focus order.
- **ARIA Attributes**: Use ARIA (Accessible Rich Internet Applications) attributes where necessary to enhance accessibility for complex widgets or dynamic content, but prefer native HTML elements when possible.
- **Color Contrast**: Ensure sufficient contrast between text and background colours as defined in the design system tokens.
- **Testing**: Use browser accessibility tools (e.g., Lighthouse, Axe DevTools) and manual testing (keyboard navigation, screen reader checks) to verify accessibility.

## 10. Error Handling Best Practices

Robust error handling is essential for maintainability, debugging, and user experience. Treat observability as a first-class concern.

*   **Never Swallow Errors:** Avoid empty `catch` blocks or catching errors without logging or re-throwing them appropriately. Unhandled exceptions should ideally crash the process (in a controlled way) or be reported, not ignored.
*   **Preserve Context:** When catching and re-throwing errors, wrap the original error to preserve the stack trace and context. Use the `cause` property in `Error` objects (ES2022+) where possible.
    ```typescript
    try {
      // ... operation that might fail
    } catch (originalError) {
      logger.error('Operation failed:', { cause: originalError });
      throw new Error('Failed to complete the operation.', { cause: originalError });
    }
    ```
*   **Structured Logging for Errors:** Log errors with as much context as possible (e.g., request ID, user ID if applicable, relevant data, stack trace). Use a structured logging format (JSON) to make logs easily searchable and parsable by monitoring tools.
*   **Use Specific Error Types:** Create custom error classes (extending `Error`) for different types of application errors (e.g., `ValidationError`, `DatabaseError`, `AuthorizationError`). This allows for more granular error handling.
*   **Distinguish Error Types:** Understand the difference between:
    *   **Operational Errors:** Runtime problems whose outcomes are reasonably expected (e.g., API unavailable, invalid user input, database timeout). These should generally be handled gracefully.
    *   **Programmer Errors:** Bugs in the code (e.g., null pointer exceptions, type errors, logic flaws). These often indicate a need for a code fix and might warrant crashing the process or alerting developers immediately.
*   **React Error Boundaries:** Use React Error Boundaries to catch JavaScript errors in UI components, log them, and display a fallback UI instead of crashing the entire component tree. Place them strategically around parts of the UI that might fail independently.
*   **React Suspense for Data Loading:** Use `<Suspense>` boundaries to handle loading states for asynchronous operations (like data fetching) and display fallback UI (e.g., spinners) gracefully.
*   **API Route Error Handling:**
    *   Return meaningful and consistent error responses (e.g., a standard JSON structure like `{ "error": "message", "details": { ... } }`).
    *   Use appropriate HTTP status codes (e.g., 400 for bad requests/validation errors, 401 for unauthorized, 403 for forbidden, 404 for not found, 500 for generic server errors).
    *   Avoid leaking sensitive internal details (like stack traces) in production API error responses.
*   **Graceful Degradation:** Design systems to handle failures in non-critical parts without bringing down the entire application.
*   **Plan for Observability Tools:** While not implementing immediately, design logging and error handling with future integration of tools like Sentry, Datadog, or LogRocket in mind. Ensure logs contain sufficient information for these tools to be effective.

## 11. Code Quality and Maintainability

*   **Modularity:** Break down code into small, reusable components and functions with clear responsibilities.

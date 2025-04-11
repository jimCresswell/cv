# Project: Jim Cresswell's Personal Website (jimcresswell.net)

## Goal

Build and maintain Jim Cresswell's personal website, currently featuring a homepage and a CV page. The site uses modern web technologies, focusing on maintainability, performance, and accessibility.

## Original CV Context

The previous version of the CV exists in the `reference/original-site` directory. Key characteristics of the original site include:

## Technology Stack

- **Framework:** Next.js 15.3.0 (App Router)
- **UI Library:** React 19.1.0
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.1.3 (with custom theme variables in `globals.css`)
- **UI Components:** Radix UI Primitives (`DropdownMenu`, `Slot`), `lucide-react` for icons
- **Utilities:** `clsx`, `tailwind-merge`, `tailwindcss-animate`
- **Package Manager:** pnpm
- **Testing:** Vitest
- **Linting/Formatting:** ESLint, Commitlint, Husky

## Project Structure (`src/`)

- `app/`: Contains the Next.js routes, layouts, and pages.
- `components/`: Reusable React components (e.g., `header.tsx`, `cv-content.tsx`, UI primitives).
- `data/`: Holds the primary data source for the CV content (`cv-data.ts`).
- `fonts/`: Local font files.
- `lib/`: Utility functions, potentially including helpers like `cn`.
- `util/`: Other utility functions.

## Key Data Sources

- CV Content: `src/data/cv-data.ts`

## Current Status & Key Tasks (from README.md)

- **Refinement:** Fix spacing issues, improve button appearance, refactor dropdown component.
- **Code Quality:** Migrate inline scripts, implement local fonts, add header navigation, resolve client-side theme hydration, setup Winston logging, configure ESLint rules (filenames, import order, etc.).
- **CV Specific:** Review content, check links, drastically improve print formatting, ensure semantic HTML and accessibility.
- **Future:** Define and build out the home page, potentially add a chatbot feature.

## Note

_This summary is based on the project files as of 2025-04-11. It should be updated periodically as the project evolves._

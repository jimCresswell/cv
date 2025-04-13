# Project: Jim Cresswell's Personal Website (@jimcresswell/personal-site)

## Goal

Build and maintain Jim Cresswell's personal website (`jimcresswell.net`), focusing on a modern, maintainable, performant, and accessible implementation. Key features include a dynamic CV section and potentially blog/portfolio content.

## Technology Stack

- **Framework:** Next.js `15.3.0` (App Router)
- **UI Library:** React `19.1.0`
- **Language:** TypeScript (Strict)
- **Styling:**
  - Tailwind CSS `4.1.3` (via `@tailwindcss/postcss`)
  - Custom theme variables (`globals.css`)
  - `tailwindcss-animate` (`^1.0.7`)
- **UI Components/Methodology:**
  - Shadcn UI methodology
  - Radix UI Primitives (e.g., `@radix-ui/react-dropdown-menu` `^2.1.6`, `@radix-ui/react-slot` `^1.1.2`)
  - `lucide-react` (`^0.487.0`) for icons
- **State Management:** Primarily local state/Context, Zustand if needed (TBD)
- **Data Validation:** Zod (Planned/Used for runtime validation)
- **Data Layer:** Prisma & PostgreSQL (Planned)
- **Utilities:**
  - `clsx` (`^2.1.1`)
  - `tailwind-merge` (`^3.2.0`)
- **Package Manager:** pnpm
- **Testing:** Vitest & React Testing Library
- **Linting/Formatting:** ESLint, Prettier, Commitlint, Husky
- **Deployment:** Vercel (Assumed)

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

_This summary is based on the project files as of 2025-04-13. It should be updated periodically as the project evolves._

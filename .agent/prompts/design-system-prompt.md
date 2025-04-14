# Prompt: Implement Design System

## 1. Objective

Execute the plan outlined in `.agent/plans/design-system-plan.md` to create a unified, accessible, and maintainable design system based on Tailwind CSS v4 for the `@jimcresswell/personal-site` project. Key goals include unifying styling across the site, preserving specific animations from the legacy `retro.css`, and ensuring adherence to established project best practices.

## 2. Core Principles & Constraints

Strictly adhere to the guidelines defined in `.agent/best-practices.md` throughout this process. Pay special attention to:

- **Quality Assurance:** Run `pnpm type-check`, `pnpm lint`, and `pnpm test` frequently after changes.
- **Accessibility (A11y):** Ensure WCAG 2.1 AA compliance (semantic HTML, keyboard nav, contrast, ARIA where needed). Test using browser tools.
- **Testing:** Use TDD where practical (Vitest + RTL). Focus on component rendering, props, and interactions.
- **TypeScript:** Strict mode, use Zod for validation -> infer types, **NO `as` assertions**, explicit prop/function types.
- **Styling:** Tailwind utility-first, theme adherence (`@theme` in `globals.css`), component abstraction. Use CSS Modules for complex/scoped styles (like retro animations). Consider Shadcn UI components, customize via theme/utilities.
- **Code Quality:** Readability, ESLint/Prettier adherence, Modularity (SRP), DRY, JSDoc for complex components.
- **Error Handling:** Follow established patterns (Error Boundaries, structured logging, throw only `Error` objects).
- **File Naming:** Use **kebab-case** for all new files.
- **Next.js/React:** Use RSCs by default, client components selectively, composition over inheritance, etc.

## 3. Implementation Steps (Summary - Refer to Plan for Details)

1.  **Define/Refine Tailwind Tokens:** Review/finalize colors, typography, spacing within the `@theme` directive in `globals.css`. Ensure A11y contrast.
2.  **Extract & Integrate Root Page Styles:** Isolate essential `retro.css` styles (esp. `#main-title` animations) and integrate using CSS Modules or a Tailwind Plugin. Refactor `h1#main-title` markup if needed.
3.  **Update Main Layout (`layout.tsx`):** Apply shared design tokens.
4.  **Update CV Page (`/cv`):** Refactor components to use the design system strictly. Check print styles.
5.  **Update Root Page (`page.tsx`):** Remove `retro.css` import. Apply shared system + integrated retro styles. Verify animations.
6.  **Add Navigation Bar (`navigation.tsx`):** Create, style, and add to layout.
7.  **Document (`docs/DESIGN_SYSTEM.md`):** Document tokens, components, usage.

## 4. Starting Point

Let's begin with **Step 1: Define/Refine Shared Tailwind Tokens**. Please review the current `globals.css` file, focusing on the `@theme` block and the root variable definitions.

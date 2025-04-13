# Design System Plan

## Current State

The project currently utilizes two distinct styling methods:

1.  **Root Page (`/`)**: Imports `src/app/retro.css` directly in `src/app/page.tsx`. This file contains legacy CSS, including unique, responsive animations (transforms, letter-spacing) for the main title (`h1#main-title` via `#s0`-`#s12` IDs) and specific layout rules. The colour scheme needs updating for accessibility and consistency.
2.  **CV Page (`/cv`) & Layout**: Uses Tailwind CSS, configured via `src/app/globals.css` and applied through `src/app/layout.tsx`. This defines the base theme (light/dark modes, colours, etc.) and provides utility classes, often alongside Shadcn UI components.

This leads to inconsistency in styling, theming, and maintenance approaches.

## Target State

A single, unified design system based on **Tailwind CSS** will be used across the entire application (root page, CV page, layout). Key goals:

*   **Consistency**: Shared colours, typography, spacing, and component styles defined in `globals.css` and Tailwind configuration.
*   **Maintainability**: Centralized styling logic using modern CSS practices.
*   **Accessibility**: Adherence to WCAG AA standards (contrast, semantics, keyboard navigation).
*   **Theming**: Robust support for light and dark modes.
*   **Preserve Root Page Animations**: The unique, responsive animations for `h1#main-title` from `retro.css` must be preserved, but integrated into the new system.
*   **Deprecate `retro.css`**: The direct import and usage of `retro.css` will be removed.

## Implementation Plan

This plan follows best practices, including accessibility checks and TDD principles where applicable.

1.  **Define/Refine Shared Tailwind Tokens**:
    *   Review and finalize colour palettes (primary, secondary, accent, background, foreground, etc.) in `globals.css` for both light and dark modes. Ensure sufficient contrast ratios (WCAG AA).
    *   Define typography scales (font sizes, weights, line heights) using the current `Inter` font.
    *   Establish consistent spacing units.
    *   *(Best Practice: Use Tailwind's theme configuration extensively)*.
    *   *(Alignment: Ensure defined tokens harmonize with existing Shadcn UI component styles and conventions)*.

2.  **Extract & Integrate Root Page Styles**:
    *   **Identify**: Isolate the specific CSS rules from `retro.css` responsible for:
        *   The `h1#main-title` animations (responsive `transform`, `letter-spacing` applied to `#s0`-`#s12`).
        *   Essential layout structure previously handled by `#me` and related selectors, if not easily replicable with standard Tailwind utilities.
    *   **Integrate**: Incorporate these extracted styles into the project, **without** using the `retro.css` file directly. Potential approaches:
        *   **CSS Modules**: Create a `HomePage.module.css` (or similar) imported only by `src/app/page.tsx`, containing the extracted styles. This scopes the styles locally.
        *   **Tailwind Plugin/Component**: If feasible, define custom Tailwind utilities or components that encapsulate these styles.
        *   *(Avoid: Adding complex, non-utility styles directly to `globals.css`)*.
    *   **Refactor Title**: Update the `h1#main-title` structure in `src/app/page.tsx` if needed to work better with the integrated styles (e.g., apply styles via CSS module classes instead of IDs).
    *   *(Specificity Management: Aim to reduce reliance on high-specificity selectors like IDs where possible, favouring class-based approaches suitable for Tailwind)*.

3.  **Update Main Layout (`layout.tsx`)**:
    *   Ensure the layout fully utilizes the shared design tokens (colours, spacing) from Tailwind.
    *   Verify consistent header/footer/navigation styling in both light and dark modes.
    *   Check keyboard navigation and focus states.

4.  **Update CV Page (`/cv`)**:
    *   Refactor components on the CV page to strictly use the shared Tailwind design system (utilities, theme variables, potentially shared components).
    *   Ensure consistency in spacing, typography, and colour usage with the rest of the site.
    *   Verify print styles (`@media print` in `globals.css`) render the CV acceptably.
    *   *(TDD Approach: Add/update tests for CV components to ensure functionality isn't broken by style changes. Consider visual snapshot testing if setup.)*

5.  **Update Root Page (`page.tsx`)**:
    *   **Remove** the `import "@/app/retro.css";` line.
    *   Apply the shared Tailwind design system for general styling (background, text colour, spacing, links) using utility classes.
    *   Apply the *extracted* and *integrated* styles (from Step 2) for the `h1#main-title` animations and specific layout needs.
    *   **Verify**: Test thoroughly that the title animations work correctly across various viewport sizes (width and height breakpoints defined in the original `retro.css`). Consider visual regression testing if feasible.
    *   Ensure consistent look and feel with the layout and CV page (colours, fonts).
    *   Perform accessibility checks (contrast, keyboard navigation).

6.  **Document the Design System**:
    *   Create a dedicated documentation file: `docs/DESIGN_SYSTEM.md`.
    *   Populate it with details about the finalized colour palettes, typography scales, spacing units, and any custom components or conventions established.
    *   Add a section to the main `README.md` referencing the design system and linking to `docs/DESIGN_SYSTEM.md`.

## Guiding Principles & Best Practices

*   **Accessibility (A11y)**: Maintain WCAG 2.1 AA compliance. Regularly check colour contrast, use semantic HTML, ensure keyboard navigability, and test with screen readers.
*   **Test-Driven Development (TDD)**: Apply TDD principles for component logic. For UI, use component tests (e.g., Vitest + Testing Library) to verify rendering and state. Consider visual regression testing for style consistency.
*   **TypeScript**: Use strict type checking. Prefer type guards over type assertions (`as`). Leverage TypeScript for component props and state.
*   **Canonical Practices**: Follow established best practices for Next.js (App Router), React (Server/Client Components), Tailwind CSS v4, Shadcn UI, and CSS Modules (if used).
*   **Code Quality**: Use ESLint and Prettier for consistent code style and quality checks.
*   **Specificity & Maintainability**: Prefer utility classes and low-specificity selectors where possible. Keep CSS organized and avoid overriding styles unnecessarily.
*   **Incremental Changes**: Implement changes step-by-step, testing frequently across different browsers/devices.
*   **Documentation**: Keep design system documentation up-to-date as the system evolves.

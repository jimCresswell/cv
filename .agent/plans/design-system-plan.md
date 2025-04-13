# Design System Plan

## Current State

The project currently utilizes two distinct styling methods:

1.  **Root Page (`/`)**: Imports `src/app/retro.css` directly in `src/app/page.tsx`. This file contains legacy CSS, including unique, responsive animations (transforms, letter-spacing) for the main title (`h1#main-title` via `#s0`-`#s12` IDs) and specific layout rules. The colour scheme needs updating for accessibility and consistency.
2.  **CV Page (`/cv`) & Layout**: Uses Tailwind CSS, configured via `src/app/globals.css` and applied through `src/app/layout.tsx`. This defines the base theme (light/dark modes, colours, etc.) and provides utility classes, often alongside Shadcn UI components.

This leads to inconsistency in styling, theming, and maintenance approaches.

## Target State

A single, unified design system based on **Tailwind CSS** will be used across the entire application (root page, CV page, layout). Key goals:

- **Consistency**: Shared colours, typography, spacing, and component styles defined in `globals.css` and Tailwind configuration.
- **Maintainability**: Centralized styling logic using modern CSS practices.
- **Accessibility**: Adherence to WCAG AA standards (contrast, semantics, keyboard navigation).
- **Theming**: Robust support for light and dark modes.
- **Preserve Root Page Animations**: The unique, responsive animations for `h1#main-title` from `retro.css` must be preserved, but integrated into the new system.
- **Deprecate `retro.css`**: The direct import and usage of `retro.css` will be removed.

## Design System Implementation Plan for personal-site

**Status:** In Progress

**Goal:** Create a unified, accessible, and maintainable design system using Tailwind CSS (v4) and potentially Shadcn UI components, while preserving specific keyframe animations from the legacy `retro.css`.

**Reference:** This plan should be implemented following the guidelines in `.agent/best-practices.md`.

**Core Principles:**

- **Consistency:** Ensure uniform look, feel, and interaction patterns across the site.
- **Maintainability:** Easy to update and extend the system.
- **Accessibility (A11y):** Adhere to WCAG 2.1 AA standards as a minimum. Components must be usable via keyboard, screen readers, and meet contrast requirements. Follow principles outlined in `best-practices.md#9-accessibility-a11y`.
- **Developer Experience:** Clear documentation and easy-to-use components.
- **Performance:** Optimized styles and components.
- **Best Practice Alignment:** Strictly follow guidelines in `.agent/best-practices.md` regarding testing, TypeScript, styling, code quality, and security.

## Implementation Plan

This plan follows best practices, including accessibility checks and TDD principles where applicable.

1.  **Define/Refine Shared Tailwind Tokens**:

    - Review and finalize colour palettes (primary, secondary, accent, background, foreground, etc.) in `globals.css` for both light and dark modes. Ensure sufficient contrast ratios (WCAG AA).
    - Define typography scales (font sizes, weights, line heights) using the current `Inter` font.
    - Establish consistent spacing units.
    - _(Best Practice: Use Tailwind's theme configuration extensively)_.
    - _(Alignment: Ensure defined tokens harmonize with existing Shadcn UI component styles and conventions)_.

2.  **Extract & Integrate Root Page Styles**:

    - **Identify**: Isolate the specific CSS rules from `retro.css` responsible for:
      - The `h1#main-title` animations (responsive `transform`, `letter-spacing` applied to `#s0`-`#s12`).
      - Essential layout structure previously handled by `#me` and related selectors, if not easily replicable with standard Tailwind utilities.
    - **Integrate**: Incorporate these extracted styles into the project, **without** using the `retro.css` file directly. Potential approaches:
      - **CSS Modules**: Create a `HomePage.module.css` (or similar) imported only by `src/app/page.tsx`, containing the extracted styles. This scopes the styles locally.
      - **Tailwind Plugin/Component**: If feasible, define custom Tailwind utilities or components that encapsulate these styles.
      - _(Avoid: Adding complex, non-utility styles directly to `globals.css`)_.
    - **Refactor Title**: Update the `h1#main-title` structure in `src/app/page.tsx` if needed to work better with the integrated styles (e.g., apply styles via CSS module classes instead of IDs).
    - _(Specificity Management: Aim to reduce reliance on high-specificity selectors like IDs where possible, favouring class-based approaches suitable for Tailwind)_.

3.  **Update Main Layout (`layout.tsx`)**:

    - Ensure the layout fully utilizes the shared design tokens (colours, spacing) from Tailwind.
    - Verify consistent header/footer/navigation styling in both light and dark modes.
    - Check keyboard navigation and focus states.

4.  **Update CV Page (`/cv`)**:

    - Refactor components on the CV page to strictly use the shared Tailwind design system (utilities, theme variables, potentially shared components).
    - Ensure consistency in spacing, typography, and colour usage with the rest of the site.
    - Verify print styles (`@media print` in `globals.css`) render the CV acceptably.
    - _(TDD Approach: Add/update tests for CV components to ensure functionality isn't broken by style changes. Consider visual snapshot testing if setup.)_

5.  **Update Root Page (`page.tsx`)**:

    - **Remove** the `import "@/app/retro.css";` line.
    - Apply the shared Tailwind design system for general styling (background, text colour, spacing, links) using utility classes.
    - Apply the _extracted_ and _integrated_ styles (from Step 2) for the `h1#main-title` animations and specific layout needs.
    - **Verify**: Test thoroughly that the title animations work correctly across various viewport sizes (width and height breakpoints defined in the original `retro.css`). Consider visual regression testing if feasible.
    - Ensure consistent look and feel with the layout and CV page (colours, fonts).
    - Perform accessibility checks (contrast, keyboard navigation).

6.  **Document the Design System**:
    - Create a dedicated documentation file: `docs/DESIGN_SYSTEM.md`.
    - Populate it with details about the finalized colour palettes, typography scales, spacing units, and any custom components or conventions established.
    - Add a section to the main `README.md` referencing the design system and linking to `docs/DESIGN_SYSTEM.md`.

### 2. Define Core Styling Approach

- **Tailwind Utility-First:** Primarily use Tailwind utility classes directly in components, adhering to the utility-first principle outlined in `best-practices.md#5-styling-tailwind-css--design-system`.
- **Theme Adherence:** Strictly use defined theme tokens (colors, spacing, typography) from `tailwind.config.ts` and `globals.css` (`@theme`). Avoid magic numbers or one-off styles.
- **`retro.css` Integration:**
  - Identify essential animations (e.g., `#main-title` animation).
  - Extract these specific styles into a separate, scoped CSS Module (e.g., `src/components/retro-animations/retro-animations.module.css`) or investigate Tailwind plugins if appropriate.
  - Import and apply these scoped styles only where needed.
  - **Deprecate** the global import of `retro.css` in `page.tsx` once styles are migrated.
- **Shadcn UI (Consideration):** Evaluate Shadcn UI components for common patterns (Buttons, Inputs, Modals, etc.). Customize them via theme configuration and utility overrides to match the design system. Follow `best-practices.md` for leveraging Shadcn.
- **Component Abstraction:** Create reusable React components for common UI elements/patterns, styled using the defined system. Apply Tailwind utilities within these components.

### 4. Component Development

- Develop core reusable components based on identified patterns (e.g., `Button`, `Card`, `Typography` variants, `Link`).
- **Props:** Define clear and explicit TypeScript prop types (using interfaces/types, potentially derived from Zod schemas if applicable for data-driven components) as per `best-practices.md#2-typescript--type-safety`.
- **Styling:** Style components using the defined Tailwind theme and utility classes.
- **Accessibility:** Ensure components are built with accessibility in mind from the start (semantic HTML, ARIA attributes where necessary, keyboard navigation, focus states).
- **Testing:** Write unit tests for each component using **Vitest and React Testing Library**, focusing on rendering, props, state changes, and user interactions, following the TDD approach where feasible as outlined in `best-practices.md#1-testing`.

### 5. Documentation

- Create `docs/DESIGN_SYSTEM.md`.
- Document core principles, theme tokens (colors, typography, spacing), component usage examples, and accessibility guidelines.
- Use tools like Storybook if component complexity grows significantly (future consideration).
- Reference the main `best-practices.md` where applicable.
- **Component Documentation:** Add JSDoc comments to complex components explaining their purpose, props, and usage, as recommended in `best-practices.md#6-code-quality--maintainability`.

## Guiding Principles & Best Practices

- **Accessibility (A11y)**: Maintain WCAG 2.1 AA compliance. Regularly check colour contrast, use semantic HTML, ensure keyboard navigability, and test with screen readers.
- **Test-Driven Development (TDD)**: Apply TDD principles for component logic. For UI, use component tests (e.g., Vitest + Testing Library) to verify rendering and state. Consider visual regression testing for style consistency.
- **TypeScript**: Use strict type checking. Prefer type guards over type assertions (`as`). Leverage TypeScript for component props and state.
- **Canonical Practices**: Follow established best practices for Next.js (App Router), React (Server/Client Components), Tailwind CSS v4, Shadcn UI, and CSS Modules (if used).
- **Code Quality**: Use ESLint and Prettier for consistent code style and quality checks.
- **Specificity & Maintainability**: Prefer utility classes and low-specificity selectors where possible. Keep CSS organized and avoid overriding styles unnecessarily.
- **Incremental Changes**: Implement changes step-by-step, testing frequently across different browsers/devices.
- **Documentation**: Keep design system documentation up-to-date as the system evolves.

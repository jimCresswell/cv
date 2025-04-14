# Design System (@jimcresswell/personal-site)

This document outlines the design system principles and implementation details for the `@jimcresswell/personal-site` project.

## 1. Philosophy

The design system is built upon **Tailwind CSS v4**, embracing a **utility-first** approach. The goal is to create a consistent, accessible, and maintainable visual language across the application.

Key principles include:

- **Theme-based:** Core design tokens (colors, border radius) are defined as CSS custom properties within `src/app/globals.css` under the `@theme` directive and in `:root` / `.dark` selectors.
- **Utility-First:** Components are primarily styled using Tailwind utility classes.
- **Accessibility:** Strive for WCAG 2.1 AA compliance.
- **Consistency:** Ensure components and pages share a unified look and feel.

## 2. Core Tokens

Tokens are defined in `src/app/globals.css`.

### 2.1. Colors

- Defined using HSL values in CSS variables within `:root` (light theme) and `.dark` scopes.
- Mapped to semantic Tailwind theme keys (`--color-background`, `--color-foreground`, `--color-primary`, `--color-secondary`, `--color-muted`, `--color-accent`, `--color-destructive`, `--color-border`, etc.) via the `@theme` directive.
- Components should use these theme variables via Tailwind utilities (e.g., `bg-background`, `text-primary`, `border-border`).

### 2.2. Border Radius

- Defined using CSS variables (`--radius`, `--radius-sm`, `--radius-md`, `--radius-lg`) relative to a base radius.
- Mapped to Tailwind theme keys (`--radius-sm`, `--radius-md`, `--radius-lg`) via the `@theme` directive.
- Applied using Tailwind utilities like `rounded-md`.

## 3. Typography

- **Font:** Primarily uses the `Inter` font family, configured in `src/app/layout.tsx`.
- **Sizing & Styling:** Relies primarily on Tailwind's default type scale and utility classes (e.g., `text-base`, `text-lg`, `text-xl`, `font-semibold`).
- Base paragraph (`p`) styles and heading styles (`h1`, `h2`, etc.) for screen and print are defined in `src/app/globals.css`.

## 4. Spacing

- Relies on Tailwind's default spacing scale, applied via margin (`m-*`, `mx-*`, `my-*`, etc.), padding (`p-*`, `px-*`, `py-*`, etc.), and gap (`gap-*`) utilities.
- Layout components like `CVContent` use `space-y-*` for vertical rhythm.

## 5. Component Styling

- Components (`src/components/*`) should be styled using Tailwind utility classes, adhering to the defined theme tokens.
- Shared, reusable UI elements like `Button` (from `src/components/ui/button.tsx`, likely Shadcn UI based) are used where appropriate.
- Custom components are built composing Tailwind utilities.

## 6. Handling Specific/Legacy Styles

- For highly specific, non-reusable styles (like the homepage title animation), **CSS Modules** are used (e.g., `src/app/home-page.module.css`). This encapsulates the styles and prevents global scope pollution.
- The legacy `retro.css` file has been removed in favor of this CSS Modules approach for the home page.

## 7. Print Styles

- Base print styles are defined in `src/app/globals.css` using `@media print`.
- Component-specific print adjustments are made using Tailwind's `print:` variants (e.g., `print:hidden`, `print:text-sm`, `print:space-y-2`).

## 8. Accessibility

A review of the theme's color contrast was performed on 2025-04-14.

- **Findings:**
  - Most color combinations meet WCAG AA contrast requirements.
  - The light theme's `muted-foreground` color requires adjustment due to insufficient contrast.
  - Some combinations (light destructive, dark primary) are borderline for small text and warrant review in context.
  - Focus indicators and reduced motion support need further verification and implementation.
- **Plan:** A detailed plan for accessibility improvements, including contrast fixes, focus style reviews, reduced motion implementation, and tooling integration, is documented in `../.agent/plans/accessibility-improvements-plan.md`.

## 9. Future Considerations

Consider integrating tools like Storybook for component visualization and automated accessibility testing libraries (`axe-core`) into the workflow as the system grows.

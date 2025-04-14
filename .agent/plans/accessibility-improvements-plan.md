# Accessibility Improvements Plan

This document outlines planned improvements to enhance the accessibility of the `@jimcresswell/personal-site` project, based on the review conducted on 2025-04-14.

## 1. Color Contrast Remediation

- **Issue:** The `--muted-foreground` color in the light theme (`hsl(215.4 16.3% 46.9%)`) has insufficient contrast (2.6:1 and 3.2:1) against `--muted` and `--background` respectively, failing WCAG AA guidelines for normal text.
- **Action:** Darken the `--muted-foreground` color in the light theme (`:root` scope in `src/app/globals.css`) to meet the 4.5:1 contrast ratio.
  - **Status:** To be implemented.
- **Issue:** The `--primary-foreground` on `--primary` in the dark theme (approx. 3.8:1) and `--destructive-foreground` on `--destructive` in the light theme (approx. 3.9:1) are borderline for normal-sized text (WCAG AA requires 4.5:1).
- **Action:** Manually review components using these color combinations for small text. If small text is common, adjust the HSL values slightly to improve contrast.
  - **Status:** Pending review.

## 2. Focus Indicator Review

- **Issue:** While default focus indicators exist, they need verification across all components and background combinations.
- **Action:** Systematically review `:focus-visible` styles for all interactive elements (buttons, links, inputs) against their various backgrounds (background, card, primary, etc.) in both light and dark themes. Ensure the focus indicator is always clearly visible and has sufficient contrast.
  - **Status:** Pending review.

## 3. Reduced Motion Support

- **Issue:** CSS animations (e.g., homepage title animation in `src/app/home-page.module.css`) do not currently respect user preferences for reduced motion.
- **Action:** Wrap relevant CSS animation rules within `@media (prefers-reduced-motion: reduce)` media queries to disable or minimize animations for users who prefer reduced motion.
  - **Status:** To be implemented.

## 4. Automated Accessibility Testing

- **Issue:** Lack of automated checks for accessibility issues during development and testing.
- **Action:** Integrate accessibility testing tools into the development workflow:
  - Add and configure `eslint-plugin-jsx-a11y` to the ESLint setup for static analysis.
  - Add and configure `vitest-axe` (using `axe-core`) within the Vitest test suite to catch violations in component tests.
  - **Status:** To be implemented.

## 5. Ongoing Review

- **Action:** Regularly perform manual accessibility audits, especially when adding new components or significantly changing styles. Use browser developer tools and accessibility testing tools.
  - **Status:** Ongoing process.

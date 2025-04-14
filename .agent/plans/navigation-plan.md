# Responsive & Accessible Navigation Plan

## 1. Goal

Implement a responsive, accessible, and keyboard-navigable navigation system for the application, including a standard horizontal navigation bar for larger screens and a hamburger menu for smaller screens. This plan adheres to the project's [Best Practices](../best-practices.md).

## 2. Scope

- Modify the existing `NavigationBar` component (`src/components/navigation-bar.tsx`).
- Create a new `MobileMenu` component (`src/components/mobile-menu.tsx`).
- Create a new `SkipToContentLink` component (`src/components/skip-to-content-link.tsx`).
- Update the main layout (`src/app/layout.tsx`) to integrate these components and add necessary IDs.
- Add associated tests.

## 3. Plan Details

### Task 3.1: Prepare Components & Types

- **Define Shared Link Data:** Create a shared type or constant for navigation links (e.g., `const navLinks = [{ href: '/', label: 'Home' }, { href: '/cv', label: 'CV' }]`) to ensure consistency between `NavigationBar` and `MobileMenu`. Place this in a suitable shared location (e.g., `src/lib/constants/navigation.ts`).
- **Define Prop Types:** Define clear TypeScript interfaces/types for the props of each new/modified component.
- **Status: Completed**

### Task 3.2: Implement "Skip to Content" Link

- **Create Component:** Create `src/components/skip-to-content-link.tsx`.
- **Functionality:** This component will render a link (`<a>`) that targets the main content area.
- **Styling:** Use Tailwind utilities to make the link visually hidden by default but visible and positioned appropriately when focused (e.g., using `sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:p-2 focus:bg-background focus:text-foreground focus:z-50`).
- **Target:** The link's `href` should point to `#main-content`.
- **Integration:** Add `<SkipToContentLink />` as the very first focusable element within the `<body>` in `src/app/layout.tsx`.
- **Status: Completed**

### Task 3.3: Make `NavigationBar` Responsive

- **Refactor Component:** Modify `src/components/navigation-bar.tsx`.
- **Responsive Visibility:** Wrap the `<ul>` or container holding the navigation links. Use Tailwind utilities to hide this container on small screens and display it (e.g., as `flex`) on medium screens and up (e.g., `hidden md:flex md:gap-4`).
- **Keyboard Navigation:** Ensure the links within the visible bar remain keyboard focusable and navigable in a logical order.
- **Accessibility:** The component should be wrapped in a `<nav>` element with an appropriate `aria-label` (e.g., "Main Navigation").
- **Status: Completed**

### Task 3.4: Create `MobileMenu` Component

- **Create Component:** Create `src/components/mobile-menu.tsx` (using kebab-case filename as per best practices).
- **Client Component:** Mark with `"use client"` as it will require state and effects.
- **State:** Use `useState` to manage the open/closed state of the menu.
- **Hamburger Button:**
  - Implement a `<button>` element.
  - Use an accessible SVG icon (e.g., hamburger icon for open, close icon 'X' for close).
  - Add `aria-label` (e.g., "Open main menu", "Close main menu" depending on state).
  - Add `aria-expanded` attribute bound to the open/closed state.
  - Add `aria-controls="mobile-menu-panel"` (linking to the menu panel).
  - Ensure it's hidden on medium screens and up (`md:hidden`).
- **Menu Panel:**
  - Create a container (`div` or `<nav>`) with `id="mobile-menu-panel"`.
  - Style it to appear when the menu is open (e.g., absolutely positioned, full width/height, appropriate background color).
  - Render the shared navigation links vertically within this panel.
  - Ensure it's visually hidden when the menu is closed.
- **Escape Key Dismissal:** Use `useEffect` to add a keydown event listener to the `document` when the menu is open. If the Escape key is pressed, close the menu. Remember to clean up the listener.
- **Focus Trapping:** Implement focus trapping within the menu when it is open. When the menu opens, focus should move to the first focusable element inside. Tabbing should cycle through focusable elements within the menu only. Shift+Tab should also cycle correctly. Focus should return to the hamburger button when the menu closes.
  - _Libraries:_ Consider using a lightweight library like `focus-trap-react` or implementing manually using `useEffect` and querying focusable elements (`element.querySelectorAll('a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])')`).
- **Accessibility:** Wrap the links section in a `<nav>` element with an `aria-label` (e.g., "Mobile Navigation").
- **Status: Completed** _(Note: Implemented using Radix UI `Dialog`, which handles state, focus trapping, and escape key dismissal automatically.)_

### Task 3.5: Integrate into `layout.tsx`

- **Main Content ID:** Add `id="main-content"` to the `<main>` element in `src/app/layout.tsx` for the skip link target.
- **Render Components:**
  - Render `<SkipToContentLink />` inside `<body>`, before the main `<header>`.
  - Render `<MobileMenu />` within the `<header>`, likely alongside the `ThemeToggle` and `PrintButton` or positioned appropriately for mobile views.
- **Layout Adjustments:** Ensure the header layout works correctly with the addition of the mobile menu button, potentially adjusting flexbox/grid properties.
- **Status: Completed**

### Task 3.6: Testing (TDD Approach)

- **`SkipToContentLink` Tests:** Verify it renders and is focusable, targeting the correct `href`.
- **`NavigationBar` Tests:** Verify responsive visibility (e.g., using simulated screen sizes if possible with testing library, or checking class application).
- **`MobileMenu` Tests:**
  - Test initial state (closed, button visible on small screens).
  - Test toggling open/closed via button click.
  - Verify `aria-expanded` updates correctly.
  - Verify menu panel appears/disappears.
  - Verify Escape key closes the menu.
  - Verify links are rendered correctly inside the open panel.
  - **(Advanced)** Test focus trapping behavior (first focus, tab cycle, shift+tab cycle, focus return on close).
- **Tools:** Use Vitest and React Testing Library.
- **Status: Completed**

### Task 3.7: Quality Assurance

- **Static Checks:** Run `pnpm type-check` and `pnpm lint`. Fix any issues.
- **Unit/Integration Tests:** Run `pnpm test`. Ensure all tests pass.
- **Manual Testing:**
  - **Responsiveness:** Check layout and visibility changes across different screen sizes (dev tools, resizing window).
  - **Keyboard Navigation:** Test tabbing through all elements (skip link, header buttons, nav links, mobile menu button, links inside mobile menu) in both light/dark modes. Verify logical focus order.
  - **Mobile Menu:** Test open/close, Esc key, link navigation.
  - **Focus Styles:** Ensure clear focus indicators on all interactive elements.
  - **Screen Reader Testing:** Use VoiceOver (macOS) or NVDA (Windows) to verify:
    - Skip link functionality.
    - Correct announcement of navigation regions (`<nav>` labels).
    - Correct announcement of button states (`aria-expanded`).
    - Navigability of links.
- **Status: Completed**

## 4. Best Practices Checklist

- [x] TDD: Plan includes specific testing steps.
- [x] TypeScript: Types defined for props and shared data.
- [x] Next.js App Router: Uses client components where needed (`MobileMenu`).
- [x] React: Component composition, state management (`useState`), effects (`useEffect`).
- [x] Styling: Adheres to Tailwind utility-first, theme integration.
- [x] Code Quality: Plan promotes modularity, comments where needed.
- [x] Version Control: Assumes standard feature branch workflow and Conventional Commits.
- [x] Accessibility: Specific tasks address semantic HTML, ARIA, keyboard navigation, focus management, skip link, screen reader support.
- [x] Error Handling: Implicitly covered by React/Next.js error boundaries, no complex error logic expected here.
- [x] File Naming: Specifies kebab-case for new components.

## 5. Definition of Done

- All tasks (3.1 - 3.7) are completed.
- All tests pass (`pnpm test`).
- All static checks pass (`pnpm type-check`, `pnpm lint`).
- Manual QA checks (responsiveness, keyboard, focus, screen reader) are satisfactory.
- This plan document is marked as complete in the main README.

---
**Completed:** 2025-04-14

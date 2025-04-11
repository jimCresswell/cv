# Theme Management Plan

This plan outlines the steps to replace the current custom theme management solution (light/dark/system toggle) with the standard [`next-themes`](https://www.npmjs.com/package/next-themes) library, ensuring proper integration with Next.js App Router and Tailwind CSS v4.

## Current State

- Custom JavaScript logic likely exists in `layout.tsx` or related components.
- A custom `ThemeProvider` might be in use (`src/components/theme-provider.tsx`).
- A custom theme toggle component exists (`src/components/theme-toggle.tsx`).
- Tailwind CSS (`src/app/globals.css`) is configured with CSS variables for light (`:root`) and dark (`.dark`) themes.

## Target State

- Theme management (light, dark, system) handled entirely by `next-themes`.
- Theme preference persisted via `localStorage` (default `next-themes` behavior).
- Theme respects system preference when selected.
- Tailwind's `dark:` variant works correctly based on the `class` applied by `next-themes`.
- Clean removal of all previous custom theme logic, scripts, and components.
- Accessible and functional theme toggle UI using `next-themes` hooks.
- Development follows Test-Driven Development (TDD) principles using Vitest and React Testing Library.

## Refined Plan

_Follow these steps sequentially. Run tests (`pnpm test`) frequently after relevant implementation steps._

### 1. Setup & Verification

1.  **Install Dependency:** Add `next-themes`.
    ```bash
    pnpm add next-themes
    ```

### 2. Implement Theme Provider (TDD)

1.  **(TDD) Test (Fail):** Write initial tests in `src/components/providers/theme-provider.unit.test.tsx`. Test cases should cover:
    - Rendering children components.
    - Applying a default theme attribute (initially, this might require mocking).
2.  **(TDD) Implement:** Create/Update `src/components/providers/theme-provider.tsx`.

    - Use `ThemeProvider` from `next-themes`.
    - Configure it according to the `next-themes` documentation for App Router:
      - Set `attribute="class"`.
      - Set `defaultTheme="system"`.
      - Set `enableSystem`.
      - Consider `storageKey` if customization is needed (default is fine).

    ```tsx
    // src/components/providers/theme-provider.tsx
    "use client";

    import * as React from "react";
    import { ThemeProvider as NextThemesProvider } from "next-themes";
    import type { ThemeProviderProps } from "next-themes/dist/types";

    export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
      return (
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange // Optional: recommended for smoother transitions
          {...props}
        >
          {children}
        </NextThemesProvider>
      );
    }
    ```

3.  **(TDD) Test (Pass):** Update tests in `theme-provider.unit.test.tsx` to pass, potentially mocking `next-themes` hooks/context if needed for isolated testing.
4.  **Integrate Provider:** Wrap the application layout in `src/app/layout.tsx` with the new `ThemeProvider`.

    ```tsx
    // src/app/layout.tsx
    import { ThemeProvider } from "@/components/providers/theme-provider";

    export default function RootLayout({ children }: { children: React.ReactNode }) {
      return (
        <html lang="en" suppressHydrationWarning>
          <body>
            <ThemeProvider>
              {/* Other providers/components */}
              {children}
            </ThemeProvider>
          </body>
        </html>
      );
    }
    ```

### 3. Implement Theme Toggle Component (TDD)

1.  **Analyze Existing Toggle:** Review `src/components/theme-toggle.tsx`. Identify:
    *   UI Structure: Button, Icons (Sun/Moon/System), Dropdown Menu.
    *   Accessibility Features: `aria-*` attributes, `useRef` for focus management, `useEffect` hooks for keyboard navigation (Esc) and closing on outside click.
    *   State/Logic to Replace: `isDark` state, `applyTheme` function, initial theme detection `useEffect`.
    *   State/Logic to Potentially Keep/Adapt: `isMenuOpen` state, `toggleMenu` function, `menuReference`, `buttonReference`, accessibility-related `useEffect` hooks.
2.  **(TDD) Test (Fail):** Create `src/components/theme-toggle.unit.test.tsx`. Write tests using mocked `next-themes` (see Testing Notes below) for:
    *   Rendering the toggle button/menu trigger (checking initial icon based on mocked theme).
    *   Opening/closing the menu on button click.
    *   Closing the menu on Escape key press.
    *   Closing the menu on outside click (may require simulating events).
    *   Displaying options (Light, Dark, System) when menu is open.
    *   Calling the mocked `setTheme` function with the correct value ('light', 'dark', 'system') when an option is clicked.
    *   Ensuring correct `aria-*` attributes are present.
3.  **(TDD) Implement:** Update `src/components/theme-toggle.tsx`:
    *   Remove the `isDark` state and the `applyTheme` function.
    *   Remove the `useEffect` hook that reads the initial theme from `document.documentElement.classList`.
    *   Import and use the `useTheme` hook from `next-themes` to get `theme`, `setTheme`, and potentially `resolvedTheme` (to handle 'system').
    *   Update the main button's icon display logic to use the `theme` or `resolvedTheme` from the hook.
    *   Update the click handlers for the menu items (Light, Dark, System buttons) to call `setTheme` with the appropriate string.
    *   Retain/Adapt the `isMenuOpen` state, `toggleMenu` function, refs, and accessibility-related `useEffect` hooks.
    *   Ensure the component still renders the same visual structure.
4.  **(TDD) Test (Pass):** Ensure all tests in `theme-toggle.unit.test.tsx` pass with the refactored component.
5.  **Integrate Toggle:** Place the updated `ThemeToggle` component in the desired location (e.g., header or navigation bar) within the application layout or relevant components, replacing the old one if necessary.

### 4. Cleanup

1.  **Remove Old Provider:** Delete or comment out the old custom theme provider logic/component (`src/components/theme-provider.tsx` if it was custom).
2.  **Remove Old Toggle:** Delete or comment out the old custom theme toggle component (`src/components/theme-toggle.tsx` if it was custom).
3.  **Remove Custom Scripts:** Identify and remove any `<script>` tags or associated JavaScript files in `src/app/layout.tsx` or elsewhere that were part of the old theme system.
4.  **Code Search:** Search the codebase for any remaining artifacts, functions, or variables related to the old theme implementation and remove them.
5.  **Final Test Run:** Run `pnpm test` to ensure all tests still pass after cleanup.

### 5. Manual Verification

- Test theme switching in the browser (Light, Dark, System).
- Verify persistence across page reloads.
- Check system theme integration by changing OS appearance settings.
- Test accessibility of the theme toggle (keyboard navigation, screen reader).

---

### Testing Notes: Mocking `next-themes`

When unit testing components that use the `useTheme` hook (like `ThemeToggle`), you need to mock the hook to control its behavior and outputs during tests. Here's a typical approach using Vitest (`vi`):

**1. Mock the `next-themes` module:**
Place this at the top of your test file (`*.unit.test.tsx`):

```typescript
import { vi } from 'vitest';

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));
```

**2. Set mock return values within tests:**
Inside your `test` or `it` blocks, or in a `beforeEach`, you can specify what the mocked `useTheme` should return for that specific test case. Import the mocked function type for better type safety.

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { useTheme } from 'next-themes'; // Import the original path
import { ThemeToggle } from './theme-toggle'; // Adjust path as needed
import type { Mock } from 'vitest';

// Cast the mocked hook to Mock for type safety
const mockedUseTheme = useTheme as Mock;

test('should call setTheme with "dark" when dark mode button is clicked', () => {
  // Arrange: Set the mock return value for this test
  mockedUseTheme.mockReturnValue({
    theme: 'light',        // Current theme state
    setTheme: vi.fn(),    // A mock function to track calls
    resolvedTheme: 'light' // Resolved theme state
  });

  render(<ThemeToggle />);

  // Act: Simulate opening the menu and clicking the 'Dark' button
  const triggerButton = screen.getByRole('button', { name: /select theme/i });
  fireEvent.click(triggerButton);

  const darkButton = screen.getByRole('menuitem', { name: /dark/i });
  fireEvent.click(darkButton);

  // Assert: Check if the mock setTheme was called correctly
  expect(mockedUseTheme().setTheme).toHaveBeenCalledWith('dark');
});

test('should display Moon icon when theme is dark', () => {
  // Arrange
  mockedUseTheme.mockReturnValue({
    theme: 'dark',
    setTheme: vi.fn(),
    resolvedTheme: 'dark'
  });

  render(<ThemeToggle />);

  // Assert: Check for the Moon icon (you might need a more specific selector)
  // e.g., check for the presence of an element associated with the Moon icon
  expect(screen.getByLabelText(/select theme/i).querySelector('.lucide-moon')).toBeInTheDocument();
});
```

**Key Points:**

*   By mocking `useTheme`, you isolate your component from the actual `next-themes` provider and context.
*   `vi.fn()` creates a mock function that allows you to assert whether it was called, how many times, and with what arguments (`expect(...).toHaveBeenCalledWith(...)`).
*   You control the `theme` and `resolvedTheme` returned by the hook in each test to simulate different scenarios (light, dark, system resolved to light/dark).

*Self-Correction during implementation: If `shadcn/ui` components are used for the toggle, ensure tests correctly interact with its structure and state changes.*

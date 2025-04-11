# Theme Management Plan

At the moment we use a custom solution that allows users to select the theme to be "light", "dark" or "system". The default is "system".

The UI elements for this are good, but the background implementation is not. There are standard ways to achieve this functionality.

## New Implementation

Use [next-themes](https://www.npmjs.com/package/next-themes) to implement the theme management. Make sure to follow the instructions for using it with the Next.js [app router](https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app). Make sure the solution [integrates with Tailwind CSS](https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-tailwindcss).

## Plan

### Requirements

Read this entire list before starting. Note that you must use TDD. You can run the tests with `pnpm test`.

- remove **all of the custom scripts** in [/src/app/layout.tsx](/src/app/layout.tsx)
- Add the next-themes provider as appropriate, replacing the custom theme provider in [/src/components/theme-provider.tsx](/src/components/theme-provider.tsx)
- wire up the theme toggle component, making sure it works with the next-themes provider
- remove the custom theme toggle component in [/src/components/theme-toggle.tsx](/src/components/theme-toggle.tsx)
- Make sure the theme preference defaults to "system"
- Make sure the theme preference is persisted using the standard next-themes method
- Make sure that the theme toggle menu is accessible
- Make sure that the theme toggle menu is keyboard navigable
- Make sure that the theme toggle menu closes on outside click, or when the escape key is pressed
- Remove any remaining custom theme management code or scripts or any other code related to the old theme management.
- Use the next-themes documentation to implement the theme management
- Use TDD at all times.
- Write unit tests for the new theme management implementation, and the theme toggle component, use Vitest, React Testing Library, and @testing-library/react, make sure the tests end in .unit.test.tsx or .unit.test.ts

import type { Config } from "tailwindcss";

/**
 * Tailwind CSS Configuration File
 *
 * This configuration defines the color palette once, referencing CSS variables.
 * The themes are managed via CSS variables in 'globals.css', which adjust based on the 'data-theme' attribute.
 * This allows for dynamic theming without redefining styles for each theme in Tailwind.
 */

module.exports = {
  // Specify the paths to all of your template files
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // Enable dark mode via class or data attribute
  darkMode: ['class', '[data-theme="dark"]'],

  theme: {
    extend: {
      /**
       * Color Definitions
       *
       * Tailwind colors reference CSS variables that change with the theme.
       * This means 'bg-primary' will automatically adapt when the theme changes.
       */
      colors: {
        primary: 'var(--colour-primary)',
        'primary-hover': 'var(--colour-primary-hover)',
        secondary: 'var(--colour-secondary)',
        'secondary-hover': 'var(--colour-secondary-hover)',
        accent: 'var(--colour-accent)',
        background: 'var(--colour-background)',
        'text-primary': 'var(--colour-text-primary)',
        'text-secondary': 'var(--colour-text-secondary)',
        border: 'var(--colour-border)',
        success: 'var(--colour-success)',
        error: 'var(--colour-error)',
        warning: 'var(--colour-warning)',
        info: 'var(--colour-info)',
        'focus-ring': 'var(--colour-focus-ring)',
        white: 'var(--colour-white)',
        black: 'var(--colour-black)',
      },
    },
  },
  plugins: [
    /**
     * If you need to create custom variants (e.g., for high-contrast mode),
     * you can add them here using Tailwind's plugin system.
     */
    // Example:
    // const plugin = require('tailwindcss/plugin');
    // plugin(function ({ addVariant }) {
    //   addVariant('high-contrast', '[data-theme="high-contrast"] &');
    // }),
  ],
} satisfies Config;
// Library for dealing with legacy eslint config

import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import type { Linter } from "eslint";
import importPlugin from "eslint-plugin-import-x";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import type { ConfigArray } from "typescript-eslint";
import tseslint from "typescript-eslint";

const thisFile = fileURLToPath(import.meta.url);
const thisDirectory = path.dirname(thisFile);

const compat = new FlatCompat({
  baseDirectory: thisDirectory,
});

type ESLintRulesRecord = Linter.RulesRecord;

const ignores = [
  "node_modules/**",
  "package-lock.json",
  "dist/**",
  "**/fixtures/**/*",
  "**/*.fixture.ts",
];

// Import rules configuration
const importRules: Partial<ESLintRulesRecord> = {
  // Disabled rules
  "import-x/no-named-as-default-member": ["off"], // Disallow accessing default export as property of the default

  // Enabled rules
  "import-x/order": [
    "error",
    {
      "newlines-between": "always",
      groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
      alphabetize: { order: "asc", caseInsensitive: true },
      warnOnUnassignedImports: true,
    },
  ],
};

/**
 * Complexity rules. Don't apply to test files.
 *
 * These are deliberately permissive, we will tighten them up over time.
 */
const complexityRules: Partial<ESLintRulesRecord> = {
  // Rules that are off for now, but will be enabled in separate PRs.
  curly: ["error", "all"], // Enforce consistent braces style for clarity

  // Errors

  // Limit cyclomatic complexity to a reasonable starting point
  complexity: ["error", 15],

  // Enforce a maximum depth for nested blocks
  "max-depth": ["error", 4],

  // Limit excessive function parameters
  "max-params": ["error", 4],

  // Discourage large files
  "max-lines": ["error", 750],
};

/**
 * TypeScript rules
 */
const typescriptRules: Partial<ESLintRulesRecord> = {
  "@typescript-eslint/no-unused-expressions": ["error"],
  "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
  "@typescript-eslint/consistent-type-definitions": ["error", "interface"], // Enforce consistent type definition style
  "@typescript-eslint/naming-convention": [
    "error",
    {
      selector: "typeProperty",
      format: ["camelCase", "snake_case", "UPPER_CASE"],
      leadingUnderscore: "allow",
    },
  ],
  "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
};

const codeStyleRules: Partial<ESLintRulesRecord> = {
  "no-console": ["error", { allow: ["error", "warn"] }], // Replace console use with logger calls for info, warn, error, debug, etc.

  // We are using deprecated icons
  "sonarjs/deprecation": ["off"],
  "@typescript-eslint/no-deprecated": ["off"],

  // Unicorn is a bit much.
  "unicorn/prefer-string-slice": ["off"],
  "unicorn/prevent-abbreviations": ["off"],

  // Early days, allow todos
  "sonarjs/todo-tag": ["warn"],
  "no-warning-comments": [
    "warn",
    {
      terms: ["TODO", "todo", "TO DO", "to do", "FIXME", "fixme", "fix me", "HACK", "hack"],
      location: "anywhere",
    },
  ],

  // Don't require .toString calls to use non-strings in template literals
  "@typescript-eslint/restrict-template-expressions": ["off"],
};

const config: ConfigArray = tseslint.config(
  /**
   * The main config.
   */
  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      importPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: thisDirectory,
      },
    },
  },
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  sonarjs.configs.recommended,
  unicorn.configs.recommended,

  // Default rules
  // Overrides the configs above
  {
    rules: {
      ...importRules,
      ...complexityRules,
      ...codeStyleRules,
    },
  },
  /**
   * Ignore patterns
   */
  {
    ignores,
  },

  /**
   * **TypeScript** file specific configuration - Enhanced for better typed-components support
   */
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    settings: {
      // "import/parsers": {
      //   "@typescript-eslint/parser": [".ts", ".tsx", ".d.ts"], // Added .d.ts
      // },
      // "import/resolver": {
      //   typescript: {
      //     alwaysTryTypes: true,
      //     project: "./tsconfig.json",
      //   },
      // },
    },
    /**
     * TypeScript rules
     */
    rules: {
      ...typescriptRules,
    },
  },

  /**
   * **Test** files configuration.
   */
  {
    files: ["**/*.test.{js,ts,tsx}", "**/tests/**/*.{js,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.vitest,
      },
    },
    rules: {
      // Rules that will likely stay disabled for test files.
      "@typescript-eslint/no-explicit-any": ["off"],
      "@typescript-eslint/no-require-imports": ["off"],
      "@typescript-eslint/no-empty-function": ["off"],
      "@typescript-eslint/no-var-requires": ["off"],

      // Errors
      "max-lines": ["error", 2000],
    },
  },

  /**
   * Generated types
   */
  {
    files: ["src/types/generated/**/*.ts"],
    rules: {
      "@typescript-eslint/consistent-indexed-object-style": ["off"],
      "@typescript-eslint/naming-convention": ["off"],
      "@typescript-eslint/no-redundant-type-constituents": ["off"], // Possible type issues in the api?

      "max-len": ["off"],
      "max-lines": ["off"],

      "sonarjs/class-name": ["off"],
      "sonarjs/use-type-alias": ["off"],

      "unicorn/no-null": ["off"],
      "unicorn/numeric-separators-style": ["off"],
    },
  },

  /**
   * Example files
   */
  {
    files: ["examples/**/*.ts"],
    rules: {
      "no-console": ["off"],
    },
  },

  /**
   * NextJS configuration
   */
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
  }),
);

export default config;

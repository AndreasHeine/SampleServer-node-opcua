import {
  fixupConfigRules,
  fixupPluginRules,
  includeIgnoreFile,
} from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import json from "eslint-plugin-json";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig, globalIgnores } from "eslint/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, "../../.gitignore");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  globalIgnores(["tsconfig.json", ".github/linters/.jscpd.json"]),
  ...fixupConfigRules(compat.extends("eslint:recommended")),

  includeIgnoreFile(gitignorePath),
  {
    // your overrides
  },

  json.configs.recommended,
  js.configs.recommended,

  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
      json: json,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
        window: true,
        process: true,
        module: true,
      },

      parser: tsParser,
      ecmaVersion: 12,
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    files: [
      "**/*.ts",
      "**/*.js",
      "**/*.mjs",
      "**/*.jsx",
      "**/*.tsx",
      "**/*.mts",
      "**/*.json",
    ],

    rules: {
      "@typescript-eslint/camelcase": ["off"],
      "@typescript-eslint/no-unused-vars": ["off"],
      "@typescript-eslint/no-non-null-assertion": ["off"],
      "@typescript-eslint/no-empty-interface": ["off"],
      "@typescript-eslint/no-var-requires": ["off"],
      "@typescript-eslint/no-explicit-any": ["off"],
      "@typescript-eslint/explicit-module-boundary-types": ["off"],
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
      "no-constant-condition": ["off"],
      "no-unused-vars": ["off"],
      "no-dupe-class-members": 0,
      strict: 0, // controls location of Use Strict Directives
      "no-underscore-dangle": 0, // disallow dangling underscores in identifiers
      "no-irregular-whitespace": 2, // disallow irregular whitespace outside of strings and comments
      "no-multi-spaces": 0, // disallow use of multiple spaces
      "key-spacing": 0, // enforces spacing between keys and values in object literal proper
      "comma-spacing": 0, // enforce spacing before and after comma
      "no-trailing-spaces": 0, // disallow trailing whitespace at the end of lines
      // styling issues
      camelcase: 0,
      complexity: [2, 20],
      "max-depth": [2, 5], // Maximum of 2 deep.
      "max-params": [1, 7],
      "max-statements": [1, 40],
      // to fix
      "no-use-before-define": ["off"], // disallow use of variables before they are defined
      quotes: 0, // specify whether double or single quotes should be used
      "no-lone-blocks": ["off"],
      "no-shadow": ["off"],
      "comma-dangle": ["off"],
      "dot-notation": ["off"],
      "no-console": ["off"],
      "no-var": ["off"],
      "no-empty": ["error"],
      "no-unreachable": ["error"],
    },
  },
];

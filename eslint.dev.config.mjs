// ESLint configuration for fast development mode
// This configuration disables most rules for faster development

import globals from "globals";
import tsParser from "@typescript-eslint/parser";

export default [
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        ignores: [
            "node_modules/**",
            ".next/**",
            "public/**",
            "dist/**",
            "build/**",
            "coverage/**",
            "**/*.d.ts",
            "**/*.test.{js,jsx,ts,tsx}",
        ],
        languageOptions: {
            parser: tsParser,
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2021,
            },
        },
        rules: {
            // Only keep critical rules for development
            "no-undef": "off",
            "no-unused-vars": "off",
            "no-console": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/ban-types": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-var-requires": "off",
            "@next/next/no-img-element": "off",
            "@next/next/no-html-link-for-pages": "off",
        },
    },
];

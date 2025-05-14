import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Regras de estilo e formatação
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "prefer-const": "warn",

      // Regras de performance
      "react/jsx-no-bind": ["warn", { allowArrowFunctions: true }],
      "react/no-array-index-key": "warn",

      // Regras de acessibilidade
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/aria-props": "warn",

      // Regras de importação
      "import/order": ["warn", {
        "groups": [
          ["builtin", "external"],
          "internal",
          ["parent", "sibling", "index"]
        ],
        "newlines-between": "always",
        "alphabetize": { "order": "asc", "caseInsensitive": true }
      }]
    }
  }
];

export default eslintConfig;

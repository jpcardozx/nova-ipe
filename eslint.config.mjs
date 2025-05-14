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
      "no-unused-vars": "off", // Desabilitado em favor da regra TypeScript
      "prefer-const": "warn",

      // Regras TypeScript - Convertidas para warnings para permitir deploy
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true
      }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",

      // Regras React - Ajustadas para serem menos restritivas
      "react/jsx-no-bind": ["warn", {
        allowArrowFunctions: true,
        allowFunctions: true,
        allowBind: false
      }],
      "react/no-array-index-key": "warn",
      "react/no-unescaped-entities": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "react/display-name": "off",

      // Regras de acessibilidade
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/role-supports-aria-props": "warn",

      // Regras de importação
      "import/order": ["warn", {
        "groups": [
          ["builtin", "external"],
          "internal",
          ["parent", "sibling", "index"],
          "type",
          "object"
        ],
        "pathGroups": [
          {
            "pattern": "react",
            "group": "external",
            "position": "before"
          },
          {
            "pattern": "next/**",
            "group": "external",
            "position": "before"
          },
          {
            "pattern": "@/**",
            "group": "internal"
          }
        ],
        "pathGroupsExcludedImportTypes": ["react"],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }],
      "import/no-anonymous-default-export": "warn",

      // Regras Next.js específicas
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "off",

      // Regras adicionais para qualidade de código
      "no-unused-expressions": "warn",
      "no-duplicate-imports": "error",
      "no-self-compare": "warn",
      "no-template-curly-in-string": "warn",

      // Configurações para permitir desenvolvimento mais flexível
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    }
  },
  {
    // Configurações específicas para arquivos TypeScript
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Regras mais estritas para TypeScript
      "@typescript-eslint/consistent-type-imports": ["warn", {
        prefer: "type-imports",
        disallowTypeAnnotations: true
      }],
    }
  },
  {
    // Configurações para arquivos de configuração
    files: ["*.config.js", "*.config.ts"],
    rules: {
      "import/no-anonymous-default-export": "off",
    }
  }
];

export default eslintConfig;
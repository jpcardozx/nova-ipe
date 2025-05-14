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

      // Regras para evitar erros de build
      "no-duplicate-imports": "warn", // Mudando para warning
      "import/no-anonymous-default-export": "off", // Desligando temporariamente

      // Regras TypeScript - Convertidas para warnings
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true
      }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/consistent-type-imports": "off", // Desligando temporariamente

      // Regras React - Ajustadas para serem menos restritivas
      "react/jsx-no-bind": ["warn", {
        allowArrowFunctions: true,
        allowFunctions: true,
        allowBind: false
      }],
      "react/no-array-index-key": "warn",
      "react/no-unescaped-entities": "off", // Desligando para evitar erros
      "react-hooks/exhaustive-deps": "warn",
      "react/display-name": "off",

      // Regras de acessibilidade
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/role-supports-aria-props": "warn",

      // Regras de importação - Simplified
      "import/order": "off", // Desligando temporariamente para evitar erros
      "import/no-unresolved": "off",
      "import/no-duplicates": "warn",

      // Regras Next.js específicas
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "off",

      // Regras adicionais para qualidade de código
      "no-unused-expressions": "warn",
      "no-self-compare": "warn",
      "no-template-curly-in-string": "warn",

      // Configurações para permitir desenvolvimento mais flexível
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    }
  },
  {
    // Configurações específicas para arquivos de configuração
    files: ["*.config.js", "*.config.ts", "*.config.mjs"],
    rules: {
      "import/no-anonymous-default-export": "off",
      "@typescript-eslint/no-var-requires": "off",
    }
  },
  {
    // Configurações para permitir console em arquivos de API
    files: ["**/api/**/*.ts", "**/api/**/*.js"],
    rules: {
      "no-console": "off",
    }
  }
];

export default eslintConfig;
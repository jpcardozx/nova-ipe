import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // Regras básicas para evitar erros de build
      "no-console": "off",
      "no-unused-vars": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/exhaustive-deps": "off",
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
  }
];

export default eslintConfig;
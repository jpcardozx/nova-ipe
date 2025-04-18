import { defineConfig } from "sanity";
import { visionTool } from "@sanity/vision";
import { deskTool } from "sanity/desk"; // plugin principal do painel
import { schemaTypes } from "./schemas"; // importa todos os schemas customizados
import { projectId, dataset, apiVersion } from "./sanity/env"; // variáveis do seu projeto
import { structure } from "./sanity/structure"; // estrutura customizada do menu lateral

export default defineConfig({
  // Caminho do CMS dentro da sua aplicação
  basePath: "/studio",

  // Informações do seu projeto Sanity
  projectId, // "0nks58lj"
  dataset,   // "production"
  apiVersion, // "2024-01-01" ou a versão desejada para GROQ

  // Schema do CMS (todos os documentos e tipos)
  schema: {
    types: schemaTypes,
  },

  // Plugins ativos no Sanity Studio
  plugins: [
    deskTool({ structure }), // painel com estrutura customizada
    visionTool({ defaultApiVersion: apiVersion }) // plugin para debugar GROQ
  ],
});

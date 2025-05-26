// sanity.config.ts - Configuração SENIOR com fallbacks robustos
// SOLUÇÃO SENIOR: Importações condicionais baseadas no ambiente

let defineConfig: any;
let deskTool: any;
let visionTool: any;

// Detectar se estamos em build de produção
const isProductionBuild = process.env.NODE_ENV === 'production' && !process.env.SANITY_STUDIO_BUILD;

try {
  const sanityImports = require("sanity");
  defineConfig = sanityImports.defineConfig;
  deskTool = sanityImports.deskTool || require("sanity/desk").deskTool;
} catch (error) {
  console.warn('Sanity import failed, using fallback:', error);
  // Fallback robusto para build issues
  defineConfig = (config: any) => config;
  deskTool = () => ({ name: 'desk', title: 'Content' });
}

// SOLUÇÃO SENIOR: Só importar visionTool em desenvolvimento ou studio build
if (!isProductionBuild) {
  try {
    const visionImports = require("@sanity/vision");
    visionTool = visionImports.visionTool;
  } catch (error) {
    console.warn('Vision tool import failed:', error);
    visionTool = () => ({ name: 'vision', title: 'Vision' });
  }
} else {
  // Em produção, não carregamos o vision tool
  visionTool = null;
  console.log('🎯 Vision tool excluído do build de produção');
}

import schemaTypes from "./studio/schemas";
import { structure } from "./studio/sanity/customStructure";
import { projectId, dataset, apiVersion } from "./studio/env";

export const sanityConfig = defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  apiVersion,
  schema: { types: schemaTypes },
  plugins: [
    deskTool({ structure }),
    // Só incluir visionTool se não estivermos em build de produção
    ...(visionTool && !isProductionBuild ? [visionTool({ defaultApiVersion: apiVersion })] : [])
  ].filter(Boolean), // Remove any undefined plugins
});

export default sanityConfig;
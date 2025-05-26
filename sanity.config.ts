// sanity.config.ts (na raiz do repo)
// Import with try-catch to prevent Sentry conflicts
let defineConfig: any;
let deskTool: any;
let visionTool: any;

try {
  const sanityImports = require("sanity");
  defineConfig = sanityImports.defineConfig;
  deskTool = sanityImports.deskTool || require("sanity/desk").deskTool;
} catch (error) {
  console.warn('Sanity import failed, using fallback:', error);
  // Fallback for build issues
  defineConfig = (config: any) => config;
  deskTool = () => ({});
}

try {
  const visionImports = require("@sanity/vision");
  visionTool = visionImports.visionTool;
} catch (error) {
  console.warn('Vision tool import failed:', error);
  visionTool = () => ({});
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
    visionTool({ defaultApiVersion: apiVersion }),
  ].filter(Boolean), // Remove any undefined plugins
});

export default sanityConfig;
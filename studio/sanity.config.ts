import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk"; // correto
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { structure } from "./sanity/structure"; // importa sua estrutura customizada
import { projectId, dataset, apiVersion } from "./sanity/env";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  apiVersion,
  schema: {
    types: schemaTypes,
  },
  plugins: [
    deskTool({ structure }), // ✅ correto
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});

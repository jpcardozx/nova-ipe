// sanity.config.ts (na raiz do repo)
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
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
  ],
});

export default sanityConfig;
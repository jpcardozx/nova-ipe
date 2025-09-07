import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import schemaTypes from './studio/schemas'

// Only import visionTool in development to avoid build issues
let visionTool: any = null;
if (process.env.NODE_ENV === 'development') {
  try {
    const { visionTool: vision } = require('@sanity/vision');
    visionTool = vision;
  } catch (error) {
    console.warn('Vision tool not available:', (error as Error).message);
  }
}

export default defineConfig({
  name: 'nova-ipe-studio',
  title: 'Nova Ipê - CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: '/studio',
  plugins: [
    deskTool(),
    ...(visionTool ? [visionTool()] : [])
  ].filter(Boolean),
  schema: {
    types: schemaTypes,
  },
})

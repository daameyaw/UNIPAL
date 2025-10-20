import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'UniPal',

  projectId: 'x60kx28g',
  dataset: 'production',
  appId: 'r86ydzb2trym56nx1i4kpmo0',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})

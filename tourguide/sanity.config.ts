import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'tourguide',

  projectId: 'siu133x5',
  dataset: 'tours',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})

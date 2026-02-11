import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {schemaTypes} from './src/schemaTypes'
import {structure} from './src/structure'
import {defaultDocumentNode} from './src/structure/default-document-node'

export default defineConfig({
  name: 'default',
  title: 'Portfolio',

  projectId: 'rlnho0c7',
  dataset: 'production',

  mediaLibrary: {
    enabled: true,
  },

  plugins: [structureTool({structure, defaultDocumentNode}), visionTool()],

  schema: {
    types: schemaTypes,
  },
})

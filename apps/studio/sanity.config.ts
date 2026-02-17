import {codeInput} from '@sanity/code-input'
import {table} from '@sanity/table'
import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'

import {resolve} from './src/presentation/resolve'
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

  plugins: [
    structureTool({structure, defaultDocumentNode}),
    presentationTool({
      resolve,
      previewUrl: {
        origin:
          typeof window !== 'undefined' && window.location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : 'https://ejemeniboi.com',
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
    visionTool(),
    codeInput(),
    table(),
  ],

  schema: {
    types: schemaTypes,
  },
})

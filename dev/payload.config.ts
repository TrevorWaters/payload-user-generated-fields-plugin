import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { pluginUserGeneratedFields } from 'payload-user-generated-fields-plugin'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { devUser } from './helpers/credentials.js'
import { testEmailAdapter } from './helpers/testEmailAdapter.js'
import { seed } from './seed.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.ROOT_DIR) {
  process.env.ROOT_DIR = dirname
}

export default buildConfig({
  admin: {
    autoLogin: devUser,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    {
      slug: 'posts',
      fields: [
        {
          name: 'postTitle',
          type: 'text',
          required: true,
        },
        {
          name: 'testRadio',
          type: 'radio',
          options: ['Option 1', 'Option 2', 'Option 3'],
        },
        {
          name: 'testGroup',
          type: 'group',
          fields: [
            {
              name: 'testRelationship',
              type: 'relationship',
              hasMany: false,
              maxDepth: 2,
              relationTo: 'post-categories',
            },
          ],
        },
      ],
    },
    {
      slug: 'post-categories',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
      ],
    },
    {
      slug: 'media',
      fields: [],
      upload: {
        staticDir: path.resolve(dirname, 'media'),
      },
    },
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  defaultDepth: 3,
  editor: lexicalEditor(),
  email: testEmailAdapter,
  onInit: async (payload) => {
    await seed(payload)
  },
  plugins: [
    pluginUserGeneratedFields({
      collections: [
        {
          allowedFields: {},
          configCollection: {
            slug: 'post-categories',
          },
          valuesCollection: {
            slug: 'posts',
            groupName: 'Post Category Fields',
            relationshipFieldName: 'testGroup.testRelationship',
            useDefaultRelationshipField: false,
          },
        },
      ],
      debug: true,
    }),
  ],
  secret: process.env.PAYLOAD_SECRET || 'test-secret_key',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})

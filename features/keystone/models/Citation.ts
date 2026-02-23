import { list } from '@keystone-6/core'
import { isSignedIn } from '@keystone-6/core/access'
import { relationship, text, integer, json, timestamp } from '@keystone-6/core/fields'

export const Citation = list({
  access: {
    operation: {
      query: ({ session }) => !!session,
      create: isSignedIn,
      update: isSignedIn,
      delete: isSignedIn,
    },
  },
  fields: {
    title: text({ validation: { isRequired: true } }),
    document: relationship({ 
      ref: 'Document.citations',
      validation: { isRequired: true }
    }),
    authors: text({ db: { isNullable: true } }),
    publicationYear: integer({ db: { isNullable: true } }),
    source: text({ db: { isNullable: true } }),
    url: text({ db: { isNullable: true } }),
    doi: text({ db: { isNullable: true } }),
    citationStyle: text({ defaultValue: 'APA' }),
    formattedText: text({ 
      db: { isNullable: true },
      ui: { displayMode: 'textarea' }
    }),
    metadata: json({ defaultValue: {} }),
  },
})

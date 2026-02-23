import { list } from '@keystone-6/core'
import { isSignedIn } from '@keystone-6/core/access'
import { relationship, text, json, checkbox, timestamp } from '@keystone-6/core/fields'

export const ThesisTemplate = list({
  access: {
    operation: {
      query: ({ session }) => !!session,
      create: isSignedIn,
      update: isSignedIn,
      delete: isSignedIn,
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    university: text({ db: { isNullable: true } }),
    country: text({ defaultValue: 'Kenya' }),
    department: text({ db: { isNullable: true } }),
    sections: json({ defaultValue: [] }),
    requirementNotes: text({ 
      db: { map: 'requirementNotes', isNullable: true },
      ui: { displayMode: 'textarea' }
    }),
    marginSettings: json({ defaultValue: {} }),
    fontSettings: json({ defaultValue: {} }),
    isPublic: checkbox({ defaultValue: true }),
    documents: relationship({ ref: 'Document.template', many: true }),
  },
})

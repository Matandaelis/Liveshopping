import { list } from '@keystone-6/core'
import { isSignedIn } from '@keystone-6/core/access'
import { relationship, text, integer, checkbox, timestamp, select } from '@keystone-6/core/fields'

export const WritingFeedback = list({
  access: {
    operation: {
      query: ({ session }) => !!session,
      create: isSignedIn,
      update: isSignedIn,
      delete: isSignedIn,
    },
  },
  fields: {
    document: relationship({ 
      ref: 'Document.writingFeedbacks',
      validation: { isRequired: true }
    }),
    user: relationship({ 
      ref: 'User.writingFeedbacks',
      db: { isNullable: true }
    }),
    feedbackType: text({ db: { isNullable: true } }),
    text: text({ 
      validation: { isRequired: true },
      ui: { displayMode: 'textarea' }
    }),
    category: text({ db: { isNullable: true } }),
    severity: select({
      options: [
        { label: 'Info', value: 'INFO' },
        { label: 'Warning', value: 'WARNING' },
        { label: 'Error', value: 'ERROR' },
      ],
      db: { isNullable: true }
    }),
    startPosition: integer({ db: { isNullable: true } }),
    endPosition: integer({ db: { isNullable: true } }),
    suggestedImprovement: text({ db: { isNullable: true } }),
    isResolved: checkbox({ defaultValue: false }),
  },
})

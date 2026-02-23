import { list } from '@keystone-6/core'
import { isSignedIn } from '@keystone-6/core/access'
import { relationship, text, integer, select, decimal, timestamp, json } from '@keystone-6/core/fields'

export const PlagiarismScan = list({
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
      ref: 'Document.plagiarismScans',
      validation: { isRequired: true }
    }),
    scanStatus: select({
      options: [
        { label: 'Pending', value: 'PENDING' },
        { label: 'Scanning', value: 'SCANNING' },
        { label: 'Completed', value: 'COMPLETED' },
        { label: 'Failed', value: 'FAILED' },
      ],
      defaultValue: 'PENDING',
    }),
    similarityPercentage: decimal({ 
      precision: 5,
      scale: 2,
      db: { isNullable: true }
    }),
    matchedSources: json({ defaultValue: [] }),
    reportUrl: text({ db: { isNullable: true } }),
    scanDate: timestamp({ db: { isNullable: true } }),
  },
})

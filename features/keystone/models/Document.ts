import { list } from '@keystone-6/core'
import { isSignedIn } from '@keystone-6/core/access'
import { relationship, text, json, integer, select, timestamp } from '@keystone-6/core/fields'

export const Document = list({
  access: {
    operation: {
      query: ({ session }) => !!session,
      create: isSignedIn,
      update: isSignedIn,
      delete: isSignedIn,
    },
    filter: {
      query: ({ session }) => 
        session?.data?.role?.canManagePeople 
          ? true 
          : { userId: { equals: session?.itemId } },
      update: ({ session, item }) =>
        session?.data?.role?.canManagePeople ||
        session?.itemId === item?.userId,
      delete: ({ session, item }) =>
        session?.data?.role?.canManagePeople ||
        session?.itemId === item?.userId,
    },
  },
  fields: {
    title: text({ validation: { isRequired: true } }),
    user: relationship({ 
      ref: 'User.documents',
      validation: { isRequired: true }
    }),
    template: relationship({ 
      ref: 'ThesisTemplate.documents',
      db: { isNullable: true }
    }),
    content: json({ defaultValue: [] }),
    wordCount: integer({ defaultValue: 0 }),
    status: select({
      options: [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'In Review', value: 'IN_REVIEW' },
        { label: 'Submitted', value: 'SUBMITTED' },
        { label: 'Completed', value: 'COMPLETED' },
      ],
      defaultValue: 'DRAFT',
    }),
    version: integer({ defaultValue: 1 }),
    lastModified: timestamp({ defaultValue: { kind: 'now' } }),
    collaborators: json({ defaultValue: [] }),
    citations: relationship({ ref: 'Citation.document', many: true }),
    writingFeedbacks: relationship({ ref: 'WritingFeedback.document', many: true }),
    plagiarismScans: relationship({ ref: 'PlagiarismScan.document', many: true }),
    aiChats: relationship({ ref: 'AIChat.document', many: true }),
  },
})

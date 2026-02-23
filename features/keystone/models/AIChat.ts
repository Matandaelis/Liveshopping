import { list } from '@keystone-6/core'
import { isSignedIn } from '@keystone-6/core/access'
import { relationship, text, select, json, timestamp } from '@keystone-6/core/fields'

export const AIChat = list({
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
    },
  },
  fields: {
    user: relationship({ 
      ref: 'User.aiChats',
      validation: { isRequired: true }
    }),
    document: relationship({ 
      ref: 'Document.aiChats',
      db: { isNullable: true }
    }),
    model: select({
      options: [
        { label: 'Groq', value: 'GROQ' },
        { label: 'Claude', value: 'CLAUDE' },
        { label: 'GPT-4', value: 'GPT4' },
      ],
      defaultValue: 'GROQ',
    }),
    title: text({ defaultValue: 'New Conversation' }),
    messages: json({ defaultValue: [] }),
  },
})

import { list } from '@keystone-6/core'
import { checkbox, decimal, integer, relationship, select, text, json } from '@keystone-6/core/fields'
import { isAdmin, permissions } from '../access'

export const SubscriptionPlan = list({
  access: {
    operation: {
      query: ({ session }) => !!session,
      create: isAdmin,
      update: isAdmin,
      delete: isAdmin,
    },
  },
  ui: {
    hideCreate: args => !isAdmin(args),
    hideDelete: args => !isAdmin(args),
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    tier: text({ 
      validation: { isRequired: true },
      isIndexed: 'unique',
    }),
    price: decimal({ 
      precision: 10,
      scale: 2,
      validation: { isRequired: true }
    }),
    billingPeriod: select({
      options: [
        { label: 'Monthly', value: 'MONTHLY' },
        { label: 'Annual', value: 'ANNUAL' },
      ],
      defaultValue: 'MONTHLY',
    }),
    description: text({ db: { isNullable: true } }),
    features: json({ defaultValue: [] }),
    maxDocuments: integer({ defaultValue: -1 }),
    maxAISuggestions: integer({ defaultValue: -1 }),
    maxPlagiarismScans: integer({ defaultValue: -1 }),
    hasCollaboration: checkbox({ defaultValue: false }),
    hasTemplates: checkbox({ defaultValue: false }),
    supportLevel: text({ defaultValue: 'NONE' }),
    subscriptions: relationship({ ref: 'Subscription.plan', many: true }),
  },
})

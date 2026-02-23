import { list } from '@keystone-6/core'
import { checkbox, relationship, select, text, timestamp } from '@keystone-6/core/fields'
import { isAdmin } from '../access'

export const Subscription = list({
  access: {
    operation: {
      query: ({ session }) => !!session,
      create: (args) => isAdmin(args),
      update: (args) => isAdmin(args),
      delete: (args) => isAdmin(args),
    },
    filter: {
      query: ({ session }) => 
        session?.data?.role?.canManagePeople 
          ? true 
          : { user: { id: { equals: session?.itemId } } },
    },
  },
  fields: {
    user: relationship({ 
      ref: 'User.subscription',
      validation: { isRequired: true }
    }),
    plan: relationship({ 
      ref: 'SubscriptionPlan.subscriptions',
      validation: { isRequired: true }
    }),
    status: select({
      options: [
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Inactive', value: 'INACTIVE' },
        { label: 'Canceled', value: 'CANCELED' },
        { label: 'Expired', value: 'EXPIRED' },
      ],
      defaultValue: 'ACTIVE',
    }),
    startDate: timestamp({ defaultValue: { kind: 'now' } }),
    endDate: timestamp({ db: { isNullable: true } }),
    renewalDate: timestamp({ db: { isNullable: true } }),
    stripeSubscriptionId: text({ db: { isNullable: true } }),
    stripeCustomerId: text({ db: { isNullable: true } }),
    autoRenew: checkbox({ defaultValue: true }),
    paymentTransactions: relationship({ ref: 'PaymentTransaction.subscription', many: true }),
  },
})

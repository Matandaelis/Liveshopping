import { list } from '@keystone-6/core'
import { isSignedIn } from '@keystone-6/core/access'
import { relationship, decimal, text, select, timestamp } from '@keystone-6/core/fields'

export const PaymentTransaction = list({
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
      ref: 'User.paymentTransactions',
      validation: { isRequired: true }
    }),
    subscription: relationship({ 
      ref: 'Subscription.paymentTransactions',
      db: { isNullable: true }
    }),
    amount: decimal({ 
      precision: 10,
      scale: 2,
      validation: { isRequired: true }
    }),
    currency: text({ defaultValue: 'USD' }),
    status: select({
      options: [
        { label: 'Pending', value: 'PENDING' },
        { label: 'Completed', value: 'COMPLETED' },
        { label: 'Failed', value: 'FAILED' },
        { label: 'Refunded', value: 'REFUNDED' },
      ],
      defaultValue: 'PENDING',
    }),
    stripePaymentIntentId: text({ db: { isNullable: true } }),
    stripeInvoiceId: text({ db: { isNullable: true } }),
    completedAt: timestamp({ db: { isNullable: true } }),
  },
})

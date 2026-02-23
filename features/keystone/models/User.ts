import { list } from '@keystone-6/core'
import { allOperations, denyAll } from '@keystone-6/core/access'
import { checkbox, password, relationship, text } from '@keystone-6/core/fields'

import { isSignedIn, permissions, rules } from '../access'
import type { Session } from '../access'

export const User = list({
  access: {
    operation: {
      ...allOperations(isSignedIn),
      create: (args) => {
        // Allow public sign-ups if environment variable is set to true
        if (process.env.PUBLIC_SIGNUPS_ALLOWED === 'true') {
          return true;
        }
        // Otherwise, require canManagePeople permission
        return permissions.canManagePeople(args);
      },
      delete: permissions.canManagePeople,
    },
    filter: {
      query: rules.canReadPeople,
      update: rules.canUpdatePeople,
    },
  },
  ui: {
    hideCreate: args => !permissions.canManagePeople(args),
    hideDelete: args => !permissions.canManagePeople(args),
    listView: {
      initialColumns: ['name', 'email', 'role', 'tasks'],
    },
    itemView: {
      defaultFieldMode: ({ session, item }) => {
        // canEditOtherPeople can edit other people
        if (session?.data.role?.canEditOtherPeople) return 'edit'

        // edit themselves
        if (session?.itemId === item?.id) return 'edit'

        // else, default all fields to read mode
        return 'read'
      },
    },
  },
  fields: {
    name: text({
      validation: {
        isRequired: true,
      },
    }),
    email: text({
      isFilterable: false,
      isOrderable: false,
      isIndexed: 'unique',
      validation: {
        isRequired: true,
      },
    }),
    password: password({
      access: {
        read: denyAll,
        update: ({ session, item }) =>
          permissions.canManagePeople({ session }) || session?.itemId === item.id,
      },
      validation: { isRequired: true },
    }),
    role: relationship({
      ref: 'Role.assignedTo',
      access: {
        create: permissions.canManagePeople,
        update: permissions.canManagePeople,
      },
      ui: {
        itemView: {
          fieldMode: args => (permissions.canManagePeople(args) ? 'edit' : 'read'),
        },
      },
    }),
    tasks: relationship({
      ref: 'Todo.assignedTo',
      many: true,
      access: {
        create: permissions.canManageAllTodos,
        update: ({ session, item }) =>
          permissions.canManageAllTodos({ session }) || session?.itemId === item.id,
      },
      ui: {
        createView: {
          fieldMode: args => (permissions.canManageAllTodos(args) ? 'edit' : 'hidden'),
        },
      },
    }),
    // Subscription fields
    subscription: relationship({
      ref: 'Subscription.user',
      db: { isNullable: true },
      access: {
        create: permissions.canManagePeople,
        update: ({ session, item }) =>
          permissions.canManagePeople({ session }) || session?.itemId === item.id,
      },
    }),
    subscriptionTier: text({ defaultValue: 'FREE' }),
    stripeCustomerId: text({ 
      db: { isNullable: true, map: 'stripeCustomerId' },
      isIndexed: 'unique',
    }),
    // Profile fields
    university: text({ db: { isNullable: true } }),
    userRole: text({ defaultValue: 'STUDENT' }),
    // Relationships
    documents: relationship({
      ref: 'Document.user',
      many: true,
    }),
    writingFeedbacks: relationship({
      ref: 'WritingFeedback.user',
      many: true,
    }),
    aiChats: relationship({
      ref: 'AIChat.user',
      many: true,
    }),
    userStats: relationship({
      ref: 'UserStats.user',
    }),
    paymentTransactions: relationship({
      ref: 'PaymentTransaction.user',
      many: true,
    }),
  },
});

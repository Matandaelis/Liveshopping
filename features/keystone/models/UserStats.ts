import { list } from '@keystone-6/core'
import { isSignedIn } from '@keystone-6/core/access'
import { relationship, integer, timestamp } from '@keystone-6/core/fields'

export const UserStats = list({
  graphql: {
    plural: 'UserStatistics',
  },
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
      ref: 'User.userStats',
      validation: { isRequired: true },
      isIndexed: 'unique',
    }),
    documentsCreated: integer({ defaultValue: 0 }),
    aiSuggestionsUsed: integer({ defaultValue: 0 }),
    plagiarismScansUsed: integer({ defaultValue: 0 }),
    totalWritingTime: integer({ defaultValue: 0 }),
    lastActivityDate: timestamp({ db: { isNullable: true } }),
  },
})

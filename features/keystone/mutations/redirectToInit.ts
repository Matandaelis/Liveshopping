// Mutation disabled - Keystone User table not available
// Returns false (no redirect needed) to allow app to continue

async function redirectToInit(root: any, args: any, context: any) {
  console.log('[v0] redirectToInit called - returning false (Keystone disabled)')
  return false;
}

export default redirectToInit;

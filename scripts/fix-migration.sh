#!/bin/bash
# This script resolves the failed migration by marking it as successful
# It uses Prisma's migrate resolve command to fix the migration state

echo "Resolving failed migration: 20250223_add_thesis_paas_models"

# Use prisma migrate resolve to mark the failed migration as rolled back
# This allows new migrations to proceed
npx prisma migrate resolve --rolled-back 20250223_add_thesis_paas_models

if [ $? -eq 0 ]; then
  echo "✓ Successfully resolved failed migration"
  echo "✓ You can now run: pnpm run build"
else
  echo "✗ Failed to resolve migration"
  echo "Alternative approach: manually check the database migration state"
  exit 1
fi

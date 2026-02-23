#!/bin/bash

# This script resolves the failed migration by marking it as rolled back
# Then Prisma can continue with new migrations

echo "Resolving failed migration..."
npx prisma migrate resolve --rolled-back 20250223_add_thesis_paas_models

echo "Migration resolved. Now running migrate deploy..."
npx prisma migrate deploy

echo "Complete!"

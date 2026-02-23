#!/bin/bash

# ThesisAI Database Migration Script
# This script sets up the Prisma database and seeds initial data

echo "[v0] Starting database setup..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "[v0] ERROR: DATABASE_URL environment variable is not set"
  exit 1
fi

echo "[v0] ✓ DATABASE_URL is configured"

# Generate Prisma client
echo "[v0] Generating Prisma client..."
npx prisma generate

# Push schema to database
echo "[v0] Pushing schema to database..."
npx prisma db push --skip-generate

# Seed the database
echo "[v0] Seeding database with initial data..."
npx ts-node scripts/seed.ts

echo "[v0] ✅ Database setup completed successfully!"
echo "[v0] You can now start the development server with: npm run dev"

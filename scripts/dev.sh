#!/bin/bash
# Load environment variables from .env files before starting dev server
set -a
[ -f .env ] && . .env
[ -f .env.local ] && . .env.local
[ -f .env.preview ] && . .env.preview
set +a

# Ensure DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL environment variable is not set"
  echo "Please add DATABASE_URL to your .env file or Vercel environment variables"
  exit 1
fi

echo "DATABASE_URL is configured"
echo "Starting Keystone build..."

# Run the build with environment variables loaded
exec keystone build --no-ui && npm run migrate && next dev

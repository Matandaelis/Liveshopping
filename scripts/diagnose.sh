#!/bin/bash

# ThesisAI UI Preview Diagnostics Script
# This script helps identify and troubleshoot issues preventing UI preview access

set -e

echo "================================================"
echo "ThesisAI UI Preview Diagnostics"
echo "================================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track issues found
ISSUES_FOUND=0
WARNINGS_FOUND=0

# Helper functions
check_pass() {
  echo -e "${GREEN}✓${NC} $1"
}

check_fail() {
  echo -e "${RED}✗${NC} $1"
  ((ISSUES_FOUND++))
}

check_warn() {
  echo -e "${YELLOW}⚠${NC} $1"
  ((WARNINGS_FOUND++))
}

check_info() {
  echo -e "${BLUE}ℹ${NC} $1"
}

echo "1. Checking Environment Setup"
echo "-------------------------------"

# Check Node.js version
if command -v node &> /dev/null; then
  NODE_VERSION=$(node -v)
  check_pass "Node.js installed: $NODE_VERSION"
else
  check_fail "Node.js not found"
fi

# Check npm/pnpm/yarn
if command -v pnpm &> /dev/null; then
  PACKAGE_MANAGER="pnpm"
  check_pass "Package manager found: pnpm"
elif command -v npm &> /dev/null; then
  PACKAGE_MANAGER="npm"
  check_pass "Package manager found: npm"
else
  check_fail "No package manager found (npm/pnpm)"
fi

echo ""
echo "2. Checking Environment Variables"
echo "-----------------------------------"

# Required environment variables
REQUIRED_VARS=("DATABASE_URL" "GROQ_API_KEY" "ANTHROPIC_API_KEY")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    check_fail "Missing environment variable: $var"
    MISSING_VARS+=("$var")
  else
    check_pass "Environment variable set: $var"
  fi
done

# Optional but recommended
OPTIONAL_VARS=("STRIPE_SECRET_KEY" "STRIPE_PUBLISHABLE_KEY" "SESSION_SECRET")

for var in "${OPTIONAL_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    check_warn "Optional environment variable not set: $var"
  else
    check_pass "Optional variable set: $var"
  fi
done

echo ""
echo "3. Checking Project Structure"
echo "------------------------------"

# Check key files
KEY_FILES=(
  "package.json"
  "tsconfig.json"
  "next.config.mjs"
  "schema.prisma"
  "keystone.ts"
  "app/page.tsx"
  "app/layout.tsx"
)

for file in "${KEY_FILES[@]}"; do
  if [ -f "$file" ]; then
    check_pass "Found: $file"
  else
    check_fail "Missing: $file"
  fi
done

echo ""
echo "4. Checking Dependencies"
echo "------------------------"

# Check if node_modules exists
if [ -d "node_modules" ]; then
  check_pass "node_modules directory exists"
  MODULES_COUNT=$(find node_modules -maxdepth 1 -type d | wc -l)
  check_info "Modules installed: approximately $(($MODULES_COUNT - 1)) packages"
else
  check_fail "node_modules not found - run: pnpm install"
fi

# Check for critical dependencies
CRITICAL_DEPS=("next" "@keystone-6/core" "prisma" "react")

for dep in "${CRITICAL_DEPS[@]}"; do
  if [ -d "node_modules/$dep" ]; then
    check_pass "Dependency installed: $dep"
  else
    check_warn "Dependency not found: $dep (may need pnpm install)"
  fi
done

echo ""
echo "5. Checking Database Configuration"
echo "-----------------------------------"

if [ -z "$DATABASE_URL" ]; then
  check_fail "DATABASE_URL not set - Prisma cannot initialize"
else
  # Try to parse the connection string
  if [[ $DATABASE_URL == postgresql://* ]] || [[ $DATABASE_URL == postgres://* ]]; then
    check_pass "DATABASE_URL appears to be a valid PostgreSQL connection string"
  else
    check_warn "DATABASE_URL format may be incorrect"
  fi
fi

echo ""
echo "6. Checking Build Configuration"
echo "--------------------------------"

# Check next.config.mjs
if [ -f "next.config.mjs" ]; then
  if grep -q "cacheComponents" next.config.mjs; then
    check_pass "next.config.mjs includes cacheComponents configuration"
  else
    check_info "cacheComponents not found in next.config.mjs"
  fi
fi

# Check Prisma schema
if [ -f "schema.prisma" ]; then
  if grep -q "datasource postgresql" schema.prisma; then
    check_pass "Prisma configured for PostgreSQL"
  else
    check_fail "Prisma not configured for PostgreSQL"
  fi
  
  if grep -q "provider.*prisma" schema.prisma; then
    check_pass "Prisma provider found"
  fi
fi

echo ""
echo "7. Summary & Recommendations"
echo "-----------------------------"

if [ $ISSUES_FOUND -eq 0 ]; then
  check_pass "No critical issues found!"
  echo ""
  echo "Recommended next steps:"
  echo "1. Run: pnpm dev"
  echo "2. Open: http://localhost:3000"
  echo "3. Check browser console for any errors (F12 → Console)"
else
  echo ""
  echo "Issues found: $ISSUES_FOUND"
  echo "Warnings found: $WARNINGS_FOUND"
  echo ""
  echo "Critical issues to fix:"
  
  if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo "  • Add missing environment variables:"
    for var in "${MISSING_VARS[@]}"; do
      echo "    - $var"
    done
  fi
  
  if [ ! -d "node_modules" ]; then
    echo "  • Run: pnpm install"
  fi
  
  if [ -z "$DATABASE_URL" ]; then
    echo "  • Set DATABASE_URL environment variable"
    echo "    - Get connection string from Neon project"
    echo "    - Format: postgresql://user:password@host/database"
    echo "    - Set in Vercel: Project Settings → Environment Variables"
  fi
fi

echo ""
echo "================================================"
echo "For more help, check UI_PREVIEW_RESOLUTION_PLAN.md"
echo "================================================"

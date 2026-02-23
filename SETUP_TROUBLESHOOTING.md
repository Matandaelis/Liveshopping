# ThesisAI - Comprehensive Setup & Troubleshooting Guide

## Quick Start (5 Minutes)

### Step 1: Environment Variables
Before the app can run, you must set these environment variables:

**Critical (Required):**
```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

Get this from your Neon project: Dashboard → Connection String

**Recommended (Required for AI features):**
```
GROQ_API_KEY=your_groq_api_key
ANTHROPIC_API_KEY=your_claude_api_key
SESSION_SECRET=generate_random_32_char_string
```

**Optional (For Payments):**
```
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Step 2: Set Variables in Vercel
1. Go to your Vercel project → Settings → Environment Variables
2. Add all variables above
3. Save and redeploy

### Step 3: Install & Run Locally
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open browser
open http://localhost:3000
```

### Step 4: Verify Preview
- [ ] Landing page loads at `/`
- [ ] No errors in browser console (F12 → Console)
- [ ] Pricing page loads at `/pricing`
- [ ] Navigation links work

---

## Understanding the Architecture

### Components & Pages

**Frontend Pages** (Render without backend):
- `/` - Landing page (LandingPageContent)
- `/pricing` - Pricing tiers (PricingPage)
- `/checkout` - Stripe checkout (CheckoutForm)

**Protected Pages** (Require database):
- `/dashboard` - User dashboard
- `/editor/[id]` - Document editor
- `/editor/[id]/citations` - Citation manager

**API Routes** (Backend):
- `/api/ai-assistant/chat` - AI writing suggestions
- `/api/documents` - Document CRUD
- `/api/citations` - Citation management
- `/api/checkout` - Stripe checkout
- `/api/webhooks/stripe` - Payment webhooks

### Database Models

**Core Models:**
- User (extended with subscription fields)
- SubscriptionPlan, Subscription, PaymentTransaction
- Document, Citation, WritingFeedback
- ThesisTemplate, PlagiarismScan, AIChat, UserStats

**Key Relationships:**
```
User --1:1--> Subscription --1:N--> PaymentTransaction
User --1:N--> Document --1:N--> Citation
User --1:N--> AIChat
Document --1:N--> WritingFeedback, PlagiarismScan
```

---

## Troubleshooting Guide

### Issue 1: "DATABASE_URL not found"

**Symptoms:**
- Build fails with "error: Environment variable not found: DATABASE_URL"
- Prisma cannot validate schema

**Diagnosis:**
```bash
# Check if variable is set
echo $DATABASE_URL

# If empty, it's not set
```

**Solution:**
1. Get connection string from Neon:
   - Dashboard → Project → Connection → Connection String
2. Add to Vercel:
   - Project Settings → Environment Variables → Add `DATABASE_URL`
3. Redeploy and rebuild

---

### Issue 2: "Keystone initialization failed"

**Symptoms:**
- Build fails with Keystone error
- "The list key and the plural name must be different"

**Diagnosis:**
```bash
# Check for GraphQL naming issues
grep -r "graphql.plural" features/keystone/models/
```

**Solution:**
Already fixed in UserStats model with `graphql: { plural: 'UserStatistics' }`
- Check UserStats.ts has this configuration
- Clear node_modules and rebuild:
  ```bash
  rm -rf node_modules .next
  pnpm install
  pnpm dev
  ```

---

### Issue 3: "Landing page shows blank/error"

**Symptoms:**
- Page loads but content is blank
- Console shows JavaScript errors

**Diagnosis:**
1. Open DevTools (F12)
2. Check Console tab for error messages
3. Check Network tab for failed requests (red items)

**Common Causes & Fixes:**

| Error | Cause | Fix |
|-------|-------|-----|
| "Cannot find module" | Import path wrong | Check file paths in components |
| "CSS not loading" | Tailwind not compiled | Run `pnpm build` |
| "API call failed" | Backend not ready | Wait for backend initialization |
| "React error" | Component error | Check ErrorBoundary logs |

---

### Issue 4: "AI Features not working"

**Symptoms:**
- AI chat returns 500 errors
- Writing suggestions not loading

**Diagnosis:**
```bash
# Check if API keys are set
echo $GROQ_API_KEY
echo $ANTHROPIC_API_KEY

# Check API logs
# Open: http://localhost:3000/api/ai-assistant/chat (in DevTools Network tab)
```

**Solution:**
1. Add `GROQ_API_KEY` and `ANTHROPIC_API_KEY` to environment
2. Test API endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/ai-assistant/chat \
     -H "Content-Type: application/json" \
     -d '{"messages":[{"role":"user","content":"test"}]}'
   ```

---

### Issue 5: "Database connection failed"

**Symptoms:**
- Cannot query documents
- Subscription data not loading
- API returns 500 errors

**Diagnosis:**
```bash
# Test Prisma connection
npx prisma db push --skip-generate

# Check connection string format
echo $DATABASE_URL
```

**Solution:**
1. Verify connection string format:
   - Should be: `postgresql://user:password@host:5432/dbname?sslmode=require`
2. Test network connectivity:
   - Can your machine reach the Neon server?
   - Check firewall/VPN settings
3. Verify credentials:
   - Are username/password correct in the connection string?
4. Run migration:
   ```bash
   npx prisma migrate deploy
   npx prisma db push
   ```

---

### Issue 6: "Subscription/Payment features not working"

**Symptoms:**
- Checkout page shows errors
- Cannot upgrade to Pro/Premium

**Diagnosis:**
```bash
echo $STRIPE_SECRET_KEY
echo $STRIPE_PUBLISHABLE_KEY
```

**Solution:**
1. Add Stripe keys to environment variables
2. Test Stripe configuration:
   ```bash
   curl -X POST http://localhost:3000/api/checkout \
     -H "Content-Type: application/json" \
     -d '{"planId":"pro"}'
   ```
3. Check Stripe dashboard for webhook errors

---

## Diagnostic Tools

### 1. Run Diagnostic Script
```bash
bash scripts/diagnose.sh
```

This checks:
- Environment variables
- Project structure
- Dependencies installed
- Database configuration
- Build settings

### 2. Check Build Logs
```bash
# View Next.js build output
pnpm build

# Check for TypeScript errors
pnpm type-check
```

### 3. Test Database Connection
```bash
# Connect to Neon database directly
psql $DATABASE_URL

# Inside psql:
\dt  -- List all tables
SELECT * FROM "User" LIMIT 1;  -- Check if tables exist
```

### 4. Monitor API Routes
Open DevTools (F12) → Network tab
- Watch for failed requests (red)
- Check response status codes
- Look for error messages in response body

---

## Build Checklist

Before deployment, verify:

- [ ] All environment variables are set
- [ ] `pnpm install` runs without errors
- [ ] `pnpm build` succeeds
- [ ] No TypeScript errors: `pnpm type-check`
- [ ] Database connection works: `npx prisma db push`
- [ ] Local dev server runs: `pnpm dev`
- [ ] Landing page loads at `localhost:3000`
- [ ] No errors in browser console
- [ ] Network requests succeed (DevTools Network tab)

---

## Performance Tips

### Optimize Build
```bash
# Clear all caches
rm -rf node_modules .next .prisma pnpm-lock.yaml

# Reinstall clean
pnpm install

# Build optimized
pnpm build
```

### Monitor Performance
```bash
# Check Next.js build metrics
pnpm build --analyze

# Profile API routes
# Use `console.time()` and `console.timeEnd()` in your code
```

### Database Optimization
```sql
-- Check for missing indexes
SELECT schemaname, tablename, indexname FROM pg_indexes WHERE schemaname = 'public';

-- Monitor query performance
EXPLAIN ANALYZE SELECT * FROM "Document" WHERE "userId" = '...';
```

---

## Common Git Issues

### Git Repository Connection
```bash
# Check if Git is configured
git config --global user.email
git config --global user.name

# Connect to GitHub (if using)
git remote -v

# If needed, add remote
git remote add origin https://github.com/yourusername/repo.git
```

### Sync With Remote
```bash
# Fetch latest from origin
git fetch origin

# Pull latest changes
git pull origin master

# Push your changes
git push origin thesis-writing-platform
```

---

## Getting Help

### 1. Check Documentation
- UI_PREVIEW_RESOLUTION_PLAN.md - Comprehensive resolution guide
- This file - Common issues and solutions

### 2. Run Diagnostics
```bash
bash scripts/diagnose.sh
```

### 3. Check Debug Logs
- Vercel Dashboard → Deployments → Function Logs
- Local: Check terminal output from `pnpm dev`

### 4. Search Errors
- Take the error message and search it
- Check Stack Overflow or GitHub issues
- Look in AI SDK documentation: sdk.vercel.ai

### 5. Get Support
- Vercel Support: https://vercel.com/help
- Keystone Support: https://keystonejs.com/
- Neon Support: https://neon.tech/docs

---

## Next Steps After Setup

1. **Create First Document**
   - Navigate to Dashboard
   - Click "New Document"
   - Select a template
   - Start writing!

2. **Test AI Features**
   - Open document
   - Click "AI Assistant" sidebar
   - Ask for writing suggestions

3. **Add Citations**
   - In editor, click "Citations" tab
   - Add citation details
   - Select format (APA, MLA, etc.)
   - Generate bibliography

4. **Test Subscriptions**
   - Go to Pricing page
   - Click "Try Pro"
   - Complete checkout with Stripe test card: `4242 4242 4242 4242`

5. **Customize**
   - Edit colors in app/globals.css
   - Update templates in features/keystone/models/ThesisTemplate.ts
   - Add new universities as needed

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│          User Browser                           │
│  - Landing Page (/)                             │
│  - Pricing Page (/pricing)                      │
│  - Dashboard (/dashboard)                       │
│  - Editor (/editor/[id])                        │
└────────────────┬────────────────────────────────┘
                 │ HTTPS
┌─────────────────┴────────────────────────────────┐
│       Next.js App Server (Vercel)               │
│  ┌─────────────────────────────────────────┐   │
│  │  Frontend (React/TypeScript)            │   │
│  │  - Components (UI, Editor, Chat)        │   │
│  │  - Pages (Landing, Dashboard, Editor)   │   │
│  └─────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────┐   │
│  │  Backend (API Routes)                   │   │
│  │  - /api/ai-assistant/chat               │   │
│  │  - /api/documents                       │   │
│  │  - /api/checkout                        │   │
│  │  - /api/webhooks/stripe                 │   │
│  └─────────────────────────────────────────┘   │
└────────┬─────────────────┬─────────────────────┘
         │                 │
    ┌────▼───┐      ┌─────▼──────┐
    │  Neon  │      │  Stripe    │
    │   DB   │      │  Payments  │
    └────────┘      └────────────┘
```

---

## Success Indicators

✓ **Landing page loads** - Public content rendering
✓ **No console errors** - Clean browser console
✓ **Images load** - Assets serving correctly  
✓ **Navigation works** - Links routing properly
✓ **Pricing page displays** - All tiers visible
✓ **Database connects** - Can query data
✓ **API endpoints respond** - Services initialized
✓ **AI chat works** - Writing suggestions active

Once all above are working, the platform is ready for user testing!


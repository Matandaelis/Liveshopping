# ThesisAI Implementation Guide - Step-by-Step

## Starting Point Status

✅ **Completed**:
- Next.js 15 App Router setup
- TailwindCSS 4 + shadcn/ui configured
- Prisma schema fixed and ready
- Neon database connected (Stack Auth tables available)
- Groq API configured
- Stripe API configured
- GitHub integration ready
- Vercel deployment ready

❌ **Blocking Issue Fixed**:
- DATABASE_URL validation error - RESOLVED
- Prisma schema conflicts - RESOLVED

---

## Step 1: Initial Setup (30 minutes)

### 1.1 Set Environment Variables

Add to `.env.local` (for local development):
```env
# Database
DATABASE_URL=your_neon_connection_string

# OpenRouter (NEW - for AI features)
OPENROUTER_API_KEY=your_openrouter_api_key

# Groq
GROQ_API_KEY=your_groq_api_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stack Auth (if using - optional)
NEXT_PUBLIC_STACK_PROJECT_ID=your_project_id
STACK_SECRET_SERVER_KEY=your_secret_key
```

### 1.2 Setup OpenRouter Account

1. Go to https://openrouter.ai/
2. Sign up for account
3. Navigate to **Settings → API Keys**
4. Create new API key and copy it
5. Add to `.env.local` as `OPENROUTER_API_KEY`

### 1.3 Verify Database Connection

```bash
# Install dependencies
npm install

# Test Prisma connection
npx prisma db push

# Verify tables created
npx prisma studio
```

### 1.4 Start Development Server

```bash
npm run dev
# App should now run on http://localhost:3000 without errors
```

---

## Step 2: Build Authentication (Week 1)

### 2.1 Copy v0 Prompt Below

```
Build a complete authentication system for Next.js 15 with:

Core Features:
- Email/password registration with validation
- Email verification flow (send link, verify token)
- Login with email/password or Google OAuth
- Password reset via email
- Session management with HTTP-only cookies
- Protected routes with middleware
- Admin role support (admin, user)
- Redirect logic (non-logged-in users → /auth/login)

Tech Stack:
- Stack Auth from Neon database (neon_auth schema)
- Next.js 15 App Router + middleware.ts
- shadcn/ui forms with Zod validation
- TypeScript strict mode
- Prisma for queries

Files to Create:
- /app/auth/register/page.tsx - Signup form
- /app/auth/login/page.tsx - Login form
- /app/auth/forgot-password/page.tsx - Password reset
- /lib/auth/session.ts - Session utilities
- /app/api/auth/register/route.ts - Signup endpoint
- /app/api/auth/login/route.ts - Login endpoint
- /middleware.ts - Auth protection

Database:
Use existing neon_auth.user table:
- id (uuid)
- email (text)
- emailVerified (boolean)
- name (text)
- image (text)

UI:
- Dark theme with gradient accents (Jenni AI style)
- Responsive on mobile
- Show loading states
- Clear error messages
```

### 2.2 Use v0.dev

1. Go to https://v0.dev
2. Copy the prompt above
3. Paste into v0
4. Generate components
5. Download and merge into project

### 2.3 Integrate into Main App

- Update `/app/layout.tsx` to include auth provider
- Update navigation links to show user menu when authenticated
- Test login/signup flow

---

## Step 3: Build Document Editor (Week 1-2)

### 3.1 Install Tiptap Dependencies

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image
```

### 3.2 v0 Prompt for Editor

```
Build a professional document editor for Next.js 15 with:

Core Features:
- Tiptap 2 rich text editor
- Formatting toolbar (Bold, Italic, Heading 1-3, Bullet, Numbered, Code, Quote)
- Real-time word count and character count
- Reading time estimate
- Auto-save to database every 30 seconds (show save indicator)
- Document title editing
- Create new document / List documents / Delete document
- Protected to authenticated users only
- Keyboard shortcuts (Cmd+B, Cmd+I, Cmd+/, Cmd+S)
- Mobile-responsive (hide toolbar on small screens, bottom sheet)
- Dark/light theme support

Tech Stack:
- Tiptap 2 for editor
- React Query (useQuery, useMutation) for data fetching
- Prisma with documents table
- shadcn/ui components
- TypeScript

Database Schema:
```prisma
model Document {
  id        String   @id @default(cuid())
  userId    String   @db.Uuid
  title     String
  content   Json     // Tiptap JSON format
  wordCount Int      @default(0)
  status    String   @default("DRAFT")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Files to Create:
- /app/editor/[documentId]/page.tsx - Editor page
- /app/editor/new/page.tsx - Create new doc
- /components/editor/TiptapEditor.tsx - Core editor
- /components/editor/EditorToolbar.tsx - Toolbar
- /components/editor/DocumentStats.tsx - Stats display
- /app/api/documents/route.ts - List documents
- /app/api/documents/[documentId]/route.ts - Get/update/delete
- /app/api/documents/[documentId]/save/route.ts - Auto-save endpoint

UI:
- Clean, minimal interface (like Notion)
- Left sidebar with document list
- Main editor area
- Right sidebar with stats (word count, reading time)
- Top bar with title, save status, share button
```

### 3.3 Integrate into Main App

- Add "New Document" button to dashboard
- Create documents list page
- Add editor link in navigation
- Test create/edit/delete flow

---

## Step 4: Integrate Stripe Payments (Week 2)

### 4.1 Create Stripe Products

1. Go to Stripe Dashboard
2. Create 4 products:
   - Free ($0)
   - Pro ($9/month)
   - Premium ($29/month)
   - Enterprise (custom)

3. Get product IDs and add to constants

### 4.2 v0 Prompt for Stripe

```
Integrate Stripe subscriptions with:

Features:
- Pricing page showing 4 tiers (Free, Pro, Premium, Enterprise)
- Checkout flow using Stripe Session
- Subscription management page
- Upgrade/downgrade/cancel subscription
- Billing history with invoice download
- Feature gating based on tier
- Subscription status on dashboard
- Webhook handling for subscription events

Tech Stack:
- Stripe SDK (@stripe/stripe-js)
- Next.js API routes for webhooks
- Prisma for subscription storage
- shadcn/ui cards and buttons

Database:
```prisma
model Subscription {
  id                   String   @id @default(cuid())
  userId               String   @unique @db.Uuid
  tier                 String   @default("FREE")
  stripeSubscriptionId String?  @unique
  stripeCustomerId     String?
  status               String   @default("ACTIVE")
  renewalDate          DateTime?
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}
```

Files to Create:
- /app/pricing/page.tsx - Pricing page
- /app/dashboard/subscription/page.tsx - Manage subscription
- /app/api/stripe/checkout/route.ts - Create session
- /app/api/stripe/webhooks/route.ts - Handle events
- /lib/stripe/utils.ts - Helper functions

UI:
- Show pricing page with feature comparison table
- "Upgrade" button on each card
- Show current tier on dashboard
- Show next renewal date
```

### 4.3 Handle Webhook Events

Important webhook events:
- `customer.subscription.created` - New subscription
- `customer.subscription.updated` - Plan changed
- `customer.subscription.deleted` - Canceled
- `invoice.payment_succeeded` - Payment successful

---

## Step 5: OpenRouter AI Integration (Week 3)

### 5.1 Setup OpenRouter Configuration

Create `/lib/ai/openrouter.ts`:
```typescript
import { OpenRouter } from '@openrouter/sdk'

export const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'X-Title': 'ThesisAI',
  },
})

export const PROMPTS = {
  GRAMMAR_CHECK: `You are an academic writing expert...`,
  PLAGIARISM_CHECK: `Analyze this text for plagiarism patterns...`,
  TONE_ANALYSIS: `Check the academic tone of this text...`,
}
```

### 5.2 v0 Prompt for AI Suggestions

```
Build real-time AI writing suggestions using OpenRouter:

Features:
- Text selection triggers suggestion panel
- 4 suggestion types: Improve, Paraphrase, Expand, Check Tone
- Streaming response display
- Accept/Reject buttons to apply or dismiss
- Rate limiting based on subscription tier
- Side-by-side original vs suggested text
- Usage tracking and stats

Tech Stack:
- OpenRouter SDK for LLM
- Streaming responses
- React for UI
- Prisma for usage tracking

Database:
```prisma
model AIUsageStats {
  id                  String   @id @default(cuid())
  userId              String   @unique @db.Uuid
  suggestionsUsedToday Int     @default(0)
  totalSuggestions    Int      @default(0)
  lastResetDate       DateTime @default(now())
}
```

Files to Create:
- /app/api/ai/suggest/route.ts - Generate suggestions
- /components/ai/AISidebar.tsx - Suggestions panel
- /components/ai/SuggestionCard.tsx - Individual suggestion
- /lib/ai/suggestions.ts - Suggestion logic

Rate Limits:
- Free: 5/month
- Pro: 100/month
- Premium: Unlimited

UI:
- Right sidebar in editor
- Show suggestion with original in tooltip
- Streaming text animation
- Green accept button, red reject button
```

### 5.3 Integrate into Editor

- Add selection listener to editor
- Show AI sidebar when text selected
- Stream responses to sidebar
- Track usage for tier gating

---

## Step 6: Citation Management (Week 2-3)

### 6.1 v0 Prompt for Citations

```
Build citation management system:

Features:
- Citation form to add sources
- Format in APA, MLA, Chicago styles
- Insert citations into document as [1] references
- Bibliography generation
- Export as text or PDF
- Citation preview with all fields

Tech Stack:
- Zod for validation
- Prisma for storage
- citation-js for formatting (optional)
- shadcn/ui forms

Database:
```prisma
model Citation {
  id              String   @id @default(cuid())
  documentId      String
  title           String
  authors         String?
  publicationYear Int?
  source          String?
  url             String?
  doi             String?
  citationStyle   String   @default("APA")
  formattedText   String?
  createdAt       DateTime @default(now())
}
```

Files to Create:
- /components/citations/CitationManager.tsx
- /app/api/citations/format/route.ts
```

---

## Step 7: Plagiarism Detection (Week 4)

### 7.1 v0 Prompt for Plagiarism

```
Build plagiarism detection:

Features:
- One-click scan button
- AI-powered pattern detection using OpenRouter
- Similarity percentage 0-100%
- Highlight suspicious sections
- Matched sources display
- Rate limiting by tier
- Scan history
- Export report as PDF

Tech Stack:
- OpenRouter for pattern detection
- Prisma for scan history
- Recharts for visualization
```

---

## Step 8: Testing Checklist

Before deploying:

- [ ] Authentication (signup/login/logout)
- [ ] Document editor (create/edit/auto-save)
- [ ] Stripe checkout (upgrade plan)
- [ ] Webhook handling (subscription events)
- [ ] AI suggestions (real-time generation)
- [ ] Citation formatting (all 3 styles)
- [ ] Plagiarism scan (similarity scoring)
- [ ] Protected routes (non-logged-in redirects)
- [ ] Database queries (Prisma queries working)
- [ ] Error handling (graceful failures)
- [ ] Mobile responsiveness
- [ ] Dark theme toggle

---

## Deployment to Vercel

```bash
# 1. Commit all changes
git add .
git commit -m "Add features for Week 1"

# 2. Push to GitHub
git push origin thesis-writing-platform

# 3. Vercel auto-deploys (check dashboard)

# 4. Set environment variables in Vercel UI:
#    - DATABASE_URL
#    - OPENROUTER_API_KEY
#    - GROQ_API_KEY
#    - STRIPE_SECRET_KEY
#    - etc.

# 5. Run migrations in production
#    - Use Vercel CLI or go to Vercel dashboard
#    - npx vercel env pull && npx prisma migrate deploy
```

---

## Performance Tips

1. **Database**: Add indexes for frequent queries
   ```prisma
   @@index([userId, status])
   @@index([documentId, citationStyle])
   ```

2. **API**: Use SWR/React Query for client-side caching
   ```typescript
   const { data, mutate } = useSWR('/api/documents', fetcher)
   ```

3. **Streaming**: Use AI SDK streaming for long responses
   ```typescript
   const stream = openrouter.messages.stream({ ... })
   ```

4. **Images**: Use Next.js Image component
   ```typescript
   <Image src="/logo.png" width={200} height={200} />
   ```

---

## Troubleshooting

### "DATABASE_URL not found"
- Add to `.env.local` before running `npm run dev`
- Check Neon dashboard for connection string

### "OpenRouter API error"
- Verify API key in `.env.local`
- Check OpenRouter account has credit
- Test with curl first

### "Stripe webhook not firing"
- Verify webhook endpoint in Stripe dashboard
- Check webhook secret matches STRIPE_WEBHOOK_SECRET
- Test with Stripe CLI locally

### "Prisma schema error"
- Run `npx prisma generate`
- Run `npx prisma db push`
- Check schema.prisma for syntax

---

## Next Actions

1. ✅ Fix DATABASE_URL and schema → DONE
2. → Start Step 1 (Setup) 
3. → Complete Step 2 (Authentication) 
4. → Continue to Step 3+ 

Use this guide + v0.dev prompts to build features rapidly.
Estimated timeline: **4-6 weeks to full MVP deployment**

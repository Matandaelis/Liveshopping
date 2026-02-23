# ThesisAI File Structure & Reference

## Complete Project Structure

```
thesis-ai/
├── app/
│   ├── api/
│   │   ├── documents/
│   │   │   ├── route.ts              ✅ GET/POST all documents
│   │   │   └── [id]/
│   │   │       └── route.ts          ✅ GET/PUT/DELETE single document
│   │   ├── ai/
│   │   │   └── suggestions/
│   │   │       └── route.ts          ✅ POST AI suggestions (Groq)
│   │   ├── plagiarism/
│   │   │   └── check/
│   │   │       └── route.ts          ✅ POST plagiarism detection
│   │   ├── citations/
│   │   │   └── route.ts              ✅ GET/POST citations
│   │   ├── templates/
│   │   │   └── route.ts              ✅ GET/POST templates
│   │   ├── subscription/
│   │   │   ├── route.ts              ✅ GET/PUT subscription
│   │   │   └── checkout/
│   │   │       └── route.ts          ✅ POST Stripe checkout
│   │   ├── user/
│   │   │   └── stats/
│   │   │       └── route.ts          ✅ GET user statistics
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts          ✅ POST Stripe webhook
│   │
│   ├── dashboard/
│   │   ├── page.tsx                  ✅ Main dashboard
│   │   ├── DashboardContent.tsx      ✅ Dashboard UI component
│   │   └── editor/
│   │       └── page.tsx              ✅ Document editor
│   │
│   ├── pricing/
│   │   └── page.tsx                  ✅ Pricing page route
│   │
│   ├── layout.tsx                    📄 Root layout (Geist fonts)
│   ├── page.tsx                      📄 Landing page
│   └── globals.css                   📄 Global styles (TailwindCSS v4)
│
├── components/
│   ├── dashboard/
│   │   └── DashboardContent.tsx      ✅ Dashboard statistics & list
│   │
│   ├── landing/
│   │   └── PricingPage.tsx           ✅ Pricing page UI
│   │
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── input.tsx
│       ├── avatar.tsx
│       ├── popover.tsx
│       ├── command.tsx
│       ├── sheet.tsx
│       └── ... (shadcn/ui components)
│
├── lib/
│   ├── db.ts                        ✅ Prisma client singleton
│   ├── stripe.ts                    ✅ Stripe integration & webhooks
│   ├── subscriptions.ts             ✅ Tier logic & feature gating
│   ├── utils.ts                     📄 Tailwind cn() utility
│   └── ai-suggestions.ts            📝 (Groq client utils)
│
├── scripts/
│   ├── seed.ts                      ✅ Database seeding
│   └── setup-db.sh                  ✅ Setup script
│
├── prisma/
│   └── schema.prisma                ✅ Database schema (Neon)
│
├── public/
│   └── ... (static assets)
│
├── node_modules/
│
├── .env.local                       ⚙️ Environment variables
├── .env.local.example               📄 Example env vars
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
│
├── README.md                        📖 Main documentation
├── IMPLEMENTATION_COMPLETE.md       📖 Feature checklist
├── QUICK_START.md                   📖 Getting started guide
└── FILE_STRUCTURE.md                📄 This file
```

## Key Files Explained

### API Routes (Backend)

#### `/api/documents/route.ts`
```
GET  /api/documents           List all documents for user
POST /api/documents           Create new document
Body: { title, content, wordCount, status }
```

#### `/api/documents/[id]/route.ts`
```
GET    /api/documents/[id]    Get document by ID
PUT    /api/documents/[id]    Update document
DELETE /api/documents/[id]    Delete document
```

#### `/api/ai/suggestions/route.ts`
```
POST /api/ai/suggestions
Body: { text, type, documentId }
Types: improve, paraphrase, expand, grammar, summarize
Returns: { original, suggestion, type, usageRemaining }
```

#### `/api/plagiarism/check/route.ts`
```
POST /api/plagiarism/check
Body: { text, documentId }
Returns: { similarityPercentage, flaggedSections, scansRemaining }
```

#### `/api/citations/route.ts`
```
GET  /api/citations?documentId=X   Get citations for document
POST /api/citations                 Create citation
Body: { documentId, title, authors, year, citationStyle }
```

#### `/api/templates/route.ts`
```
GET  /api/templates?university=X   List templates
POST /api/templates                Create template
Body: { name, university, sections, fontSettings, marginSettings }
```

#### `/api/subscription/route.ts`
```
GET /api/subscription              Get user subscription
PUT /api/subscription              Update subscription
Body: { tier, status }
```

#### `/api/subscription/checkout/route.ts`
```
POST /api/subscription/checkout
Body: { tier }
Returns: { sessionId, url }
Redirects to Stripe checkout
```

#### `/api/webhooks/stripe/route.ts`
```
POST /api/webhooks/stripe
Handles Stripe events:
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
Updates database with subscription status
```

### Pages (Frontend)

#### `/app/page.tsx`
- Landing page
- Hero section
- Features overview
- CTA to dashboard/pricing

#### `/app/dashboard/page.tsx`
- User dashboard
- Document list
- Statistics display
- Quick action buttons
- Imports DashboardContent component

#### `/app/dashboard/editor/page.tsx`
- Document editor
- Full-screen editing
- Auto-save
- AI & plagiarism buttons
- Export functionality

#### `/app/pricing/page.tsx`
- Route wrapper
- Imports PricingPage component
- Sets metadata

### Components

#### `components/dashboard/DashboardContent.tsx`
- Displays user statistics
- Lists documents with actions
- Shows subscription tier
- Quick action cards
- Fetches data from API

#### `components/landing/PricingPage.tsx`
- 4 pricing tiers
- Feature comparison
- Billing toggle
- CTA buttons
- Stripe integration

### Utilities & Config

#### `lib/db.ts`
```typescript
export const prisma = new PrismaClient()
// Singleton pattern to avoid multiple connections
```

#### `lib/stripe.ts`
- Stripe client initialization
- Webhook event handling
- Subscription creation
- Payment processing

#### `lib/subscriptions.ts`
```typescript
export const SUBSCRIPTION_LIMITS = {
  FREE: { documents: 3, suggestions: 50, scans: 1 },
  PRO: { documents: 20, suggestions: 500, scans: 10 },
  PREMIUM: { documents: Infinity, suggestions: Infinity, scans: Infinity },
}
```

#### `prisma/schema.prisma`
- 13 database models
- Relationships configured
- Indexes for performance
- Neon PostgreSQL datasource

### Setup Scripts

#### `scripts/seed.ts`
- Creates test user
- Creates sample documents
- Creates citations
- Seeds analytics data

#### `scripts/setup-db.sh`
- Generates Prisma client
- Pushes schema to DB
- Runs seed script
- One-command setup

## Database Models

### User & Auth
- `User` - User accounts
- `Subscription` - User subscription tier
- `PaymentTransaction` - Payment history

### Content
- `Document` - Thesis documents
- `DocumentShare` - Document sharing
- `Citation` - Bibliography entries

### AI & Analysis
- `AIUsageStats` - Usage tracking
- `AIChat` - Conversation history
- `WritingFeedback` - AI feedback
- `PlagiarismScan` - Plagiarism results

### Reference
- `ThesisTemplate` - University templates
- `SubscriptionPlan` - Plan definitions

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_...

# AI
GROQ_API_KEY=gsk_...

# Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID=...
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=...
STACK_SECRET_SERVER_KEY=...

# App
NEXT_PUBLIC_URL=http://localhost:3000
NODE_ENV=development
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Frontend | React 19 |
| Styling | TailwindCSS 4 |
| Components | shadcn/ui |
| ORM | Prisma |
| Database | Neon PostgreSQL |
| AI | Groq LLM |
| Payments | Stripe |
| Auth | Stack Auth |
| Icons | Lucide React |
| Deploy | Vercel |

## Data Flow Diagrams

### Create Document
```
1. User clicks "New Document"
   ↓
2. POST /api/documents
   ↓
3. Prisma creates Document in DB
   ↓
4. Return document ID
   ↓
5. Redirect to /dashboard/editor?id=<id>
```

### AI Suggestion
```
1. User clicks "AI" button
   ↓
2. POST /api/ai/suggestions (text + type)
   ↓
3. Send to Groq API
   ↓
4. Groq returns improved text
   ↓
5. Prisma stores feedback
   ↓
6. Show suggestion to user
```

### Plagiarism Check
```
1. User clicks "Check" button
   ↓
2. POST /api/plagiarism/check (document text)
   ↓
3. Analyze similarity
   ↓
4. Create PlagiarismScan record
   ↓
5. Return percentage + flagged sections
   ↓
6. Display results to user
```

### Subscribe
```
1. User selects plan
   ↓
2. POST /api/subscription/checkout
   ↓
3. Create Stripe session
   ↓
4. Redirect to Stripe checkout
   ↓
5. User completes payment
   ↓
6. Stripe webhook fires
   ↓
7. POST /api/webhooks/stripe
   ↓
8. Update subscription in DB
```

## Common Tasks

### Add New API Endpoint
1. Create file: `app/api/path/route.ts`
2. Export handler: `export async function POST(req: NextRequest)`
3. Add Prisma query
4. Return NextResponse.json()

### Add New Database Model
1. Edit `prisma/schema.prisma`
2. Run: `npx prisma migrate dev`
3. Use in API routes with `prisma.modelName.create()`

### Add New Component
1. Create file: `components/feature/Component.tsx`
2. Export component
3. Import in page/component
4. Use with props

### Connect to Database
1. Import: `import { prisma } from '@/lib/db'`
2. Query: `prisma.document.findMany({ where: { userId } })`
3. Handle errors with try/catch

## Testing

### Dashboard
- Navigate to `/dashboard`
- See sample documents from seed
- Click "New Document"
- View statistics

### Editor
- Open document from dashboard
- Type text
- Click "AI" for suggestions
- Click "Check" for plagiarism
- Click "Export" to download

### API
- Use curl or Postman
- Send requests with `x-user-id` header
- Check responses and status codes

### Payments
- Go to `/pricing`
- Select plan
- Use test card: 4242 4242 4242 4242
- Complete checkout

---

**Last Updated**: 2026-02-23
**Status**: ✅ Complete & Ready

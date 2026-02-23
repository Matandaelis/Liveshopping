# ThesisAI Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Client (Next.js 15)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Landing    │  │   Dashboard  │  │    Editor    │              │
│  │     Page     │  │     Page     │  │     Page     │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│       │                    │                   │                    │
│       └────────────────────┼───────────────────┘                    │
│                            ↓                                        │
│                   Middleware (Auth Check)                           │
│                            ↓                                        │
└─────────────────────────────────────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ↓                    ↓                    ↓
   ┌─────────────┐   ┌──────────────┐   ┌──────────────┐
   │   Auth API  │   │ Document API │   │   Payment API│
   │  /api/auth  │   │ /api/docs    │   │ /api/stripe  │
   └─────────────┘   └──────────────┘   └──────────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             ↓
        ┌────────────────────────────────────────┐
        │  AI/OpenRouter API Layer               │
        │  /api/ai/suggest                       │
        │  /api/ai/chat                          │
        │  /api/plagiarism/check                 │
        └────────────────────────────────────────┘
                             ↓
        ┌────────────────────────────────────────┐
        │        Database Layer (Neon)           │
        │  ┌──────────────┬──────────────┐       │
        │  │ Stack Auth   │  ThesisAI    │       │
        │  │  Schema      │   Schema     │       │
        │  │              │              │       │
        │  │ - user       │ - documents  │       │
        │  │ - session    │ - citations  │       │
        │  │ - account    │ - templates  │       │
        │  └──────────────┴──────────────┘       │
        └────────────────────────────────────────┘
                             ↓
        ┌────────────────────────────────────────┐
        │    External Services                   │
        │  ┌─────────────┬────────┬────────────┐ │
        │  │  OpenRouter │ Groq   │  Stripe    │ │
        │  │  (AI)       │ (Fast) │ (Payments) │ │
        │  └─────────────┴────────┴────────────┘ │
        └────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 15 App Router
- **UI Library**: React 19 + shadcn/ui
- **Styling**: TailwindCSS 4
- **Editor**: Tiptap 2
- **State Management**: React Query / SWR
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Auth**: Stack Auth (Neon_auth schema)
- **API Requests**: Fetch API

### AI & External Services
- **LLM Provider**: OpenRouter (with 100+ model access)
- **Fast LLM**: Groq
- **Payments**: Stripe
- **Webhooks**: Stripe Webhooks

### Deployment
- **Platform**: Vercel
- **CI/CD**: GitHub Actions
- **Monitoring**: Vercel Analytics

---

## Database Schema

### Stack Auth Schema (neon_auth)
Pre-existing tables from Stack Auth:
```
user                    # User profiles
├── id (uuid)
├── email (text)
├── emailVerified (boolean)
├── name (text)
├── image (text)
├── role (text)
└── createdAt (timestamp)

session                 # Active sessions
├── id (uuid)
├── userId (uuid) → user.id
├── token (text)
├── expiresAt (timestamp)
└── userAgent (text)

account                 # OAuth connections
├── id (uuid)
├── userId (uuid) → user.id
├── provider (text)
├── providerAccountId (text)
└── accessToken (text)
```

### ThesisAI Schema (public)
Custom tables for application:

```
Document
├── id (uuid primary key)
├── userId (uuid) → user.id
├── title (text)
├── content (json) # Tiptap JSON format
├── wordCount (integer)
├── status (text) # DRAFT, SUBMITTED, ARCHIVED
├── templateId (uuid) → ThesisTemplate.id
├── createdAt (timestamp)
└── updatedAt (timestamp)

Subscription
├── id (uuid)
├── userId (uuid) → user.id (UNIQUE)
├── tier (text) # FREE, PRO, PREMIUM, ENTERPRISE
├── stripeSubscriptionId (text)
├── stripeCustomerId (text)
├── status (text) # ACTIVE, CANCELED
├── renewalDate (timestamp)
└── updatedAt (timestamp)

Citation
├── id (uuid)
├── documentId (uuid) → Document.id
├── title (text)
├── authors (text)
├── publicationYear (integer)
├── source (text)
├── url (text)
├── doi (text)
├── citationStyle (text) # APA, MLA, CHICAGO
├── formattedText (text)
└── createdAt (timestamp)

ThesisTemplate
├── id (uuid)
├── name (text)
├── university (text) # KU, KEMU, MKU, LAIKIPIA
├── sections (json)
├── marginSettings (json)
├── fontSettings (json)
├── isPublic (boolean)
└── createdAt (timestamp)

PlagiarismScan
├── id (uuid)
├── documentId (uuid) → Document.id
├── scanStatus (text) # PENDING, COMPLETED, FAILED
├── similarityPercentage (decimal)
├── matchedSources (json)
├── reportUrl (text)
└── createdAt (timestamp)

AIUsageStats
├── id (uuid)
├── userId (uuid) → user.id (UNIQUE)
├── suggestionsUsedToday (integer)
├── totalSuggestions (integer)
├── lastResetDate (timestamp)
└── updatedAt (timestamp)
```

---

## API Routes Structure

```
/app/api/

Auth
├── auth/register              POST   Create user account
├── auth/login                 POST   Create session
├── auth/logout                POST   Destroy session
├── auth/me                    GET    Get current user
└── auth/verify-email          POST   Verify email token

Documents
├── documents                  GET    List user documents
├── documents/create           POST   Create new document
├── documents/[id]             GET    Get document
├── documents/[id]             PUT    Update document
├── documents/[id]             DELETE Delete document
└── documents/[id]/save        POST   Auto-save

Citations
├── citations/format           POST   Format citation
├── citations/search           GET    Search academic sources
└── documents/[id]/citations   GET/POST/DELETE

AI & Writing
├── ai/suggest                 POST   Generate suggestions
├── ai/chat                    POST   Chat with AI
├── plagiarism/check           POST   Scan document
└── plagiarism/report/[id]     GET    Get scan report

Payments
├── stripe/checkout            POST   Create checkout session
├── stripe/subscription        GET    Get subscription status
├── stripe/cancel              POST   Cancel subscription
└── stripe/webhooks            POST   Handle Stripe events
```

---

## Authentication Flow

```
User Login:
  1. User enters email/password
  2. POST /api/auth/login
  3. Server:
     - Query Stack Auth user table
     - Verify password (bcrypt)
     - Create session token
     - Set HTTP-only cookie
  4. Client: Redirected to dashboard
  5. Middleware: Checks cookie on each request

Protected Routes:
  1. middleware.ts intercepts request
  2. Check for session cookie
  3. If missing: Redirect to /auth/login
  4. If valid: Allow access to route
  5. If expired: Clear cookie and redirect

Social OAuth:
  1. User clicks "Sign in with Google"
  2. Stack Auth handles OAuth flow
  3. Creates account automatically if first time
  4. Sets session cookie
  5. Redirected to dashboard
```

---

## AI Feature Architecture

### Real-Time Suggestions Flow
```
User selects text in editor
       ↓
Call /api/ai/suggest?text=...&type=grammar
       ↓
Backend:
  1. Check subscription tier for rate limit
  2. Query OpenRouter with prompt
  3. Stream response back to client
  4. Increment usage counter
       ↓
Client:
  1. Display streaming response in sidebar
  2. Show "Accept/Reject" buttons
  3. On Accept: Insert suggestion into editor
  4. On Reject: Dismiss and continue
```

### Plagiarism Detection Flow
```
User clicks "Check Plagiarism"
       ↓
POST /api/plagiarism/check with document content
       ↓
Backend:
  1. Check rate limit (tier-based)
  2. Analyze with OpenRouter patterns
  3. Store scan in database
  4. Return similarity percentage
       ↓
Client:
  1. Display loading animation
  2. Show similarity score when ready
  3. Highlight suspicious sections
  4. Show matched sources
```

---

## Subscription Tiers & Feature Gating

```
Free
├── Documents: 3
├── AI Suggestions: 5/month
├── Plagiarism Scans: 1/month
├── Collaboration: ❌
└── Support: Community

Pro ($9/month)
├── Documents: Unlimited
├── AI Suggestions: 100/month
├── Plagiarism Scans: 5/month
├── Collaboration: ❌
└── Support: Email

Premium ($29/month)
├── Documents: Unlimited
├── AI Suggestions: Unlimited
├── Plagiarism Scans: 20/month
├── Collaboration: ✅ (3 users)
└── Support: Priority

Enterprise (Custom)
├── Documents: Unlimited
├── AI Suggestions: Unlimited
├── Plagiarism Scans: Unlimited
├── Collaboration: ✅ (Unlimited)
└── Support: Dedicated
```

---

## Environment Variables

### Required
```env
# Database
DATABASE_URL=postgresql://user:password@host/db

# AI Services
OPENROUTER_API_KEY=sk_...
GROQ_API_KEY=gsk_...

# Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Auth (if using Stack Auth directly)
NEXT_PUBLIC_STACK_PROJECT_ID=...
STACK_SECRET_SERVER_KEY=...
```

### Optional
```env
# Email (for password resets)
RESEND_API_KEY=...

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=...

# Feature Flags
ENABLE_COLLABORATION=true
ENABLE_PLAGIARISM=true
```

---

## Performance Considerations

### Database
- Indexes on: `userId`, `status`, `documentId`, `stripeSubscriptionId`
- Connection pooling: Neon handles automatically
- Query optimization: Use Prisma relations selectively

### API
- Response streaming for long-running requests (AI suggestions)
- Response caching with SWR/React Query
- Rate limiting based on tier
- CDN for static assets (Vercel)

### Frontend
- Code splitting: Dynamic imports for routes
- Image optimization: Next.js Image component
- Bundle analysis: Track with `@next/bundle-analyzer`
- Lazy loading: Tiptap extensions on demand

### Caching Strategy
```
Static:
- CSS/JS: 1 year (immutable hashes)
- Images: 30 days
- Fonts: 1 year

Dynamic:
- User profile: 5 minutes
- Document list: 2 minutes
- Document content: Real-time (SWR with revalidation)
- Subscription: 1 hour
- Pricing: 24 hours
```

---

## Security Architecture

### Authentication
- Stack Auth handles user credentials securely
- Sessions stored in HTTP-only cookies
- CSRF tokens for form submissions
- JWT claims verified on each request

### Authorization
- Role-based access control (user, admin)
- Document ownership verified before access
- Subscription tier checked for feature access
- Admin-only endpoints protected

### Data Protection
- Database: Encrypted in transit (SSL/TLS)
- Passwords: Bcrypt hashing (Stack Auth)
- Sensitive data: Encrypted at rest (if needed)
- API keys: Never exposed to client

### API Security
- CORS: Restricted to same-origin + trusted domains
- Rate limiting: Per-user, per-IP
- Input validation: Zod schemas on all endpoints
- SQL injection: Prevented by Prisma ORM
- XSS: Prevented by React escaping + Content-Security-Policy

---

## Deployment Architecture

```
GitHub (Code Repository)
       ↓ (Webhook on push)
Vercel (Continuous Deployment)
  ├─ Build Stage
  │  └─ npm run build (Next.js compilation)
  ├─ Database Migrations (if needed)
  │  └─ npx prisma migrate deploy
  └─ Deploy Stage
     └─ Start Next.js server

Neon PostgreSQL (Database)
       ↓
Data Storage & Queries

Stripe (Payment Processing)
       ↓ (Webhooks)
API Route Handler
       ↓
Database Updates
```

---

## Monitoring & Logging

### Error Tracking
- Sentry integration (optional)
- Console logs for debugging
- Structured logging for errors

### Performance Monitoring
- Vercel Analytics Dashboard
- Web Vitals tracking
- API response time logging

### Usage Analytics
- Stripe dashboard for revenue
- Database queries for user metrics
- API logs for debugging

---

## Future Scalability

### Database Scaling
- Connection pooling: Use PgBouncer
- Read replicas: Route read queries to replicas
- Sharding: If user base > 1M

### API Scaling
- Serverless optimization: Already on Vercel Edge
- Caching layer: Redis for hot data
- Background jobs: Use Vercel Cron or Bull

### AI Service Scaling
- Model fine-tuning: Custom models for better results
- Local inference: MLX or similar for offline suggestions
- Batch processing: Process large documents in chunks

---

## Security Roadmap

Phase 1 (MVP):
- Basic auth + session management
- HTTPS/TLS for all communications
- Input validation on all endpoints
- Rate limiting

Phase 2:
- Two-factor authentication (2FA)
- Audit logging
- Data encryption at rest
- API keys with scopes

Phase 3:
- SOC2 compliance
- Penetration testing
- Advanced threat detection
- Disaster recovery plan


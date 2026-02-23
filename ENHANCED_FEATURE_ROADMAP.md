# ThesisAI - Enhanced Feature Roadmap with OpenRouter Integration

## Overview
This document provides a comprehensive implementation plan for ThesisAI, integrating **OpenRouter** as the primary AI backbone, alongside Groq (for fast inference), Stripe (payments), and Stack Auth (authentication). All features are designed to work seamlessly with the existing Neon PostgreSQL database and Next.js 15 App Router architecture.

---

## Phase 1: Core Foundation (Week 1-2) - Critical MVP Features

### 1.1 Fix Prisma Schema & Database Setup
**Status**: In Progress
**Objective**: Enable proper database access without validation errors
**Tasks**:
- Fix schema.prisma datasource (completed)
- Set DATABASE_URL environment variable
- Run `npx prisma migrate deploy` to create tables
- Verify Stack Auth tables integration

**Deliverables**:
- Working Prisma client
- All tables created in Neon
- No build-time validation errors

---

### 1.2 Authentication System (Stack Auth + Custom Layer)
**Status**: To Build
**Objective**: Seamless user signup, login, and session management
**Tech Stack**: Stack Auth (Neon_auth schema) + Next.js middleware + JWT cookies

**Key Features**:
- Email/password registration with verification
- Social OAuth integration (Google, GitHub)
- Password reset via email
- Session management with HTTP-only cookies
- Protected routes with middleware
- Role-based access (user, admin)

**Files to Create/Update**:
```
/app/auth/
  ├── register/page.tsx        # Signup form with validation
  ├── login/page.tsx           # Login form
  ├── forgot-password/page.tsx # Password reset
  └── verify-email/page.tsx    # Email verification

/app/api/auth/
  ├── register/route.ts        # User creation endpoint
  ├── login/route.ts           # Session creation
  ├── verify/route.ts          # Email verification
  └── logout/route.ts          # Session cleanup

/lib/auth/
  ├── stack-client.ts          # Stack Auth initialization
  ├── session.ts               # Session utilities
  └── middleware.ts            # Auth middleware

/middleware.ts                 # Global auth protection
```

**v0 Prompt**:
```
Build a complete authentication system for Next.js 15 with:
- Stack Auth integration from Neon database
- User registration with email verification
- Login/logout with JWT + HTTP-only cookies
- Password reset via email link
- Protected routes with middleware
- Admin role support
Use shadcn/ui forms with Zod validation and TypeScript
```

---

### 1.3 Document Editor with Tiptap
**Status**: To Build
**Objective**: Rich text editing with real-time stats, auto-save
**Tech Stack**: Tiptap 2, React Query, Prisma

**Key Features**:
- Rich text editor (bold, italic, headings, lists, code blocks)
- Real-time word/character count
- Auto-save every 30 seconds to database
- Document versioning/history
- Keyboard shortcuts (Cmd+B, Cmd+I, etc.)
- Collaborative cursor positions (prep for collab)
- Mobile-responsive editor
- Dark/light theme support

**Database Schema**:
```prisma
model Document {
  id           String    @id @default(cuid())
  userId       String    @db.Uuid
  title        String
  content      Json      @default("[]")  # Tiptap JSON
  wordCount    Int       @default(0)
  status       String    @default("DRAFT")
  templateId   String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  citations    Citation[]
  plagiarismScans PlagiarismScan[]
  
  @@index([userId, status])
}
```

**Files to Create**:
```
/app/editor/
  ├── [documentId]/page.tsx     # Editor page
  └── new/page.tsx              # Create new document

/components/editor/
  ├── TiptapEditor.tsx          # Core editor component
  ├── EditorToolbar.tsx         # Formatting toolbar
  ├── DocumentHeader.tsx        # Title + document info
  ├── DocumentStats.tsx         # Word count, etc.
  └── SaveIndicator.tsx         # Auto-save status

/app/api/documents/
  ├── route.ts                  # List documents
  ├── create/route.ts           # Create new
  └── [documentId]/
      ├── route.ts              # Get/update/delete
      └── save/route.ts         # Auto-save endpoint

/lib/editor/
  ├── tiptap-config.ts          # Editor configuration
  ├── extensions.ts             # Custom extensions
  └── utils.ts                  # Helper functions
```

**v0 Prompt**:
```
Build a professional document editor with:
- Tiptap 2 rich text editor (Bold, Italic, Headings, Lists, Code blocks)
- Real-time word count and reading time
- Auto-save to database every 30 seconds
- Document title editing
- Create/list/delete documents
- Protected routes (login required)
- Keyboard shortcuts (Cmd+B, Cmd+I, Cmd+S)
- Responsive design for mobile
Use React Query for state management, Prisma for database, shadcn/ui for UI
```

---

### 1.4 Stripe Subscription System
**Status**: To Build
**Objective**: 4-tier subscription model with feature gating
**Tech Stack**: Stripe SDK, webhooks, Prisma

**Subscription Tiers**:
| Feature | Free | Pro | Premium | Enterprise |
|---------|------|-----|---------|------------|
| Monthly Cost | $0 | $9 | $29 | Custom |
| Documents | 3 | Unlimited | Unlimited | Unlimited |
| AI Suggestions | 5/month | 100/month | Unlimited | Unlimited |
| Plagiarism Scans | 1/month | 5/month | 20/month | Unlimited |
| Collaboration | ❌ | ❌ | ✅ | ✅ |
| Priority Support | ❌ | ❌ | ✅ | ✅ |

**Database Schema**:
```prisma
model Subscription {
  id                   String   @id @default(cuid())
  userId               String   @unique @db.Uuid
  tier                 String   @default("FREE")
  stripeSubscriptionId String?  @unique
  stripeCustomerId     String?
  status               String   @default("ACTIVE")
  startDate            DateTime @default(now())
  renewalDate          DateTime?
  aiSuggestionsUsed    Int      @default(0)
  plagiarismScansUsed  Int      @default(0)
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  
  @@index([userId, stripeSubscriptionId])
}
```

**Files to Create**:
```
/app/pricing/page.tsx              # Pricing page

/app/dashboard/
  ├── subscription/page.tsx        # Manage subscription
  └── billing/page.tsx             # Billing history

/app/api/stripe/
  ├── checkout/route.ts            # Create checkout session
  ├── subscription/route.ts        # Get subscription status
  ├── invoice/route.ts             # Get invoices
  └── webhooks/route.ts            # Handle Stripe events

/lib/stripe/
  ├── client.ts                    # Stripe SDK setup
  ├── webhook-handler.ts           # Process webhooks
  └── utils.ts                     # Helper functions

/components/pricing/
  ├── PricingCard.tsx             # Individual tier card
  ├── PricingFeature.tsx          # Feature comparison
  └── UpgradeButton.tsx           # CTA button
```

**v0 Prompt**:
```
Integrate Stripe payments with:
- 4-tier subscription model (Free/Pro/Premium/Enterprise)
- Checkout flow with Stripe Hosted Payment Form
- Webhook handling for subscription events (created, updated, deleted)
- Subscription management page (upgrade/downgrade/cancel)
- Invoice history and PDF download
- Feature gating based on tier
- Stripe customer portal link
Use Stripe SDK, Prisma for database, shadcn/ui for UI, TypeScript
```

---

## Phase 2: AI & Content Features (Week 3-4) - Core Value Add

### 2.1 OpenRouter AI Integration (Central AI Hub)
**Status**: To Build (Critical)
**Objective**: Unified AI interface using OpenRouter for cost-effective model selection
**Tech Stack**: OpenRouter SDK, AI SDK 6, streaming

**Why OpenRouter**?
- Access to 100+ models (Claude, GPT-4, Llama, Mistral, etc.)
- Cost optimization (pick best model for each task)
- Fallback routing if model fails
- Usage tracking and rate limiting
- No vendor lock-in

**Setup**:
```typescript
// lib/ai/openrouter.ts
import { OpenRouter } from '@openrouter/sdk'

export const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'X-Title': 'ThesisAI',
  },
})

// Prompts registry
export const PROMPTS = {
  GRAMMAR_CHECK: `You are an academic writing expert. Check the grammar, clarity, and tone of the following text. Provide specific corrections.`,
  
  PLAGIARISM_CHECK: `Analyze this text for suspicious patterns that might indicate plagiarism. Look for overly formal sections, inconsistent voice, or copying patterns.`,
  
  RESEARCH_SUGGESTION: `Based on this thesis topic, suggest 5 key academic sources to cite. Return as JSON array with {title, authors, year, url}.`,
  
  TONE_ANALYSIS: `Analyze the academic tone of this text. Is it formal enough? Suggest improvements for clarity and precision.`,
  
  CITATION_HELPER: `Help format this citation in APA/MLA/Chicago format based on provided source metadata.`,
}
```

**Database Schema**:
```prisma
model AIUsageStats {
  id                  String   @id @default(cuid())
  userId              String   @unique @db.Uuid
  suggestionsUsedToday Int     @default(0)
  scansUsedToday      Int      @default(0)
  chatsToday          Int      @default(0)
  lastResetDate       DateTime @default(now())
  totalSuggestions    Int      @default(0)
  totalScans          Int      @default(0)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  
  @@index([userId])
}
```

**v0 Prompt**:
```
Set up OpenRouter AI integration for Next.js with:
- OpenRouter SDK initialization
- Environment variable configuration (OPENROUTER_API_KEY)
- Utility functions for different prompts (grammar, plagiarism, tone, research)
- Usage tracking and rate limiting by subscription tier
- Error handling and fallback models
- Streaming response support
- TypeScript types for all AI responses
Return prompts, model selection logic, and usage tracking system
```

---

### 2.2 AI Writing Suggestions (Real-Time)
**Status**: To Build
**Objective**: Context-aware writing improvement using OpenRouter + Groq
**Features**: Grammar, tone, clarity, plagiarism-friendliness

**Architecture**:
```
Editor (text selection) → API /api/ai/suggest
  → OpenRouter: Quick suggestions (Groq/Mistral)
  → Database: Store stats
  → Stream response to sidebar
  → User: Accept/Reject/Apply
```

**Files to Create**:
```
/app/api/ai/
  ├── suggest/route.ts          # Real-time suggestions
  ├── improve/route.ts          # Detailed improvements
  └── research/route.ts         # Research suggestions

/components/ai/
  ├── AISidebar.tsx             # Suggestions panel
  ├── SuggestionCard.tsx        # Individual suggestion
  ├── StreamingText.tsx         # Streaming response display
  └── AcceptButton.tsx          # Apply suggestion

/lib/ai/
  ├── suggestions.ts            # Suggestion logic
  ├── prompts.ts                # AI prompts library
  └── streaming.ts              # Streaming utilities
```

**v0 Prompt**:
```
Build real-time AI writing suggestions with:
- Text selection in editor triggers suggestion panel
- OpenRouter for fast suggestions (use Groq llama-3.3 for speed)
- Show multiple suggestions (improve, paraphrase, expand, tone-check)
- Streaming response display with typewriter effect
- Accept/Reject/Apply buttons
- Rate limiting by subscription tier (Free: 5, Pro: 100, Premium: Unlimited)
- Side-by-side original vs suggested text
- Track usage statistics
Use OpenRouter SDK, Prisma for stats, streaming responses, shadcn/ui
```

---

### 2.3 Citation Management (APA/MLA/Chicago)
**Status**: To Build
**Objective**: Easy citation insertion with multiple format support
**Tech Stack**: citation-js library, OpenRouter for verification

**Database Schema**:
```prisma
model Citation {
  id              String   @id @default(cuid())
  documentId      String
  document        Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
  title           String
  authors         String?
  publicationYear Int?
  source          String?
  url             String?
  doi             String?
  citationStyle   String   @default("APA")
  formattedText   String?
  createdAt       DateTime @default(now())
  
  @@index([documentId])
}
```

**Files to Create**:
```
/components/citations/
  ├── CitationManager.tsx       # Main citation UI
  ├── CitationForm.tsx          # Add new citation
  ├── CitationPreview.tsx       # Preview formatted citation
  ├── BibliographyGenerator.tsx # Generate bibliography
  └── CitationSearch.tsx        # Search academic sources

/app/api/citations/
  ├── format/route.ts           # Format citations
  ├── search/route.ts           # Search sources
  └── [documentId]/route.ts     # Get/add/delete

/lib/citations/
  ├── formatter.ts              # APA/MLA/Chicago formatting
  ├── validators.ts             # Citation validation
  └── academic-search.ts        # Academic source search
```

**v0 Prompt**:
```
Build citation management system with:
- Citation form with fields: title, authors, year, source, URL, DOI
- Support for APA 7th, MLA 8th, Chicago Manual styles
- Real-time citation preview and formatting
- Bibliography generation and export (as text, PDF, Word)
- Citation search from academic databases
- Insert citations into document as inline references [1]
- Copy formatted citations to clipboard
- Citation history for document
Use citation-js, Prisma for storage, shadcn/ui forms, TypeScript validation
```

---

### 2.4 Plagiarism Detection Integration
**Status**: To Build
**Objective**: Fast plagiarism scoring with pattern analysis
**Tech Stack**: OpenRouter for AI analysis + external API (optional)

**Architecture**:
```
User clicks "Check Plagiarism"
→ Send document to /api/plagiarism/check
→ Analyze with OpenRouter (detect suspicious patterns)
→ Compare against indexed sources (optional: Turnitin/Copyscape)
→ Generate similarity score (0-100%)
→ Store report in database
→ Display results with highlighted sections
```

**Files to Create**:
```
/app/api/plagiarism/
  ├── check/route.ts            # Scan document
  ├── report/[scanId]/route.ts  # Get report details
  └── history/route.ts          # Scan history

/components/plagiarism/
  ├── PlagiarismChecker.tsx     # Main component
  ├── SimilarityReport.tsx      # Report display
  ├── SourceMatch.tsx           # Source match details
  └── PlagiarismChart.tsx       # Similarity visualization

/lib/plagiarism/
  ├── scanner.ts                # Scanning logic
  ├── pattern-detector.ts       # Pattern analysis
  └── api-clients.ts            # External APIs
```

**v0 Prompt**:
```
Build plagiarism detection with:
- One-click plagiarism scan
- AI pattern detection using OpenRouter
- Similarity percentage (0-100%)
- Highlight suspicious sections in document
- Show matched sources and quotes
- Rate limiting by tier (Free: 1/month, Pro: 5/month, Premium: 20/month)
- Scan history with timestamps
- Report export as PDF
- Subscription gating
Use OpenRouter for analysis, Prisma for history, D3/Recharts for visualization
```

---

### 2.5 Academic Research Helper (Jennie AI Feature Parity)
**Status**: To Build
**Objective**: AI copilot for research recommendations
**Tech Stack**: OpenRouter with Claude for research analysis

**Features**:
- Topic analysis and research direction
- Source recommendations (with links)
- Research outline generation
- Literature review suggestions
- Real-time chat interface

**Files to Create**:
```
/components/research/
  ├── ResearchHelper.tsx        # Chat interface
  ├── ResearchPrompt.tsx        # Topic input
  ├── SourceRecommendation.tsx  # Source cards
  └── OutlineGenerator.tsx      # Outline display

/app/api/research/
  ├── analyze/route.ts          # Analyze topic
  ├── chat/route.ts             # Research chat
  └── sources/route.ts          # Get recommendations
```

**v0 Prompt**:
```
Build academic research helper with:
- Research topic input and analysis
- AI-powered source recommendations (5-10 per topic)
- Literature review outline generation
- Real-time chat for research questions
- Integration with academic databases
- Streaming responses
- Copy/export recommendations
Use OpenRouter (Claude for depth), streaming, Prisma for caching, shadcn/ui chat interface
```

---

## Phase 3: Collaboration & Advanced (Week 5-6)

### 3.1 Real-Time Collaboration (Inspired by Yomu)
**Status**: To Build (Optional for MVP)
**Objective**: Multi-user simultaneous editing
**Tech Stack**: Yjs + WebSocket + Liveblocks (or custom)

**Features**:
- Multiple users editing same document
- Real-time cursor positions
- Change synchronization
- Comments/annotations
- Version history
- Conflict resolution

**v0 Prompt**:
```
Build real-time collaboration features with:
- Invite supervisor/peers to collaborate
- Real-time document synchronization (Yjs)
- Cursor positions for each collaborator
- Comments and annotations
- Version history and rollback
- Permission levels (view, comment, edit, admin)
- Activity log
Use Liveblocks or custom WebSocket, Yjs for CRDT, Prisma for storage
```

---

### 3.2 Advanced Document Management
**Status**: To Build
**Objective**: Organize, search, and manage documents
**Features**:
- Folder organization
- Document search
- Tagging system
- Sharing with others
- Document templates

---

## Phase 4: User Experience & Analytics (Week 7-8)

### 4.1 Dashboard & Analytics
**Status**: To Build
**Objective**: User writing progress and platform insights
**Components**:
- Writing statistics
- Document overview
- Subscription status
- Activity log
- Usage charts

**v0 Prompt**:
```
Build user dashboard with:
- Writing statistics (total words, documents, time spent)
- Document cards with recent activity
- Subscription status and renewal date
- AI usage stats for the month
- Charts using Recharts
- Quick actions (new document, upgrade, etc.)
Use Recharts for charts, Prisma for data, shadcn/ui components
```

---

### 4.2 Admin Dashboard
**Status**: To Build
**Objective**: Platform management and monitoring
**Features**:
- User management
- Subscription analytics
- Feature usage tracking
- Revenue dashboard
- Content moderation

---

## Implementation Best Practices

### Performance Optimization
1. **Database**: Index frequently queried fields
2. **API**: Implement request caching with SWR/React Query
3. **Streaming**: Use streaming for long-running requests
4. **Images**: Optimize with Next.js Image component
5. **Bundle**: Code split with dynamic imports

### Security
1. **Auth**: Secure sessions with HTTP-only cookies
2. **API**: Rate limiting and CORS protection
3. **Input**: Validate all user inputs with Zod
4. **SQL**: Use Prisma parameterized queries
5. **Secrets**: Keep API keys in environment variables

### Code Quality
1. **TypeScript**: Strict mode enabled
2. **Linting**: ESLint + Prettier
3. **Testing**: Unit tests for critical paths
4. **Documentation**: JSDoc comments
5. **Error Handling**: Graceful error boundaries

---

## OpenRouter vs Groq Comparison

| Aspect | OpenRouter | Groq |
|--------|-----------|------|
| Models | 100+ options | Limited (LLaMA, Mixtral) |
| Speed | Fast | Fastest (~10ms) |
| Cost | Varies by model | Cheap/free tier |
| Use Case | General AI | Real-time suggestions |
| Integration | SDK available | Direct API |

**Recommendation**:
- Use **Groq** for real-time suggestions (< 500ms latency)
- Use **OpenRouter** for deep analysis and research (flexibility)
- Fallback chain: Groq → OpenRouter → Cached response

---

## Deployment Checklist

- [ ] Set all environment variables
- [ ] Run database migrations (`npx prisma migrate deploy`)
- [ ] Test authentication flow
- [ ] Verify Stripe webhook configuration
- [ ] Test OpenRouter integration
- [ ] Security audit (CORS, CSP, etc.)
- [ ] Performance testing
- [ ] SEO optimization
- [ ] Legal pages (ToS, Privacy)
- [ ] Email verification working
- [ ] Deploy to Vercel

---

## Timeline

| Phase | Duration | Target Date |
|-------|----------|------------|
| Phase 1 (Core) | 2 weeks | March 9, 2026 |
| Phase 2 (AI) | 2 weeks | March 23, 2026 |
| Phase 3 (Collab) | 2 weeks | April 6, 2026 |
| Phase 4 (Polish) | 2 weeks | April 20, 2026 |
| **MVP Launch** | | **April 20, 2026** |

---

## Next Steps

1. ✅ Fix Prisma schema and DATABASE_URL
2. Start Phase 1 with authentication
3. Build editor (Tiptap integration)
4. Integrate Stripe payments
5. Add OpenRouter AI features

Use v0.dev with provided prompts to accelerate development.

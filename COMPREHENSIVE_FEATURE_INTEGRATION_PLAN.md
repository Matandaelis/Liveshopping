# ThesisAI Comprehensive Feature Integration Plan

## Current Infrastructure Analysis

### Available Resources
- **Database**: Neon PostgreSQL with Stack Auth (neon_auth schema)
- **Auth**: Stack Auth pre-configured with user, session, account tables
- **Payment**: Stripe fully configured with API keys
- **Framework**: Next.js 15 App Router + TypeScript + TailwindCSS 4
- **UI**: shadcn/ui + Radix UI components
- **AI APIs**: Groq and Anthropic available (env vars ready to add)

### Existing Schema (Neon)
- `neon_auth.user` - Core user accounts
- `neon_auth.session` - Session management
- `neon_auth.organization` - Team/organization support
- `neon_auth.account` - Social auth accounts
- `neon_auth.verification` - Email verification tokens

### Critical Issue to Resolve First
- Prisma schema validation fails because DATABASE_URL not available during dev startup
- Keystone disabled (User table from keystone.ts doesn't exist in DB)
- Solution: Use Stack Auth tables directly instead of creating separate Keystone User table

## Revised Architecture Strategy

### Phase 1: Foundation Setup (Days 1-2)

#### 1.1 Fix Environment & Prisma Configuration
- Remove Prisma schema validation from startup
- Create `.env.production` with actual Neon connection
- Set up proper build configuration
- Status: Ready to implement

#### 1.2 Leverage Stack Auth for Authentication
- Use existing `neon_auth.user` table directly
- Build auth middleware using Stack Auth JWT tokens
- Create protected route wrappers
- Status: Stack Auth tables exist, ready to integrate

#### 1.3 Extend Database Schema for ThesisAI
- Create `public.documents` table
- Create `public.subscriptions` table  
- Create `public.citations` table
- Create `public.thesis_templates` table
- Create `public.ai_usage` table
- Status: Schema planned, ready for migration

### Phase 2: Core Features (Days 3-7)

#### 2.1 Authentication Enhancement
- Login page with Stack Auth integration
- Registration with email verification
- Dashboard access control
- Profile management
- Integration: Use Stack Auth SDK directly

#### 2.2 Document Editor (Jenni AI Clone Features)
- Tiptap editor with prose styling
- Real-time word count display
- Auto-save with React Query
- Cmd+/ keyboard shortcut detection
- Document list with search
- Integration: Neon for persistence

#### 2.3 Subscription Management
- Stripe checkout integration
- Subscription tier enforcement
- Feature gating based on tier
- Upgrade/downgrade flow
- Invoice history
- Integration: Stripe webhooks + Neon tracking

#### 2.4 Citation System (Jenni AI Feature)
- Citation input form with metadata
- Multiple format support (APA, MLA, Chicago, Harvard)
- Bibliography generation
- Inline citation insertion [1] [2]
- Citation hover popover with paper preview
- Integration: Citation library + Neon storage

### Phase 3: AI Features (Days 8-12)

#### 3.1 AI Writing Suggestions (Jenni AI Style)
- Real-time grammar suggestions via Groq
- Style improvements via Claude
- 400ms debounce on suggestions
- Accept/dismiss UI in sidebar
- Streaming responses
- Integration: Groq + Anthropic APIs

#### 3.2 AI Copilot Chat
- Academic writing assistant
- Research recommendations
- Writing help Q&A
- Context-aware suggestions
- Integration: AI SDK 6 with streaming

#### 3.3 Plagiarism Detection
- Integration with plagiarism API
- Similarity percentage display
- Matched sources visualization
- Scan history tracking
- Integration: Third-party plagiarism service

### Phase 4: Advanced Features (Days 13-16)

#### 4.1 Collaboration
- Real-time collaborative editing
- Supervisor/peer invitations
- Comments and annotations
- Permission management
- Integration: Yjs or Liveblocks

#### 4.2 Thesis Templates
- Kenyan university templates (KU, KEMU, MKU, Laikipia)
- Template preview and selection
- Auto-formatting on apply
- Custom template upload
- Integration: Template JSON + Neon storage

#### 4.3 Analytics Dashboard
- Writing progress tracking
- AI usage statistics
- Submission readiness score
- Grade predictions
- Integration: React Query + Recharts

#### 4.4 Admin Controls
- User management
- Subscription analytics
- Feature usage tracking
- Support ticket system
- Integration: Neon queries

## Recommended Implementation Order

### Week 1: MVP Launch
1. Fix Prisma/DATABASE_URL issue (4 hours)
2. Build authentication flow with Stack Auth (8 hours)
3. Create document editor with Tiptap (12 hours)
4. Implement Stripe subscription (8 hours)
5. Basic citation management (6 hours)

**Deliverable**: Working app with auth, editor, and payment

### Week 2: Enhanced Features
6. Thesis templates for Kenyan universities (6 hours)
7. AI writing suggestions with Groq (8 hours)
8. Citation formatting system (6 hours)
9. Dashboard and analytics (8 hours)
10. Plagiarism detection (6 hours)

**Deliverable**: Feature-complete with AI assistance

### Week 3: Polish & Scale
11. Real-time collaboration (10 hours)
12. Mobile optimization and PWA (8 hours)
13. Email notifications (6 hours)
14. Admin dashboard (8 hours)
15. Performance optimization (10 hours)

**Deliverable**: Production-ready application

## v0 Generation Prompts (Ready to Use)

### Prompt 1: Fix Environment (Use First)
```
Next.js 15 app with Neon PostgreSQL database:
1. Create .env file that prevents Prisma schema validation errors
2. Disable Keystone initialization entirely
3. Set up simple environment variable loading for dev/prod
4. Keep existing next.config.ts and layout.tsx working
5. Ensure landing page renders at / without database connection
Only modify: package.json, keystone.ts, .env, .env.local, middleware.ts
```

### Prompt 2: Add Stack Auth Integration
```
Next.js 15 authentication with Stack Auth (existing neon_auth tables):
1. Create login page at /auth/login with email/password form
2. Create registration page at /auth/register with email verification
3. Create protected /dashboard page with auth check
4. Build auth middleware to check Stack Auth JWT tokens
5. Add user profile page at /profile
Use Stack Auth SDK directly, Neon PostgreSQL, shadcn/ui forms
```

### Prompt 3: Build Document Editor
```
Jenni AI-style document editor with:
1. Page at /editor/[id] with Tiptap editor (prose styling)
2. Real-time word count display top-right
3. Auto-save every 30 seconds using React Query
4. Left sidebar: document list with create/search/filter
5. Right sidebar: AI suggestions placeholder
6. Cmd+/ shortcut detection (display "AI Autocomplete" badge)
Keyboard shortcuts: Cmd+B bold, Cmd+I italic, Cmd+K link, Tab accept suggestion
```

### Prompt 4: Stripe Subscription Integration
```
Stripe subscription management for Next.js 15 app:
1. Create /pricing page showing 4 tiers (Free, Pro, Premium, Enterprise)
2. Build checkout flow with Stripe checkout session
3. Implement webhook handler for subscription.updated/canceled events
4. Create /subscription/manage page with upgrade/downgrade buttons
5. Add feature gating middleware (check subscription tier)
6. Store subscription data in Neon (subscriptions table)
7. Display current tier on dashboard
```

### Prompt 5: Citation Management
```
Citation system with Jenni AI-style hover popovers:
1. Create citation input form (title, authors, source, DOI)
2. Support APA, MLA, Chicago, Harvard citation formats
3. Inline citations in editor show as [1] [2] badges
4. On hover: popover with formatted citation + paper preview + copy button
5. Bibliography generation from citations
6. API route for formatting citations in different styles
7. Citation storage in Neon citations table
```

### Prompt 6: Kenyan University Templates
```
Thesis templates for Kenyan universities (Jenni AI feature):
1. Page at /templates showing KU, KEMU, MKU, Laikipia templates
2. Template preview card with document structure visualization
3. "Use Template" button creates new document with pre-formatted structure
4. Store template JSON in Neon
5. Support for custom margins, fonts, section ordering
6. Auto-format document when template applied
7. Show university-specific requirements (KU requirements vs KEMU requirements)
```

### Prompt 7: AI Writing Suggestions
```
Real-time AI writing suggestions (Jenni AI feature):
1. Right sidebar component for suggestions
2. Use Groq API for real-time grammar checking (400ms debounce)
3. Use Claude for deeper style feedback
4. Stream responses as they arrive
5. Show confidence percentage for each suggestion
6. Accept button: apply suggestion to editor
7. Dismiss button: hide suggestion
8. Track AI usage count for subscription limits
```

### Prompt 8: Plagiarism Detection
```
Plagiarism detection integration:
1. Add "Check Plagiarism" button in editor toolbar
2. Call plagiarism API (Turnitin/Grammarly) with document text
3. Display similarity percentage (0-100%)
4. Show matched sources list
5. Store plagiarism reports in Neon
6. Subscription tier controls: Free=1 scan/day, Pro=10, Premium=unlimited
7. Show scan history with timestamps
```

## Database Migration Strategy

### Step 1: Create New Tables (Alongside existing neon_auth)
```sql
-- In public schema (separate from neon_auth)
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES neon_auth.user(id),
  title TEXT NOT NULL,
  content JSONB DEFAULT '[]',
  word_count INT DEFAULT 0,
  status TEXT DEFAULT 'DRAFT',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES neon_auth.user(id),
  tier TEXT DEFAULT 'FREE',
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT now(),
  expires_at TIMESTAMP
);

-- Similar for citations, templates, ai_usage, etc.
```

### Step 2: Use Prisma Client Library
- Install `@prisma/client` as production dependency
- Connect to Neon using DATABASE_URL
- Use Prisma Client in API routes for queries

### Step 3: Migration Execution
- Run prisma migrations in development first
- Test thoroughly
- Deploy to production

## Integration Checklist

- [ ] Fix DATABASE_URL loading and Prisma validation
- [ ] Set up Stack Auth middleware
- [ ] Create auth pages (login/register/profile)
- [ ] Build document editor with Tiptap
- [ ] Implement Stripe integration
- [ ] Add citation management
- [ ] Create thesis templates
- [ ] Add AI writing suggestions
- [ ] Implement plagiarism detection
- [ ] Build collaboration features
- [ ] Create analytics dashboard
- [ ] Set up admin controls
- [ ] Mobile optimization
- [ ] Email notifications
- [ ] Performance optimization

## Success Metrics

- Landing page loads without DATABASE_URL errors
- Users can register and log in via Stack Auth
- Documents persist and auto-save to Neon
- Stripe checkout completes successfully
- AI suggestions appear within 400ms
- Citations display with hover popovers
- Mobile editor is fully functional
- All Kenyan university templates available
- Admin can view usage analytics
- Zero security vulnerabilities

---

**Status**: Ready to begin implementation. Start with Prompt 1 (Environment Fix) immediately to unblock development.

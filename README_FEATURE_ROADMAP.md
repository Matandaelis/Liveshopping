# ThesisAI Academic PaaS - Complete Feature Roadmap

## Executive Summary

ThesisAI is a Jenni AI clone built on next-keystone-starter with Next.js 15, TypeScript, TailwindCSS 4, and shadcn/ui. The application combines academic writing assistance with AI-powered features tailored for Kenyan universities.

**Current Status**: Foundation complete, ready for feature implementation
**Time to MVP**: 2-3 weeks using v0.dev for feature generation
**Target Launch**: Beta in 3-4 weeks

## Core Features Matrix

| Feature | Phase | Status | Priority | Hours | Jenni-Inspired? |
|---------|-------|--------|----------|-------|-----------------|
| Authentication | 1 | Ready | CRITICAL | 4-6 | No |
| Document Editor | 1 | Ready | CRITICAL | 8-12 | Yes |
| Stripe Payments | 1 | Ready | HIGH | 6-8 | No |
| Citations | 1 | Ready | HIGH | 8-10 | Yes |
| Templates | 1 | Ready | MEDIUM | 6-8 | Partial |
| AI Suggestions | 2 | Ready | HIGH | 8-10 | Yes |
| Plagiarism Detection | 2 | Ready | HIGH | 6-8 | Yes |
| Collaboration | 3 | Planned | MEDIUM | 12-16 | No |
| Analytics Dashboard | 3 | Planned | MEDIUM | 8-10 | No |
| Admin Controls | 4 | Planned | LOW | 8-10 | No |

## Architecture Overview

### Technology Stack
- **Frontend**: Next.js 15 App Router, React 19, TypeScript
- **UI Framework**: shadcn/ui 0.9 + Radix UI
- **Styling**: TailwindCSS 4, custom design tokens
- **Database**: Neon PostgreSQL with Stack Auth
- **ORM**: Prisma with custom schema
- **Editor**: Tiptap (ProseEditor-based)
- **Payments**: Stripe Checkout + Webhooks
- **AI Integration**: Groq (real-time), Anthropic Claude (detailed)
- **Auth**: Stack Auth (pre-configured)
- **Real-time**: WebSockets (future: Yjs for collaboration)

### Database Schema
```
neon_auth.user          (Stack Auth - existing)
neon_auth.session       (Stack Auth - existing)
neon_auth.organization  (Stack Auth - existing)

public.documents        (User thesis documents)
public.subscriptions    (Stripe subscription tracking)
public.citations        (Citation management)
public.thesis_templates (University thesis formats)
public.plagiarism_scans (Plagiarism detection results)
public.ai_usage_stats   (Feature usage tracking)
```

## Phase 1: MVP Foundation (Weeks 1-2)

### 1.1 Authentication System
**Component**: Login/Register/Profile pages + Middleware
**Stack Auth Integration**: Uses neon_auth tables directly
**Features**:
- Email/password registration with verification
- Login with "Remember Me" option
- Password reset via email link
- OAuth integration (Google)
- Protected routes middleware
- User profile management

**v0 Implementation**: Use provided prompt in FEATURE_INTEGRATION_INDEX.md

### 1.2 Document Editor (Jenni AI Core)
**Component**: /editor/[id] with dual-sidebar layout
**Tiptap Integration**: Prose styling + custom formatting
**Features**:
- Real-time word count (top-right)
- Auto-save every 30 seconds
- Keyboard shortcuts (Cmd+B, Cmd+I, Cmd+K)
- Cmd+/ AI autocomplete badge
- Left sidebar: document list with search
- Right sidebar: AI suggestions placeholder
- Mobile: full-screen editor + bottom AI sheet

**Jenni AI Features**:
- Prosemirror-based editor
- Inline styling toolbar
- Keyboard-first workflow
- Responsive layout

### 1.3 Stripe Subscription Integration
**Component**: /pricing, /subscription/manage, checkout flow
**Stripe Integration**: Checkout sessions + webhooks
**Features**:
- 4 subscription tiers (FREE, PRO, PREMIUM, ENTERPRISE)
- Checkout hosted on Stripe
- Webhook handling for subscription events
- Feature gating middleware
- Upgrade/downgrade flow
- Invoice history display
- Auto-renewal management

**Subscription Limits**:
- FREE: 3 docs, 50 AI suggestions, 1 plagiarism scan
- PRO: 50 docs, 500 suggestions, 10 scans, $9.99/month
- PREMIUM: Unlimited, $29.99/month
- ENTERPRISE: Custom pricing

### 1.4 Citation Management (Jenni AI Feature)
**Component**: Citation form, inline badges, hover popovers
**Features**:
- Citation input form (title, authors, source, DOI)
- Inline citations as badges [1] [2]
- Hover popover with formatted citation
- Multiple citation styles (APA, MLA, Chicago, Harvard)
- Bibliography generation
- Copy/export functionality

**Jenni-like Features**:
- Hover popover with paper preview
- Citation style dropdown
- DOI resolution
- Formatted text display

### 1.5 Kenyan University Templates (Differentiation)
**Component**: /templates page with template selector
**Features**:
- KU (University of Kenya)
- KEMU (Kenyatta University)
- MKU (Mount Kenya University)
- Laikipia University
- Each with specific formatting rules
- Template preview modal
- Apply template to document
- Pre-format with correct margins/fonts

**Template Specifications**:
- Font families, sizes, line heights
- Margin specifications
- Section requirements
- University-specific guidelines

## Phase 2: AI & Advanced Features (Weeks 3-4)

### 2.1 AI Writing Suggestions (Jenni AI Differentiator)
**Component**: Right sidebar suggestion panel
**Integration**: Groq API (real-time, 400ms debounce) + Claude (detailed feedback)
**Features**:
- Real-time grammar suggestions via Groq
- Confidence percentage badge
- Style/tone improvements via Claude
- Accept/dismiss buttons
- Streaming responses
- Usage tracking per subscription tier

**Jenni-like Features**:
- 400ms debounce for performance
- Confidence scoring
- Accept/reject workflow
- Suggestion types categorization

### 2.2 AI Plagiarism Detection
**Component**: Plagiarism scan button + results modal
**Integration**: External plagiarism service API
**Features**:
- Scan button in editor toolbar
- Similarity percentage (0-100%)
- Matched sources list
- Scan history tracking
- Results modal display
- Red/yellow/green indicator
- Subscription tier limits

**Tier Limits**:
- FREE: 1 scan/day, 5/month
- PRO: 10 scans/day, 100/month
- PREMIUM: Unlimited

### 2.3 AI Copilot Chat (Future Phase 2B)
**Component**: Chat panel with streaming responses
**Integration**: AI SDK 6 with streaming
**Features**:
- Academic writing assistant
- Research recommendations
- Q&A for writing help
- Context-aware suggestions
- Real-time streaming

## Phase 3: Advanced Features (Weeks 5-6)

### 3.1 Real-Time Collaboration
**Component**: Collaborative editor view
**Integration**: Yjs + WebSocket
**Features**:
- Invite collaborators by email
- Real-time cursor positions
- Live text synchronization
- Comments and annotations
- Version history
- Permission management

**Tier Requirements**:
- FREE: No collaboration
- PRO: 3 collaborators
- PREMIUM: 10 collaborators
- ENTERPRISE: Unlimited

### 3.2 Analytics Dashboard
**Component**: /dashboard with charts and metrics
**Integration**: Recharts for visualizations
**Features**:
- Writing progress chart
- Documents count breakdown
- AI usage statistics
- Plagiarism scans used
- Current subscription display
- Usage trends
- Recent documents table

### 3.3 Admin Dashboard
**Component**: /admin with user/subscription management
**Features**:
- User management
- Subscription analytics
- Feature usage tracking
- Support ticket system
- Revenue reports

## Jenni AI Feature Parity

### Implemented Features (Jenni-like)
- [ ] Real-time word count display
- [ ] Cmd+/ AI autocomplete (badge only in Phase 1)
- [ ] Inline citations with hover popovers
- [ ] Citation hover with paper preview + DOI
- [ ] Multiple citation format support
- [ ] Real-time grammar suggestions (Groq-based)
- [ ] 400ms debounce on suggestions
- [ ] Confidence percentage on suggestions
- [ ] University-specific templates
- [ ] Plagiarism detection

### Unique Features (Beyond Jenni)
- [ ] Kenyan university focus (KU, KEMU, MKU, Laikipia)
- [ ] Stripe subscription management
- [ ] Subscription tier feature gating
- [ ] Real-time collaboration (future)
- [ ] Admin analytics dashboard
- [ ] Multiple AI model support (Groq + Claude)

## Implementation Timeline

### Week 1: Core Foundation
- Day 1-2: Authentication system (4-6 hrs)
- Day 2-3: Document editor with Tiptap (8-12 hrs)
- Day 4: Stripe integration (6-8 hrs)
- Day 5: Testing and fixes

### Week 2: Features
- Day 1-2: Citation system (8-10 hrs)
- Day 2-3: Thesis templates (6-8 hrs)
- Day 4-5: Dashboard and polish

### Week 3: AI Features
- Day 1-2: AI suggestions with Groq (8-10 hrs)
- Day 3-4: Plagiarism detection (6-8 hrs)
- Day 5: Testing, optimization

### Week 4: Launch Prep
- Polish and bug fixes
- Mobile optimization
- Security audit
- Performance optimization
- Beta launch

## Success Metrics

### MVP (Week 2)
- ✅ 100+ users registered
- ✅ 50+ documents created
- ✅ 10+ successful Stripe transactions
- ✅ 100% mobile responsiveness
- ✅ Zero critical bugs

### Phase 2 (Week 3-4)
- ✅ AI features used by 50% of users
- ✅ Plagiarism detection 95% accuracy
- ✅ Average session time 30+ minutes
- ✅ Subscription conversion 15%+

### Launch Ready
- ✅ All Phase 1 complete
- ✅ Performance: <2s page load
- ✅ Uptime: 99.9%
- ✅ User retention: 40%+

## How to Build

### Using v0.dev (Recommended)
1. Read `FEATURE_INTEGRATION_INDEX.md`
2. Copy prompt for Feature 1 (Authentication)
3. Paste in v0.dev and generate
4. Test locally
5. Repeat for each feature in priority order

### Using GitHub
1. Push changes to `thesis-writing-platform` branch
2. Vercel auto-deploys
3. Test in Vercel preview
4. Merge to main for production

### Development Workflow
```bash
npm run dev              # Local development
npm run build            # Build for production
npm run lint             # Check code quality
npm run type-check       # TypeScript validation
```

## Documentation Structure

- `QUICK_START_GUIDE.md` - Start here! How to build features
- `FEATURE_INTEGRATION_INDEX.md` - All 9 features with v0 prompts
- `COMPREHENSIVE_FEATURE_INTEGRATION_PLAN.md` - Detailed architecture
- `README_FEATURE_ROADMAP.md` - This file

## Key Files

### Configuration
- `next.config.ts` - Next.js configuration
- `schema.prisma` - Database schema (updated)
- `middleware.ts` - Request middleware
- `package.json` - Dependencies

### Utilities
- `lib/db.ts` - Prisma client setup
- `lib/stack-auth.ts` - Stack Auth integration
- `lib/utils.ts` - shadcn utilities

### Pages (To Build)
- `app/auth/` - Authentication pages
- `app/editor/[id]/` - Document editor
- `app/pricing/` - Pricing page (done)
- `app/subscription/manage/` - Subscription management
- `app/templates/` - Template selector
- `app/dashboard/` - User dashboard
- `app/admin/` - Admin controls

## Next Steps

1. **Immediate**: Read QUICK_START_GUIDE.md
2. **This Week**: Build Features 1-3 (Auth, Editor, Stripe)
3. **Next Week**: Build Features 4-5 (Citations, Templates)
4. **Week 3**: Build Features 6-7 (AI Features)
5. **Week 4**: Polish and launch

## Support

- Documentation: See /docs folder
- Examples: See /examples folder
- Issues: GitHub issues tracker
- Contact: support@thesisai.dev

---

**Last Updated**: 2/23/2026  
**Version**: 1.0  
**Status**: Ready for Feature Development  
**Next Action**: Begin Feature 1 - Authentication

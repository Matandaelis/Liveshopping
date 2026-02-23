# ThesisAI - Missing Features to Build

## Current Status
- ✅ Landing page created and running
- ✅ Pricing page with 4 subscription tiers
- ✅ Basic UI components (header, footer, etc.)
- ✅ Next.js app foundation (no Keystone blocking)
- ✅ Database schema defined (Prisma)
- ✅ API routes stubbed
- ⚠️ Keystone admin UI disabled (can be re-enabled after DB setup)

## Phase 1: Core Features to Build (Priority)

### 1. **Authentication System** (Week 1)
- [ ] User registration page
- [ ] User login page
- [ ] Email verification flow
- [ ] Password reset flow
- [ ] Session management with cookies
- **Dependencies**: Neon database, bcrypt, JWT

**Files to Create**:
- `/app/auth/register/page.tsx`
- `/app/auth/login/page.tsx`
- `/app/auth/forgot-password/page.tsx`
- `/lib/auth/` - Auth utilities
- `/app/api/auth/register/route.ts`
- `/app/api/auth/login/route.ts`

### 2. **Editor Core** (Week 1-2)
- [ ] Document editor with Tiptap
- [ ] Real-time word count
- [ ] Auto-save functionality
- [ ] Document list/dashboard
- **Dependencies**: Tiptap, React Query

**Files to Create**:
- `/app/editor/[id]/page.tsx`
- `/components/editor/TiptapEditor.tsx`
- `/components/editor/EditorToolbar.tsx`
- `/app/api/documents/[id]/route.ts` (implement GET/PUT/DELETE)

### 3. **Stripe Subscription Integration** (Week 1-2)
- [ ] Implement Stripe checkout
- [ ] Webhook handling for subscription events
- [ ] Subscription status tracking
- [ ] Plan upgrade/downgrade
- [ ] Manage subscription page
- **Dependencies**: Stripe SDK, webhook verification

**Files to Create/Update**:
- `/app/api/checkout/route.ts` (implement)
- `/app/api/webhooks/stripe/route.ts` (implement)
- `/app/subscription/manage/page.tsx`
- `/lib/stripe/` - Stripe utilities

### 4. **Citation Management** (Week 2)
- [ ] Citation input form
- [ ] Citation formatting (APA, MLA, Chicago)
- [ ] Bibliography generation
- [ ] Inline citation insertion
- **Dependencies**: Citation formatting library

**Files to Create**:
- `/components/citations/CitationForm.tsx`
- `/lib/citations/formatter.ts` (citation format logic)
- `/app/api/citations/format/route.ts`

### 5. **Thesis Templates** (Week 2)
- [ ] Template selector UI
- [ ] Template preview
- [ ] Apply template to document
- [ ] Support for Kenyan universities (KU, KEMU, MKU)
- **Dependencies**: Template storage (JSON/database)

**Files to Create**:
- `/app/templates/page.tsx`
- `/components/TemplateSelector.tsx`
- `/lib/templates/` - Template data and utilities
- `/app/api/templates/route.ts`

## Phase 2: AI Features (Week 3-4)

### 6. **AI Writing Suggestions** (Week 3)
- [ ] Real-time grammar checking
- [ ] Style suggestions
- [ ] Tone analysis
- [ ] Plagiarism-friendly rewriting
- **Dependencies**: Groq API, Claude API

**Files to Create**:
- `/app/api/ai/suggestions/route.ts` (implement)
- `/lib/ai/groq-client.ts`
- `/lib/ai/claude-client.ts`
- `/components/WritingAssistant/SuggestionPanel.tsx`

### 7. **AI Chat/Copilot** (Week 3-4)
- [ ] Academic writing chatbot
- [ ] Research recommendations
- [ ] Writing help Q&A
- [ ] Real-time streaming responses
- **Dependencies**: AI SDK 6, streaming response

**Files to Create**:
- `/app/api/ai/chat/route.ts` (implement)
- `/components/AICopilot/ChatInterface.tsx`
- `/lib/ai/prompts.ts`

### 8. **Plagiarism Detection** (Week 4)
- [ ] Plagiarism scan API integration
- [ ] Similarity report display
- [ ] Scan history tracking
- **Dependencies**: Plagiarism API (Turnitin, Grammarly, etc.)

**Files to Create**:
- `/app/api/plagiarism/scan/route.ts` (implement)
- `/components/plagiarism/PlagiarismReport.tsx`
- `/lib/plagiarism/` - Plagiarism service

## Phase 3: Advanced Features (Week 5-6)

### 9. **Collaboration Features**
- [ ] Invite supervisors/peers
- [ ] Real-time collaborative editing
- [ ] Comments/annotations
- [ ] Version history
- [ ] Permission management
- **Dependencies**: Yjs, Liveblocks (optional), WebSocket

**Files to Create**:
- `/components/collaboration/CollaborativeEditor.tsx`
- `/app/api/collaboration/invite/route.ts`
- `/lib/collaboration/` - Collaboration utilities

### 10. **User Dashboard/Analytics**
- [ ] Writing progress tracker
- [ ] Usage statistics
- [ ] Document organization
- [ ] Recent activity
- [ ] Subscription status overview
- **Dependencies**: Chart library (Recharts)

**Files to Create**:
- `/app/dashboard/page.tsx` (implement)
- `/components/dashboard/WritingStats.tsx`
- `/components/dashboard/DocumentList.tsx`
- `/app/api/analytics/route.ts`

### 11. **Admin Dashboard** (For managing subscriptions/users)
- [ ] User management
- [ ] Subscription analytics
- [ ] Feature usage tracking
- [ ] Document moderation
- **Files to Create**:
- `/app/admin/page.tsx`
- `/app/admin/users/page.tsx`
- `/app/admin/subscriptions/page.tsx`

## Phase 4: Polish & Launch (Week 7-8)

### 12. **Email Notifications**
- [ ] Subscription confirmation emails
- [ ] Password reset emails
- [ ] Document shared notifications
- [ ] Billing emails
- **Dependencies**: Resend/SendGrid

**Files to Create**:
- `/lib/email/` - Email templates
- `/app/api/email/route.ts`

### 13. **SEO & Marketing Pages**
- [ ] Blog/resources section
- [ ] FAQ page
- [ ] Help documentation
- [ ] Legal pages (ToS, Privacy)
- **Files to Create**:
- `/app/blog/page.tsx`
- `/app/faq/page.tsx`
- `/app/help/page.tsx`
- `/app/legal/page.tsx`

### 14. **Mobile Optimization**
- [ ] Mobile editor experience
- [ ] Bottom sheet for AI panel (mobile)
- [ ] Touch-optimized UI
- [ ] Progressive Web App (PWA)

### 15. **Performance & Security**
- [ ] API rate limiting
- [ ] Input validation & sanitization
- [ ] CSRF protection
- [ ] SQL injection prevention
- [ ] Content Security Policy
- [ ] Database indexing optimization

## Quick-Start v0 Prompts for Next Phase

### Prompt 1: Build Authentication
```
"Create authentication system for Next.js 15 app with:
- User registration/login pages (shadcn forms)
- Email verification
- Password reset with email link
- JWT + HTTP-only cookies for sessions
- Protected routes with middleware
Use Neon PostgreSQL database with Prisma ORM"
```

### Prompt 2: Build Editor
```
"Build real-time document editor with:
- Tiptap editor (prose styling)
- Word count display
- Auto-save every 30 seconds
- Document list with search/filter
- Create/edit/delete documents
Use React Query for state management, Prisma for database"
```

### Prompt 3: Build Stripe Integration
```
"Integrate Stripe payments with:
- Checkout session creation
- Webhook handling for subscription events
- Subscription management page (upgrade/downgrade/cancel)
- Invoice history display
- Feature gating based on subscription tier"
```

### Prompt 4: Build AI Writing Assistant
```
"Build AI writing assistant with:
- Groq for real-time suggestions (400ms debounce)
- Claude for detailed feedback
- Streaming responses
- Side panel with suggestions
- Accept/dismiss UI
Use AI SDK 6 with streaming support"
```

## Environment Variables Needed (When Ready)

```bash
# Already set
DATABASE_URL=postgresql://...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# Need to add later
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
GROQ_API_KEY=...
ANTHROPIC_API_KEY=...
RESEND_API_KEY=...
```

## Database Tables Status
- ✅ Schema defined in `schema.prisma`
- ⚠️ Not yet migrated to Neon database
- ⚠️ Keystone User table not created
- 📝 Can proceed with API development without migrations (will use mocked data initially)

## Next Action
1. Choose one feature from Phase 1 to build (e.g., Authentication)
2. Copy the relevant v0 prompt above
3. Use v0 to generate the feature components and API routes
4. Test locally
5. Push to GitHub
6. Move to next feature

---
**Status**: Ready to build missing features. No blocking issues remaining.
**Recommendation**: Start with Authentication (Week 1) → Editor (Week 2) → Stripe (Week 2) for MVP launch.

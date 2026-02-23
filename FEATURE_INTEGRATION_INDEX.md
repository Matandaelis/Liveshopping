# ThesisAI Feature Integration Index - Ready for v0 Generation

## Overview
This document indexes all remaining features ready to be built with v0.dev. Each feature has a tested v0 prompt and clear acceptance criteria.

## Current Infrastructure Status
- Stack Auth tables available in Neon (neon_auth schema)
- Stripe fully configured
- Schema updated to use Stack Auth + new ThesisAI tables
- Database utilities created (lib/db.ts, lib/stack-auth.ts)
- Landing page and pricing pages ready

## Feature Implementation Matrix

### PHASE 1: MVP Features (Start Here)

#### Feature 1: Authentication UI with Stack Auth
**Priority**: CRITICAL (blocks all features)
**Status**: Ready for v0
**Estimated Time**: 4-6 hours

**v0 Prompt**:
```
Build authentication pages for Next.js 15 app using Stack Auth (already configured):
1. Create /auth/login page with email/password form
   - Email input + password input
   - "Sign In" button
   - "Don't have account? Register" link
   - "Forgot password?" link
   - Google OAuth button (Stack Auth ready)
2. Create /auth/register page with email verification
   - Email input + password input + confirm password
   - "Sign Up" button
   - Terms checkbox
   - Auto-login after verification
3. Create /profile page with user info
   - Display current user email/name
   - Edit profile form
   - Change password form
   - Sign out button
4. Build middleware to check Stack Auth JWT token
   - Redirect unauthenticated users to /auth/login
   - Redirect authenticated users away from auth pages
5. Use shadcn/ui forms, Neon database optional (Stack Auth tables used)
```

**Acceptance Criteria**:
- [ ] Login page functional with Stack Auth integration
- [ ] Registration creates new user in neon_auth.user
- [ ] Email verification works
- [ ] Profile page shows current user
- [ ] Middleware redirects properly
- [ ] Mobile responsive

---

#### Feature 2: Document Editor (Jenni AI Style)
**Priority**: CRITICAL (core functionality)
**Status**: Ready for v0
**Estimated Time**: 8-12 hours

**v0 Prompt**:
```
Build Jenni AI-style document editor for Next.js 15:
1. Create /editor/[id] page with:
   - Tiptap editor (prose styling) taking 70% of screen
   - Right sidebar (30%) with AI suggestions placeholder
   - Top bar with document title + word count
   - Save status indicator ("Saved" / "Saving..." / "Unsaved")
   - Auto-save every 30 seconds to Neon documents table
2. Editor features:
   - Bold/italic/underline toolbar buttons
   - Heading 1/2/3 support
   - Bullet list and numbered list
   - Quote support
   - Cmd+B bold, Cmd+I italic, Cmd+K link shortcuts
   - Cmd+/ shows "AI Autocomplete" badge (not functional yet)
3. Left sidebar with document list:
   - New Document button
   - Search documents by title
   - List all documents with created/updated dates
   - Click to open document in editor
   - Delete document with confirmation
4. Mobile: Full-screen editor with AI suggestions in bottom sheet
5. Use Tiptap, React Query for state, Prisma for Neon storage
```

**Acceptance Criteria**:
- [ ] Editor renders with Tiptap
- [ ] Auto-save works (every 30 seconds to Neon)
- [ ] Document list shows/opens documents
- [ ] Mobile editor functional
- [ ] Word count updates in real-time
- [ ] All keyboard shortcuts work

---

#### Feature 3: Stripe Subscription Management
**Priority**: HIGH (revenue generation)
**Status**: Ready for v0
**Estimated Time**: 6-8 hours

**v0 Prompt**:
```
Build Stripe subscription integration for Next.js 15:
1. Create /pricing page showing 4 subscription tiers:
   - FREE: 3 documents, 50 AI suggestions, 1 plagiarism scan
   - PRO: 50 documents, 500 suggestions, 10 scans, $9.99/month
   - PREMIUM: Unlimited, $29.99/month
   - ENTERPRISE: Custom, contact sales
   - Each tier shows feature comparison
   - "Choose Plan" button for each (FREE shows "Current Plan")
2. Checkout flow:
   - POST /api/checkout with tier selection
   - Create Stripe checkout session
   - Redirect to Stripe hosted checkout
3. Webhook handler at /api/webhooks/stripe:
   - Listen to subscription.created, subscription.updated, subscription.deleted
   - Update Neon subscriptions table
   - Update user subscription tier
4. Create /subscription/manage page:
   - Display current tier + renewal date
   - Upgrade/downgrade buttons
   - View invoice history
   - Cancel subscription button with confirmation
5. Feature gating middleware:
   - Check subscription tier in middleware
   - Enforce feature limits (documents, scans, etc.)
   - Show upgrade prompts when limits approached
```

**Acceptance Criteria**:
- [ ] Pricing page displays all tiers correctly
- [ ] Checkout redirects to Stripe
- [ ] Stripe webhooks update Neon subscriptions table
- [ ] Manage subscription page shows current tier
- [ ] Upgrade/downgrade workflow functions
- [ ] Free tier limits enforced
- [ ] Stripe test payments work

---

#### Feature 4: Citation Management System
**Priority**: HIGH (Jenni AI core feature)
**Status**: Ready for v0
**Estimated Time**: 8-10 hours

**v0 Prompt**:
```
Build citation management with Jenni AI hover popovers:
1. Create /citations page with:
   - Citation form (title, authors, publication year, source, DOI)
   - Submit button saves to Neon citations table
   - Display list of all citations with edit/delete options
2. Inline citations in editor:
   - Show citations as badges like [1], [2], [3]
   - Styling: blue badge with white text
   - Click badge to edit citation
3. Citation hover popover (Jenni AI feature):
   - Trigger on hover over [1] badge
   - Show formatted citation (APA style default)
   - Show "Formatted Text" with all citation details
   - Show confidence badge if applicable
   - Buttons: Copy to Clipboard, Download as PDF, Export Reference
   - Citation style dropdown (APA, MLA, Chicago, Harvard)
4. Bibliography generation:
   - Button "Generate Bibliography"
   - Display all citations formatted and sorted
   - Export as PDF or copy all text
5. API route /api/citations/format:
   - POST with citation object + style
   - Return formatted text in requested style
   - Support APA, MLA, Chicago, Harvard
6. Database: Store citations in Neon citations table
```

**Acceptance Criteria**:
- [ ] Citation form creates entries in Neon
- [ ] Inline citations display as badges
- [ ] Hover popover shows formatted citation
- [ ] Citation formatting works for all 4 styles
- [ ] Bibliography generation works
- [ ] Copy/download buttons functional
- [ ] Citations persist across sessions
- [ ] Mobile popover converts to bottom sheet

---

#### Feature 5: Kenyan University Thesis Templates
**Priority**: MEDIUM (differentiation)
**Status**: Ready for v0
**Estimated Time**: 6-8 hours

**v0 Prompt**:
```
Build Kenyan university thesis templates (KU, KEMU, MKU, Laikipia):
1. Create /templates page with:
   - Grid of 4 template cards
   - Each card shows: University name, country flag, description
   - Card shows basic requirements preview (font size, margins)
2. Template cards include:
   - University of Kenya (KU): A4, Times New Roman 12pt, 1.5 spacing, 40mm left margin
   - Kenyatta University (KEMU): A4, Arial 11pt, single spacing, 1 inch margins
   - Mount Kenya University (MKU): A4, Calibri 11pt, 1.15 spacing, standard margins
   - Laikipia University: A4, Times 12pt, double spacing, 1.5 inch margins
3. Template preview:
   - "Preview" button shows formatted document example
   - Shows actual margins, fonts, section ordering
4. "Use Template" button:
   - Creates new document with template structure
   - Pre-formats document with correct margins/fonts
   - Shows template requirements as sidebar notes
5. Store templates in Neon (thesis_templates table)
   - Include section requirements (Intro, Literature Review, Methods, Results, etc.)
6. Apply template:
   - Button applies template formatting to existing document
   - Preserves content, updates formatting only
```

**Acceptance Criteria**:
- [ ] All 4 Kenyan templates available
- [ ] Template preview shows correct formatting
- [ ] "Use Template" creates pre-formatted document
- [ ] Font/margin settings apply correctly
- [ ] Templates persist in Neon
- [ ] Mobile template selection works
- [ ] Template requirements display clearly

---

### PHASE 2: AI Features

#### Feature 6: AI Writing Suggestions (Groq Real-time)
**Priority**: HIGH (Jenni AI differentiator)
**Status**: Ready for v0
**Estimated Time**: 8-10 hours

**v0 Prompt**:
```
Build real-time AI writing suggestions (Jenni AI style):
1. Add right sidebar in editor with suggestion panel:
   - Header: "AI Suggestions" with sparkles icon
   - Suggestion text box with white background
   - Confidence percentage badge (85%)
   - "Accept" button (green) and "Dismiss" button
   - Loading spinner while generating suggestion
2. Implement Groq API integration:
   - POST /api/ai/suggestions endpoint
   - Takes selected text or full paragraph
   - 400ms debounce before sending to Groq
   - Stream response as it arrives
   - Stop streaming on 200 tokens
3. Use Claude for deeper feedback:
   - POST /api/ai/feedback endpoint
   - More detailed style/tone suggestions
   - Shows as separate panel "Detailed Feedback"
4. Suggestion types:
   - Grammar corrections
   - Style improvements
   - Clarity suggestions
   - Academic tone adjustments
   - Plagiarism-safe rewriting
5. Accept suggestion:
   - Replace selected text with suggestion
   - Log to ai_usage_stats table
6. Feature gating:
   - FREE tier: 50 suggestions/month
   - PRO: 500/month
   - PREMIUM: unlimited
   - Show "Upgrade" prompt when limit reached
```

**Acceptance Criteria**:
- [ ] Right sidebar displays suggestions
- [ ] Groq API integration works (test key from env)
- [ ] Suggestions appear within 400ms
- [ ] Streaming responses display in real-time
- [ ] Accept/dismiss buttons functional
- [ ] Usage stats tracked in Neon
- [ ] Feature gating enforced per tier
- [ ] Mobile bottom-sheet for suggestions

---

#### Feature 7: AI Plagiarism Detection
**Priority**: HIGH (compliance requirement)
**Status**: Ready for v0
**Estimated Time**: 6-8 hours

**v0 Prompt**:
```
Build plagiarism detection integration:
1. Add "Check Plagiarism" button in editor toolbar:
   - Blue button with "Check Plagiarism" text
   - Shows loading spinner while scanning
   - Results modal on completion
2. Plagiarism scan API:
   - POST /api/plagiarism/scan with document text
   - Call plagiarism service (Grammarly, Copyscape, or API)
   - Store results in Neon plagiarism_scans table
   - Track scan count for subscription limits
3. Results display:
   - Modal showing similarity percentage (0-100%)
   - Red/yellow/green indicator based on percentage
   - Matched sources list with % match and source link
   - "View Full Report" link (if available)
   - Scan date and document reference
4. Scan history:
   - Previous plagiarism scans listed below button
   - Shows timestamp and similarity %
   - Click to view full report again
5. Feature gating:
   - FREE: 1 scan/day, 5 total/month
   - PRO: 10 scans/day, 100/month
   - PREMIUM: unlimited scans
   - Show remaining scans count
   - Show upgrade prompt when limit approached
6. Mobile: Full-screen plagiarism report modal
```

**Acceptance Criteria**:
- [ ] Plagiarism button functional
- [ ] Scan API integration works
- [ ] Results display correctly
- [ ] Similarity percentage accurate
- [ ] Scan history tracked in Neon
- [ ] Feature limits enforced
- [ ] Subscription tier limits work
- [ ] Mobile plagiarism reports readable

---

### PHASE 3: Advanced Features

#### Feature 8: Real-time Collaboration
**Priority**: MEDIUM (advanced feature)
**Status**: Requires planning
**Estimated Time**: 12-16 hours

**v0 Prompt**:
```
Build real-time collaborative document editing:
1. Create /editor/[id]/collaborate page:
   - Invite collaborators by email
   - Show active collaborators with avatars
   - Real-time cursor positions
   - Live text synchronization
2. Implement Yjs for real-time sync:
   - Use Yjs document for conflict-free replication
   - WebSocket for sync between clients
   - Auto-merge edits from multiple users
3. Comments and annotations:
   - Right-click text to add comment
   - Comment thread display
   - Tag collaborators with @mentions
   - Comments persist in Neon
4. Version history:
   - Show document versions with timestamps
   - Rollback to previous versions
   - Show who made each change
5. Permission management:
   - Share document with view/edit/comment permissions
   - Remove collaborators
   - Revoke access
6. Feature gating:
   - FREE: No collaboration
   - PRO: 3 collaborators max
   - PREMIUM: 10 collaborators
   - ENTERPRISE: unlimited
```

**Dependencies**: Yjs, liveblocks or custom WebSocket

---

#### Feature 9: User Dashboard & Analytics
**Priority**: MEDIUM (engagement)
**Status**: Ready for v0
**Estimated Time**: 8-10 hours

**v0 Prompt**:
```
Build analytics dashboard for writers:
1. Create /dashboard page with:
   - Writing progress chart (Recharts)
   - Documents count breakdown
   - AI suggestions used this month
   - Plagiarism scans used this month
   - Current subscription tier display
   - Upgrade button if FREE
2. Widgets:
   - "Documents: 12" with icon
   - "Words: 45,230" trending up
   - "AI Used: 89/500" with progress bar
   - "Grade Prediction: A-" (if analysis available)
3. Recent documents table:
   - Columns: Title, Status, Last Updated, Word Count
   - Sort by date/title/status
   - Click to open in editor
   - Delete option
4. Usage statistics:
   - Documents created this month
   - AI suggestions accepted/rejected ratio
   - Average document length
   - Writing frequency chart (daily/weekly)
5. Subscription info card:
   - Current tier
   - Renewal date
   - Features available in tier
   - Upgrade/manage subscription buttons
6. Mobile: Stack stats vertically, simplified charts
```

**Acceptance Criteria**:
- [ ] Dashboard displays key metrics
- [ ] Charts render correctly
- [ ] Document table functional with sorting
- [ ] Usage stats calculated accurately
- [ ] Subscription info displays correctly
- [ ] Responsive on mobile
- [ ] All data pulls from Neon correctly

---

## Database Schema Status

All tables ready in schema.prisma:
- ✅ Document (store thesis documents)
- ✅ Subscription (track user subscriptions)
- ✅ Citation (manage citations)
- ✅ ThesisTemplate (store template definitions)
- ✅ PlagiarismScan (plagiarism results)
- ✅ AIUsageStats (track feature usage)

Run migration when ready:
```bash
npx prisma migrate dev --name init_thesisai
```

## Environment Variables Needed

### Already Configured
- ✅ DATABASE_URL (Neon)
- ✅ STRIPE_SECRET_KEY
- ✅ STRIPE_PUBLISHABLE_KEY
- ✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

### Need to Add (for AI features)
```
GROQ_API_KEY=... (from Groq console)
ANTHROPIC_API_KEY=... (from Anthropic console)
PLAGIARISM_API_KEY=... (Turnitin/Grammarly/Copyscape)
```

## Next Steps

1. **Start with Feature 1** (Auth UI) - unblocks everything else
2. **Then Feature 2** (Editor) - core functionality
3. **Then Feature 3** (Stripe) - revenue generation
4. **Then Feature 4** (Citations) - differentiation
5. **Continue with remaining features** in priority order

## Success Criteria

- All Phase 1 features implemented and tested
- Application accessible and functional
- All v0 generated code follows best practices
- TypeScript strict mode enabled
- Mobile responsive
- Zero console errors/warnings
- Ready for beta launch

---

**Last Updated**: 2/23/2026
**Status**: All prompts tested and ready for v0 generation
**Next Action**: Use Feature 1 prompt in v0.dev to begin implementation

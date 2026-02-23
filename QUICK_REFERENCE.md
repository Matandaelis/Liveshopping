# ThesisAI Quick Reference Guide

## 📋 Documentation Files (Read In Order)

1. **START HERE**: `FEATURES_SUMMARY.md` (5 min read)
   - Overview of what was delivered
   - 10 features ready to build
   - Timeline to MVP

2. **PLAN**: `ENHANCED_FEATURE_ROADMAP.md` (20 min read)
   - Detailed specifications for each feature
   - Database schemas
   - v0.dev prompts included
   - Architecture decisions explained

3. **BUILD**: `IMPLEMENTATION_GUIDE.md` (reference while coding)
   - Step-by-step instructions
   - Copy-paste v0 prompts
   - Environment setup
   - Troubleshooting

4. **ARCHITECT**: `ARCHITECTURE_OVERVIEW.md` (reference)
   - System diagrams
   - Database schema
   - API structure
   - Security patterns

---

## 🚀 Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Set environment variables (.env.local)
DATABASE_URL=your_neon_url
OPENROUTER_API_KEY=your_key
GROQ_API_KEY=your_key
# (See IMPLEMENTATION_GUIDE.md Step 1 for all vars)

# 3. Start development server
npm run dev

# 4. Open http://localhost:3000
```

If you see the landing page without errors → ✅ You're ready!

---

## 🎯 Feature Building Order

**Week 1-2 (MVP Foundation)**
1. Authentication
2. Document Editor
3. Stripe Integration

**Week 3-4 (AI Features)**
4. OpenRouter Setup
5. AI Writing Suggestions
6. Citation Management
7. Plagiarism Detection

**Week 5-6 (Advanced)**
8. Research Helper
9. Real-Time Collaboration

**Week 7-8 (Polish)**
10. Analytics Dashboard
11. Launch

---

## 💻 How to Build Each Feature

### For Every Feature:

1. **Read the spec** in `ENHANCED_FEATURE_ROADMAP.md`
2. **Copy the v0 prompt** from spec section
3. **Go to v0.dev** (https://v0.dev)
4. **Paste prompt** into chat
5. **Generate components** (v0 creates the code)
6. **Download** the generated files
7. **Merge into project** (copy files to your repo)
8. **Test locally** (`npm run dev`)
9. **Commit & push** to GitHub
10. **Vercel auto-deploys** (check Vercel dashboard)

### Example: Build Authentication Feature

```
1. Open: ENHANCED_FEATURE_ROADMAP.md
2. Find: Section "2.1 Authentication System"
3. Copy: v0 Prompt (blue box)
4. Go to: https://v0.dev
5. Paste: The prompt
6. Click: Generate
7. Wait: 30-60 seconds
8. Download: Generated components
9. Extract: To your project
10. npm run dev: Test locally
```

**Total time**: 45 minutes → Working authentication!

---

## 🛢️ Database Schema Quick Lookup

### Stack Auth Tables (Pre-existing in neon_auth schema)
```
user          - User accounts with email/password
session       - Active sessions
account       - OAuth connections
```

### ThesisAI Tables (Create new in public schema)
```
documents           - User documents (content stored as JSON)
subscriptions       - Subscription tiers (Free/Pro/Premium/Enterprise)
citations          - Academic citations (APA/MLA/Chicago)
thesis_templates   - Thesis format templates for KU/KEMU/MKU/LAIKIPIA
plagiarism_scans   - Plagiarism scan results and history
ai_usage_stats     - Track AI feature usage per user per day
```

---

## 🔌 API Endpoints Overview

### Auth Endpoints
```
POST   /api/auth/register       → Create account
POST   /api/auth/login          → Login
POST   /api/auth/logout         → Logout
GET    /api/auth/me             → Get current user
```

### Document Endpoints
```
GET    /api/documents           → List user's docs
POST   /api/documents/create    → Create new doc
GET    /api/documents/[id]      → Get specific doc
PUT    /api/documents/[id]      → Update doc
DELETE /api/documents/[id]      → Delete doc
POST   /api/documents/[id]/save → Auto-save
```

### AI Endpoints
```
POST   /api/ai/suggest          → Get writing suggestions
POST   /api/ai/chat             → Chat with AI
POST   /api/plagiarism/check    → Check plagiarism
GET    /api/plagiarism/report/[id] → Get scan report
```

### Payment Endpoints
```
POST   /api/stripe/checkout     → Create checkout session
GET    /api/stripe/subscription → Get subscription status
POST   /api/stripe/webhooks     → Handle Stripe events
```

---

## 🔐 Security Checklist

Before each feature, ensure:

- [ ] Authentication required (middleware check)
- [ ] User data filtered by userId
- [ ] Input validation with Zod
- [ ] No sensitive data in logs
- [ ] API key never sent to client
- [ ] Rate limiting by tier
- [ ] CORS configured correctly
- [ ] Error messages don't leak info

---

## 📊 Subscription Tiers Reference

| Tier | Cost | Docs | AI Uses | Plagiarism | Collab |
|------|------|------|---------|-----------|--------|
| Free | $0 | 3 | 5/mo | 1/mo | ❌ |
| Pro | $9/mo | ∞ | 100/mo | 5/mo | ❌ |
| Premium | $29/mo | ∞ | ∞ | 20/mo | ✅ |
| Enterprise | Custom | ∞ | ∞ | ∞ | ✅ |

Use to gate features in your code:
```typescript
if (subscription.tier === 'FREE') {
  if (aiUsageStats.suggestionsUsedToday >= 5) return 429; // Too many
}
```

---

## 🤖 AI Models Quick Reference

### OpenRouter (Recommended for most tasks)
- **Cost**: Variable per model
- **Speed**: 1-5 seconds
- **Best for**: Deep analysis, research, detailed feedback
- **Models**: Claude, GPT-4, Llama, Mistral, etc.
- **Setup**: `OPENROUTER_API_KEY` env var

### Groq (Use for real-time suggestions)
- **Cost**: Cheap/free
- **Speed**: < 100ms
- **Best for**: Quick suggestions, grammar checks, tone analysis
- **Models**: Llama 3.3 70B, Mixtral
- **Setup**: `GROQ_API_KEY` env var

**Strategy**: Use Groq for instant feedback (< 500ms), fallback to OpenRouter for detailed analysis

---

## 🐛 Common Issues & Fixes

### "DATABASE_URL not found"
```env
# Add to .env.local
DATABASE_URL=postgresql://...
```

### "Cannot find module @openrouter/sdk"
```bash
npm install @openrouter/sdk
```

### "Prisma schema validation error"
```bash
npx prisma generate
npx prisma db push
```

### "Webhook endpoint not working"
1. Get your Vercel deployment URL
2. Go to Stripe Dashboard → Webhooks
3. Add endpoint: `https://your-domain.com/api/stripe/webhooks`
4. Set webhook secret in `.env`

### "Too many requests from user"
→ Check rate limiting logic is checking subscription tier
→ Verify `AIUsageStats` table is being updated

---

## 📱 Component Reuse

Before building new components, check if shadcn has it:

```bash
# Available in project:
- Button
- Card
- Form
- Input
- Select
- Textarea
- Dialog
- Sheet
- Popover
- Badge
- Avatar
- Tabs
- Table
# ...and many more

# Check official shadcn library for others:
https://ui.shadcn.com
```

Copy-paste shadcn components instead of building from scratch.

---

## 🚀 Deployment Checklist

Before going live:

**Environment Variables** (Set in Vercel)
- [ ] DATABASE_URL
- [ ] OPENROUTER_API_KEY
- [ ] GROQ_API_KEY
- [ ] STRIPE_SECRET_KEY
- [ ] STRIPE_WEBHOOK_SECRET

**Database**
- [ ] All migrations run (`npx prisma migrate deploy`)
- [ ] All tables exist
- [ ] Indexes created

**Testing**
- [ ] Auth signup/login works
- [ ] Document create/edit/delete works
- [ ] AI suggestions generate correctly
- [ ] Stripe checkout completes
- [ ] Webhook receives events

**Security**
- [ ] No console.logs with secrets
- [ ] All routes protected appropriately
- [ ] CORS configured
- [ ] CSP headers set

**Monitoring**
- [ ] Sentry/error tracking setup
- [ ] Analytics enabled
- [ ] Logs viewable

---

## 📞 Getting Help

### While Building
- Check `IMPLEMENTATION_GUIDE.md` troubleshooting section
- Look at v0.dev generated code for patterns
- Reference `ARCHITECTURE_OVERVIEW.md` for how things connect

### API Issues
- Test endpoints with curl or Postman first
- Check `console.log("[v0] ...")` debug statements
- Verify environment variables set correctly

### Database Issues
- Use `npx prisma studio` to inspect data
- Check migrations ran: `npx prisma migrate status`
- Verify Neon database URL is correct

### OpenRouter Issues
- Test API key: https://openrouter.ai/api/v1/models
- Check credit balance in account
- Try different model if one fails

---

## 💡 Pro Tips

1. **Use SWR for data fetching** (built-in caching)
   ```typescript
   const { data, mutate } = useSWR('/api/documents', fetcher)
   ```

2. **Stream long responses** (better UX)
   ```typescript
   const stream = openrouter.messages.stream({ ... })
   ```

3. **Cache expensive operations** (1-5 min TTL)
   ```typescript
   @@map("documents")
   @@index([userId, updatedAt])
   ```

4. **Validate early** (Zod on input)
   ```typescript
   const schema = z.object({ email: z.string().email() })
   const parsed = schema.parse(input)
   ```

5. **Fail gracefully** (show user-friendly errors)
   ```typescript
   try {
     // ...
   } catch (err) {
     return { error: "Something went wrong. Please try again." }
   }
   ```

---

## 🎓 Learning Resources

While building, learn:
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [OpenRouter API](https://openrouter.ai/docs)
- [Stripe Integration](https://stripe.com/docs/payments/checkout)
- [TailwindCSS](https://tailwindcss.com/docs)

---

## 🎯 Success Checklist

After MVP Launch:

- [ ] 100+ signups in first week
- [ ] 40%+ of users create a document
- [ ] 5+ users upgrade to paid
- [ ] No critical bugs reported
- [ ] Avg response time < 2 seconds
- [ ] 99%+ uptime
- [ ] User feedback collected
- [ ] Roadmap updated based on feedback

---

## 📈 Metrics to Track

- **Signups**: Daily new users
- **Retention**: % returning after 7 days
- **Conversion**: % free → paid
- **ARPU**: Average Revenue Per User
- **Churn**: % canceling subscriptions
- **AI Usage**: Avg suggestions per user
- **Performance**: API response time
- **Errors**: Error rate and types

---

**Last Updated**: Feb 23, 2026  
**Status**: ✅ Ready to Build  
**Next**: Read IMPLEMENTATION_GUIDE.md and start Feature #1

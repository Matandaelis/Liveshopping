# ThesisAI Quick Start Guide

## Getting Started

### 1. Start the Development Server
```bash
npm run dev
```
Visit http://localhost:3000

### 2. Setup Database (First Time Only)
```bash
bash scripts/setup-db.sh
```

Or manually:
```bash
npx prisma db push
npx ts-node scripts/seed.ts
```

### 3. Check Environment Variables
Ensure `.env.local` has:
```
DATABASE_URL=your_neon_url
GROQ_API_KEY=your_groq_key
STRIPE_SECRET_KEY=your_stripe_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Using the Dashboard

### View Documents
1. Go to `/dashboard`
2. See all your documents in the list
3. Click a document to open in editor

### Create Document
1. Click "New Document" button
2. Document created instantly
3. Opens in editor

### Check Statistics
- Total documents created
- Total words written
- Subscription tier
- Remaining AI suggestions/scans

## Using the Editor

### Edit Document
1. Open document from dashboard
2. Start typing in the text area
3. Word count updates in real-time

### Save Document
- Click "Save" button or
- Auto-saves when changes made
- See "Last saved" timestamp

### Export Document
1. Click "Export" button
2. Download as .txt file

### Get AI Suggestions
1. Write text in editor
2. Click "AI" button
3. Select suggestion type:
   - **Improve**: Enhance clarity and tone
   - **Paraphrase**: Rephrase content
   - **Grammar**: Fix spelling/punctuation
   - **Expand**: Add more detail
   - **Summarize**: Condense content
4. Suggestion appears in popup
5. Copy and paste to use

### Check Plagiarism
1. Write at least 50 words
2. Click "Check" button
3. See similarity percentage
4. View flagged sections

## Pricing & Subscriptions

### View Pricing
1. Go to `/pricing`
2. Browse all 4 tiers
3. Compare features

### Upgrade Plan
1. Click plan button on pricing page
2. Redirect to Stripe
3. Use test card: 4242 4242 4242 4242
4. Complete checkout
5. Subscription activated

### Check Current Subscription
1. Go to dashboard
2. See tier in top right
3. See remaining usage limits

## API Endpoints Quick Reference

### Create Document
```bash
curl -X POST http://localhost:3000/api/documents \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user-001" \
  -d '{"title": "My Thesis", "content": ""}'
```

### Get AI Suggestion
```bash
curl -X POST http://localhost:3000/api/ai/suggestions \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user-001" \
  -d '{"text": "Your text here", "type": "improve"}'
```

### Check Plagiarism
```bash
curl -X POST http://localhost:3000/api/plagiarism/check \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user-001" \
  -d '{"text": "Your text here", "documentId": "doc-id"}'
```

### Get User Stats
```bash
curl http://localhost:3000/api/user/stats \
  -H "x-user-id: test-user-001"
```

## Sample Data

### Test User
- ID: `test-user-001`
- Has PRO subscription
- Has 2 sample documents

### Sample Documents
1. **Chapter 1: Introduction to Machine Learning**
   - 2,500 words
   - Status: DRAFT
   
2. **Chapter 2: Neural Networks**
   - 3,200 words
   - Status: IN_PROGRESS

### Sample Citations
- Murphy, K.P. (2012). Machine Learning: A Probabilistic Perspective
- Goodfellow, I., Bengio, Y., & Courville, A. (2016). Deep Learning

## Testing Different Plans

### Free Plan
1. Create 4 documents (3 limit reached)
2. Use 51 AI suggestions (50 limit reached)
3. Use 2 plagiarism scans (1 limit reached)

### Pro Plan
1. Upgrade at `/pricing`
2. Use test Stripe card
3. Gets 20 documents, 500 suggestions, 10 scans

### Premium Plan
1. Upgrade to Premium
2. All limits become Unlimited
3. Full feature access

## Troubleshooting

### Database Connection Error
- Check `DATABASE_URL` in `.env.local`
- Verify Neon credentials
- Run `npx prisma db push` to sync schema

### Groq API Error
- Check `GROQ_API_KEY` is valid
- Verify API key has quota
- Test with simple text first

### Stripe Webhook Error
- Check `STRIPE_WEBHOOK_SECRET` is correct
- Verify webhook endpoint in Stripe dashboard
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### Empty Dashboard
1. Run seed script: `npx ts-node scripts/seed.ts`
2. Refresh browser
3. Should see test documents

## File Locations

**Key Files:**
- Dashboard: `app/dashboard/page.tsx`
- Editor: `app/dashboard/editor/page.tsx`
- Pricing: `app/pricing/page.tsx` → `components/landing/PricingPage.tsx`
- API Routes: `app/api/*/`
- Database: `prisma/schema.prisma`
- Database Client: `lib/db.ts`

**Component Files:**
- Dashboard Content: `components/dashboard/DashboardContent.tsx`
- Pricing Page: `components/landing/PricingPage.tsx`

**Utility Files:**
- Stripe: `lib/stripe.ts`
- Subscriptions: `lib/subscriptions.ts`
- Database: `lib/db.ts`

## Performance Tips

- Dashboard loads in < 1s
- AI suggestions return in < 3s (Groq is fast!)
- Plagiarism check in < 5s
- Page transitions < 1s

## Common Tasks

### Add New Document Type
Edit `prisma/schema.prisma` Document model

### Change AI Model
Edit `/api/ai/suggestions/route.ts` - change `groq('mixtral-8x7b-32768')`

### Adjust Usage Limits
Edit `/lib/subscriptions.ts` - modify `limits` object

### Add University Template
Create entry in database via:
```bash
curl -X POST http://localhost:3000/api/templates \
  -d '{"name": "KU", "university": "University of Nairobi", ...}'
```

### Update Stripe Pricing
- Create products in Stripe Dashboard
- Get Price IDs
- Update `NEXT_PUBLIC_STRIPE_*_PRICE_ID` env vars

## Support

- Check README.md for detailed docs
- See IMPLEMENTATION_COMPLETE.md for status
- View API routes in `app/api/`
- Check database schema in `prisma/schema.prisma`

---

**Last Updated**: 2026-02-23
**Version**: 1.0.0

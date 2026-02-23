# UI Preview Access - Quick Resolution Checklist

## Critical Blockers (Must Fix First)

### ✓ Blocker #1: Environment Variables
- [ ] DATABASE_URL is set in Vercel project
  - Where: Vercel → Project → Settings → Environment Variables
  - Format: `postgresql://user:password@host/database?sslmode=require`
  - Test: `echo $DATABASE_URL` should output connection string
  
- [ ] GROQ_API_KEY is set (for AI features)
- [ ] ANTHROPIC_API_KEY is set (for Claude)
- [ ] SESSION_SECRET is set (random 32+ char string)

### ✓ Blocker #2: Code Compilation
- [ ] No TypeScript errors
  - Command: `pnpm type-check`
  - Should complete without errors
  
- [ ] Keystone models compile correctly
  - Check: UserStats has `graphql.plural: 'UserStatistics'`
  - Verify: All models export from `features/keystone/models/index.ts`
  
- [ ] No import errors
  - Check: All imports in pages/components are correct
  - Verify: No circular dependencies

### ✓ Blocker #3: Build Success
- [ ] `pnpm install` completes without errors
  - If fails: `rm -rf node_modules pnpm-lock.yaml` then reinstall
  
- [ ] `pnpm build` succeeds
  - Check output for any TypeScript or build errors
  - Should end with "export from ... complete"
  
- [ ] `pnpm dev` starts dev server
  - Should see: `Ready in Xms`
  - Should serve on: `http://localhost:3000`

---

## Verification Steps (In Order)

### Step 1: Check Environment
```bash
# Verify all critical env vars
echo $DATABASE_URL
echo $GROQ_API_KEY
echo $ANTHROPIC_API_KEY

# If any are empty, you need to set them
```

Status: [ ] Pass [ ] Fail → See "Critical Blockers" above

### Step 2: Clean Install
```bash
# Remove old files
rm -rf node_modules .next .prisma pnpm-lock.yaml

# Fresh install
pnpm install

# Check for errors
```

Status: [ ] Pass [ ] Fail → Check for package conflicts

### Step 3: Type Check
```bash
pnpm type-check
```

Status: [ ] Pass (no errors) [ ] Fail → Fix TypeScript errors

### Step 4: Build Test
```bash
pnpm build
```

Status: [ ] Pass [ ] Fail → Check build output for errors

### Step 5: Dev Server
```bash
pnpm dev
```

Status: [ ] Server started [ ] Failed → Check for startup errors

### Step 6: Browser Test
```bash
# In browser, go to:
http://localhost:3000
```

- [ ] Page loads (no blank screen)
- [ ] No JavaScript errors (F12 → Console tab)
- [ ] Images display correctly
- [ ] Styling looks good (not just text)

---

## Common Issues & Quick Fixes

| Issue | Quick Fix | Full Guide |
|-------|-----------|-----------|
| "DATABASE_URL not found" | Add to Vercel Vars | SETUP_TROUBLESHOOTING.md → Issue 1 |
| "Keystone error" | Already fixed; rebuild | SETUP_TROUBLESHOOTING.md → Issue 2 |
| Blank page | Check console errors | SETUP_TROUBLESHOOTING.md → Issue 3 |
| AI features 500 error | Add API keys | SETUP_TROUBLESHOOTING.md → Issue 4 |
| Database errors | Test connection | SETUP_TROUBLESHOOTING.md → Issue 5 |
| Payment errors | Add Stripe keys | SETUP_TROUBLESHOOTING.md → Issue 6 |

---

## Deployment Verification

After deploying to Vercel, verify:

- [ ] Build completes successfully
  - Vercel Dashboard → Deployments → Latest
  - Should show green checkmark
  
- [ ] Preview URL works
  - Click "Preview" button
  - Page should load without errors
  
- [ ] Production deployment ready
  - All tests pass
  - All environment variables set
  - Database migrations complete

---

## Performance Metrics

After UI preview is working, check:

| Metric | Target | How to Check |
|--------|--------|--------------|
| Page Load Time | < 3s | DevTools → Performance tab |
| Largest Contentful Paint (LCP) | < 2.5s | Google PageSpeed Insights |
| API Response Time | < 500ms | DevTools → Network tab |
| Database Query Time | < 100ms | Neon dashboard → Monitoring |

---

## Success Criteria (All Must Pass)

✓ Landing page visible at `/`
✓ Pricing page visible at `/pricing`
✓ No console errors in browser
✓ All navigation links work
✓ Responsive on mobile/tablet/desktop
✓ Images and styling load correctly
✓ API endpoints responding (DevTools Network)
✓ Database connection established

---

## Next Actions

**If All Checks Pass:**
1. Celebrate! 🎉 The UI is now accessible
2. Start user testing
3. Iterate on features based on feedback

**If Some Checks Fail:**
1. Note the specific issue
2. Find it in the table above
3. Go to the full troubleshooting guide
4. Implement the fix
5. Rerun the failing check

**If Still Stuck:**
1. Run diagnostic: `bash scripts/diagnose.sh`
2. Check logs: `pnpm dev` output
3. Search error message online
4. Contact support with error details

---

## Key Contacts & Resources

- **Vercel Support**: https://vercel.com/help
- **Keystone Docs**: https://keystonejs.com/
- **Neon Docs**: https://neon.tech/docs
- **AI SDK**: https://sdk.vercel.ai
- **Stripe Docs**: https://stripe.com/docs

---

## Notes

- Plan file: UI_PREVIEW_RESOLUTION_PLAN.md
- Full guide: SETUP_TROUBLESHOOTING.md
- Implementation summary: IMPLEMENTATION_SUMMARY.md
- GitHub branch: thesis-writing-platform

Keep this checklist handy during setup and troubleshooting!


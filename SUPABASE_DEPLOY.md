# AI SDR - Supabase Quick Deploy

## 🚀 One-Click Deploy (Fixed)

This version works with Supabase backend.

### Deploy Button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rishabpoddar2012/ai-sdr-app)

### Environment Variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Build Settings:
- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

---

## ⚠️ Current Issue

The frontend code expects the old REST API. For Supabase, we need to:

1. Update API calls to use Supabase client
2. Or use the Supabase Edge Functions we created

### Quick Fix Options:

**Option A: Use Old Frontend + Supabase REST API**
Update `api.js` to call Supabase Edge Functions:
```javascript
const API_URL = 'https://your-project.supabase.co/functions/v1';
```

**Option B: Simple Static Landing Page (Works Now)**
Deploy a simple landing page that links to Supabase project.

---

## 🔧 Quick Fix - Use This URL in Vercel:

Set environment variable:
```
VITE_API_URL=https://your-project.supabase.co/functions/v1/api
```

Then redeploy.

---

## 🎯 Alternative: Use Render Instead

If Supabase frontend integration is complex, go back to Render:

1. Delete the stuck Render deployment
2. Create new web service only (no database - use Supabase DB!)
3. Set `DATABASE_URL` to your Supabase connection string

Best of both worlds:
- ✅ Database: Supabase (free, reliable)
- ✅ API: Render (free tier works fine for web service only)

---

## 📞 Next Steps

1. Decide: Supabase-only or Supabase+Render hybrid
2. I'll update the frontend code accordingly
3. Deploy fresh

**Which option do you prefer?**

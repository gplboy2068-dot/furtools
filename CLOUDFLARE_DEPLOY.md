# Cloudflare Deployment Guide for FurTools

FurTools is configured to deploy directly to **Cloudflare Workers (with Static Assets)** or **Cloudflare Pages**.

---

## Option 1: Direct 1-Command CLI Deployment (Recommended)

You can deploy directly to Cloudflare Workers from your terminal:

```bash
# 1. Log in to your Cloudflare account (one-time)
npx wrangler login

# 2. Build and Deploy
npm run deploy
```

Once complete, Wrangler will display your live Cloudflare URL (e.g. `https://furtools.<your-subdomain>.workers.dev`).

### Adding a Custom Domain (`www.furtools.com`) in Cloudflare Workers:
1. Go to the **Cloudflare Dashboard** → **Compute (Workers & Pages)** → Select **furtools**.
2. Go to **Settings** → **Domains & Routes** → **Add** → **Custom Domain**.
3. Enter `www.furtools.com` and `furtools.com`. Cloudflare will automatically provision SSL certificates and route traffic to the worker.

---

## Option 2: Cloudflare Dashboard Git Integration (Auto-Deploy on Push)

If you prefer connecting your GitHub repository to Cloudflare for automatic deployments whenever you push to `main`:

### For Cloudflare Workers:
1. Go to **Cloudflare Dashboard** → **Compute (Workers & Pages)** → **Create application** → **Workers**.
2. Click **Connect to Git** and choose `gplboy2068-dot/furtools`.
3. Set:
   - **Build command**: `npm run build`
   - **Deploy command**: `npx wrangler deploy`
4. Under **Settings → Variables and Secrets**, add:
   - `VITE_SUPABASE_URL`: `https://tkhpnsgxoplkyueczpzp.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: *(Your Supabase publishable anon key)*
   - `NODE_VERSION`: `20`

### For Cloudflare Pages:
1. Go to **Compute (Workers & Pages)** → **Create application** → **Pages** → **Connect to Git**.
2. Choose `gplboy2068-dot/furtools`.
3. Build Settings:
   - **Framework Preset**: `None`
   - **Build command**: `npm run deploy:pages` (or `npm run build`)
   - **Build output directory**: `.output/public`
4. Add the same Environment Variables as above.

---

## Key Files Configured:
- [`wrangler.json`](file:///g:/FurTools%20Platform/wrangler.json): Defines worker entry point (`.output/server/index.mjs`), compatibility date, `nodejs_compat` flag, and static assets binding (`ASSETS` pointing to `.output/public`).
- [`vite.config.ts`](file:///g:/FurTools%20Platform/vite.config.ts): Automatically configures Nitro for Cloudflare Workers and Cloudflare Pages without forcing Vercel presets in CI.
- [`package.json`](file:///g:/FurTools%20Platform/package.json): Added `"deploy"` and `"deploy:pages"` commands and `wrangler` devDependency.

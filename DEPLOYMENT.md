# AesthTech Solutions — Vercel Deployment Guide

This app has two services that need to be deployed separately:

| Service | What it is | Where to deploy |
|---|---|---|
| **Frontend** | React + Vite SPA | Vercel |
| **API Server** | Express + PostgreSQL backend | Railway / Render / Fly.io |

---

## Step 1 — Deploy the API Server

The API server requires a persistent Node.js process and a PostgreSQL database.
**Recommended: [Railway](https://railway.app)** (free tier available)

### On Railway:

1. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub repo**
2. Select this repository, set the **Root Directory** to `artifacts/api-server`
3. Railway will auto-detect Node.js. Set the **Start Command** to:
   ```
   node --enable-source-maps ./dist/index.mjs
   ```
4. Add a **PostgreSQL** plugin from the Railway dashboard — it will auto-set `DATABASE_URL`
5. Set the following environment variables in Railway:

| Variable | Value | Notes |
|---|---|---|
| `PORT` | `8080` | Railway sets this automatically |
| `DATABASE_URL` | *(auto-set by Railway Postgres plugin)* | Connection string |
| `JWT_SECRET` | `your-long-random-secret-here` | Used to sign auth tokens — keep secret |
| `RAZORPAY_KEY_ID` | `rzp_live_XXXXXXXXXXXXXXXX` | From Razorpay Dashboard → API Keys |
| `RAZORPAY_KEY_SECRET` | `your_razorpay_secret` | From Razorpay Dashboard → API Keys |
| `RESEND_API_KEY` | `re_XXXXXXXXXXXXXXXXXXXXXXXX` | From [resend.com](https://resend.com) → API Keys |
| `CORS_ORIGIN` | `https://your-app.vercel.app` | Your Vercel frontend URL (add after deploying frontend) |

6. After deploying, note the Railway public URL, e.g. `https://aesthtech-api.railway.app`
7. **Run database migrations** — in Railway's shell tab run:
   ```
   pnpm run push-force
   ```
   Or connect to the database and run the Drizzle push from your local machine with the Railway DATABASE_URL.

---

## Step 2 — Deploy the Frontend to Vercel

### On Vercel:

1. Go to [vercel.com](https://vercel.com) → **Add New Project → Import GitHub repo**
2. Leave the **Root Directory** as the repo root (`.`)
3. Vercel will auto-detect the `vercel.json` config in the repo
4. **Build settings** (auto-read from `vercel.json`):
   - Build Command: `pnpm run build`
   - Output Directory: `artifacts/aesthetech-website/dist/public`
5. Set the following **Environment Variables** in Vercel:

| Variable | Value | Notes |
|---|---|---|
| `VITE_API_URL` | `https://aesthtech-api.railway.app` | Your Railway API URL (from Step 1) |

6. Click **Deploy**

---

## Step 3 — Update CORS After Deployment

Once your Vercel app is live (e.g. `https://aesthtech.vercel.app`):

1. Go back to Railway → your API service → **Variables**
2. Update `CORS_ORIGIN` to your Vercel URL:
   ```
   CORS_ORIGIN=https://aesthtech.vercel.app
   ```
3. If you have a custom domain, add it too (comma-separated):
   ```
   CORS_ORIGIN=https://aesthtech.vercel.app,https://aesthetechsolutions.co.in
   ```
4. Railway will automatically redeploy

---

## Step 4 — Seed the Production Database

After the API is deployed and the database is set up, seed the assessments and challenges:

```bash
# From your local machine, with the production DATABASE_URL:
DATABASE_URL="postgresql://..." node scripts/seed.mjs
```

Or use Railway's shell to run the seed script directly.

---

## Razorpay Setup

1. Log in to [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Go to **Settings → API Keys → Generate Key**
3. For **test payments**, use keys starting with `rzp_test_`
4. For **live payments**, use keys starting with `rzp_live_` (requires KYC)
5. In your Razorpay Dashboard, add your domain to the **Allowed Domains** list:
   - `https://aesthetechsolutions.co.in`
   - `https://your-app.vercel.app`

---

## Resend Email Setup

1. Log in to [resend.com](https://resend.com)
2. Go to **API Keys → Create API Key**
3. Go to **Domains → Add Domain** and verify `aesthetechsolutions.co.in`
   - Add the DNS records shown (SPF, DKIM) to your domain registrar
   - Without domain verification, emails can only be sent to your own Resend account email
4. Once verified, emails will be sent from `support@aesthetechsolutions.co.in`

---

## Environment Variables Summary

### API Server (Railway / Render / Fly.io)

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | Port to listen on (set by platform) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret for signing JWT tokens (any long random string) |
| `RAZORPAY_KEY_ID` | Yes | Razorpay API Key ID |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay API Key Secret |
| `RESEND_API_KEY` | Yes | Resend API Key for sending emails |
| `CORS_ORIGIN` | Yes | Comma-separated list of allowed frontend origins |
| `NODE_ENV` | Recommended | Set to `production` |

### Frontend (Vercel)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Full URL of your deployed API server |

---

## Verifying Your Deployment

Once deployed, test the following:

1. **Home page loads** → `https://your-app.vercel.app`
2. **Registration works** → `/mindmap/register` → check for welcome email
3. **Login works** → `/mindmap/login`
4. **Assessments show** → `/mindmap/assessments`
5. **Razorpay checkout opens** → `/mindmap/pricing` → click "Choose Plan"
6. **Contact form sends email** → `/contact`

---

## Troubleshooting

| Issue | Likely Cause | Fix |
|---|---|---|
| API calls fail (CORS error) | `CORS_ORIGIN` missing/wrong | Add your Vercel URL to `CORS_ORIGIN` on Railway |
| 500 errors on registration | DB tables missing | Run `drizzle-kit push` on the production database |
| Razorpay checkout fails | Wrong domain in Razorpay settings | Add your domain in Razorpay Dashboard → Settings |
| Emails not sending | Domain not verified in Resend | Verify your domain DNS records in Resend |
| Blank assessments page | DB not seeded | Run the seed script against production DB |

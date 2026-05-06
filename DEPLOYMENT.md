# Deployment Guide

This guide covers deploying the Gemini Chatbot to various platforms.

## Prerequisites

- GitHub repository (for automated deployments)
- Google Gemini API key
- Production-ready HTTPS domain (recommended)

## Quick Deployment

### Option 1: Render (Recommended for Full Stack)

Render supports monorepo deployments with a single `render.yaml` file.
A `render.yaml` has been added to the repo to deploy both services together.

- `gemini-chatbot-backend` (Node web service)
- `gemini-chatbot-frontend` (Static site)

After connecting your repo in Render, update the following environment variables in the Render dashboard:

- `GEMINI_API_KEY`
- `CORS_ORIGIN` (frontend URL)
- `VITE_API_URL` (backend API URL)

**Render setup steps:**

1. Create a Render account and connect your GitHub repository.
2. Render will detect the `render.yaml` and create two services.
3. Set the secrets in the Render dashboard.
4. Deploy and verify both services are healthy.

### Option 2: Vercel (Recommended for Frontend)

**Frontend deployment to Vercel:**

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. In frontend directory
cd frontend
vercel

# 3. Follow the prompts
# - Project name: gemini-chatbot
# - Framework: Vite
# - Build command: npm run build
# - Output directory: dist

# 4. Add environment variables in Vercel dashboard:
# VITE_API_URL=https://your-backend-url.com/api
```

### Option 2: Railway (Easy - Backend & Frontend)

**Deploy both with Railway:**

1. **Backend:**
   - Push code to GitHub
   - Connect GitHub repo to Railway
   - Add environment variables:
     ```
     GEMINI_API_KEY=your_key
     CORS_ORIGIN=https://your-frontend-url.vercel.app
     PORT=3000
     ```
   - Deploy!

2. **Frontend:**
   - Create new Railway service
   - Add environment variables:
     ```
     VITE_API_URL=https://your-backend-url.up.railway.app/api
     ```
   - Deploy!

### Option 3: Heroku (Backend)

```bash
# 1. Install Heroku CLI
# Download from https://devcenter.heroku.com/articles/heroku-cli

# 2. Login
heroku login

# 3. Create app
heroku create your-app-name

# 4. Set environment variables
heroku config:set GEMINI_API_KEY=your_key
heroku config:set CORS_ORIGIN=https://your-frontend.vercel.app

# 5. Deploy
git push heroku main
```

## Detailed Deployment Steps

### Backend Deployment (Node.js/Express)

#### Step 1: Prepare for Production

```bash
cd backend

# Create production .env
cat > .env << EOF
GEMINI_API_KEY=your_production_key
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
EOF
```

#### Step 2: Test Production Build

```bash
# Install dependencies
npm install --production

# Start server
PORT=3000 npm start

# Test health endpoint
curl http://localhost:3000/api/health
```

#### Step 3: Deploy to Cloud

**Using Railway:**

```bash
# 1. Create railway.json
cat > railway.json << EOF
{
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "npm start"
  }
}
EOF

# 2. Push to GitHub
git add .
git commit -m "Add railway config"
git push

# 3. Connect to Railway dashboard
```

**Using Heroku:**

```bash
# 1. Create Procfile
echo "web: npm start" > Procfile

# 2. Create heroku.yml
cat > heroku.yml << EOF
build:
  languages:
    - nodejs
  buildpacks:
    - heroku/nodejs
EOF

# 3. Deploy
git push heroku main
```

**Using AWS (Lambda/Elastic Beanstalk):**

```bash
# 1. Install AWS CLI
# 2. Configure credentials
aws configure

# 3. Deploy with Elastic Beanstalk
eb init
eb create
eb deploy
```

### Frontend Deployment (React/Vite)

#### Step 1: Build

```bash
cd frontend

# Create production .env
cat > .env.production << EOF
VITE_API_URL=https://your-backend-api-url.com/api
EOF

# Build
npm run build

# Output in: dist/
```

#### Step 2: Deploy to Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel --prod

# 3. Set environment variables in Vercel dashboard
```

**Or: Deploy to Netlify**

```bash
# 1. Install Netlify CLI
npm i -g netlify-cli

# 2. Build
npm run build

# 3. Deploy
netlify deploy --prod --dir=dist
```

**Or: Deploy to GitHub Pages**

```bash
# Update vite.config.js
# base: '/gemini-chatbot/'

# Build
npm run build

# Deploy with GitHub Actions (auto)
```

#### Step 3: Setup CORS

Update backend `.env`:
```env
CORS_ORIGIN=https://your-vercel-domain.vercel.app
```

## Environment Setup for Production

### Backend Production (.env)

```env
# CRITICAL: Your production API key
GEMINI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx

# Server configuration
PORT=3000
NODE_ENV=production

# CORS: Your deployed frontend URL
CORS_ORIGIN=https://gemini-chatbot.vercel.app

# Optional: Logging level
LOG_LEVEL=info
```

### Frontend Production (.env.production)

```env
# Your deployed backend URL
VITE_API_URL=https://gemini-backend.railway.app/api

# Optional: Disable console in production
VITE_DEBUG=false
```

## SSL/HTTPS Setup

All production URLs should use HTTPS:

```
Frontend:  https://gemini-chatbot.vercel.app
Backend:   https://gemini-backend.railway.app
```

Most platforms (Vercel, Railway, Heroku) provide free SSL certificates.

## Domain Mapping

### Using Custom Domain

**Frontend:**
1. In Vercel dashboard: Settings → Domains
2. Add your domain: `chatbot.example.com`
3. Update CORS on backend

**Backend:**
1. In Railway/Heroku: Settings → Domain
2. Add your domain: `api.example.com`
3. Update frontend `.env`

## Monitoring & Logging

### View Logs

**Railway:**
```bash
# In Railway dashboard: Logs tab
```

**Heroku:**
```bash
heroku logs --tail
```

**Vercel:**
```bash
vercel logs
```

### Error Tracking (Optional)

Use Sentry for error tracking:

```bash
# 1. Create Sentry account
# 2. Create project (Node.js for backend)
# 3. Install Sentry SDK

npm install @sentry/node

# 4. Add to backend/src/server.js
import * as Sentry from "@sentry/node";
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

## Performance Optimization

### Frontend

```bash
# Build analysis
npm install --save-dev rollup-plugin-visualizer

# Then check dist/ size
```

### Backend

1. Enable caching headers
2. Use Redis (optional)
3. Setup CDN for static assets

## Security Checklist

- [ ] API key is NOT in git history
- [ ] HTTPS enabled on all URLs
- [ ] CORS_ORIGIN is specific (not *)
- [ ] Environment variables set on deployment platform
- [ ] File upload size limits enforced
- [ ] No console.log of sensitive data
- [ ] Rate limiting configured (optional)

## Backup & Recovery

### Database (if added)

```bash
# Regular backups
mongodump --uri="mongodb://..."

# Or: Use platform's built-in backup
# Railway: Data Persistence
# Heroku: Postgres backups
```

### API Key Rotation

```bash
# 1. Generate new key in Google AI Studio
# 2. Update deployment platform environment
# 3. Delete old key
# 4. Monitor for errors
# 5. Rotate monthly (recommended)
```

## Troubleshooting Deployment

### 502 Bad Gateway

- Backend not running
- Check: `heroku logs --tail`
- Verify PORT environment variable

### CORS Errors

```bash
# Check backend .env
CORS_ORIGIN=https://your-exact-frontend-url.com

# No trailing slashes
# No ports in production
```

### API Key Invalid

- Verify key in deployment platform
- Check for extra spaces
- Regenerate if needed

### Build Failures

```bash
# Check buildpacks (Heroku/Railway)
# Ensure Node version >= 16
# Check package-lock.json
```

### Database Connection

- Verify connection string
- Check firewall/whitelist IP
- Test locally first

## Rollback Procedure

### Vercel
```bash
# Go to Deployments tab
# Click previous deployment
# Click "Promote to Production"
```

### Railway
```bash
# Logs → Previous build
# Select and redeploy
```

### Heroku
```bash
# View releases
heroku releases

# Rollback to previous
heroku rollback v<NUMBER>
```

## Scaling (When Needed)

### Database
- Add MongoDB Atlas
- Add Redis caching

### Backend
- Add load balancer
- Multiple instances
- Job queue for heavy tasks

### Frontend
- CDN (Cloudflare)
- Static site hosting
- Image optimization

## Cost Estimation (Monthly)

| Service | Free Tier | Paid |
|---------|-----------|------|
| Vercel (Frontend) | ✓ | $20/mo |
| Railway (Backend) | $5 credit | $5-50/mo |
| MongoDB Atlas | 512MB | $10+/mo |
| Google Gemini API | - | Pay per use |
| Domain | - | $10-15/mo |
| **Total** | Free | ~$50-100/mo |

## Going Live Checklist

- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] Environment variables set
- [ ] CORS configured
- [ ] HTTPS working
- [ ] Custom domain (optional)
- [ ] Error tracking enabled
- [ ] Logging configured
- [ ] Backup strategy ready
- [ ] Monitoring alerts set
- [ ] Documentation updated
- [ ] Share with users!

## Support & Resources

- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Heroku Docs](https://devcenter.heroku.com)
- [Node.js Deployment](https://nodejs.org/en/knowledge/getting-started/nodejs-deploy-heroku)

---

**Happy deploying!** 🚀

Questions? Check the troubleshooting section or open an issue.

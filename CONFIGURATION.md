# Environment Configuration Guide

## Backend Configuration (.env)

```env
# Required: Google Gemini API Key
# Get it from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Server Port (default: 5000)
PORT=5000

# Optional: Environment (default: development)
NODE_ENV=development

# Optional: CORS Origin (default: http://localhost:5173)
CORS_ORIGIN=http://localhost:5173
```

### Environment Variables Explanation

- **GEMINI_API_KEY**: Your authentication key for Google Gemini API
- **PORT**: Express server port (change if 5000 is busy)
- **NODE_ENV**: Set to "production" for deployment
- **CORS_ORIGIN**: Frontend URL for CORS validation

### Backend Development Setup

```bash
cd backend
cp .env.example .env

# Edit .env with your values
nano .env  # or use your editor
```

## Frontend Configuration (.env)

```env
# Optional: Backend API URL (default: http://localhost:5000/api)
VITE_API_URL=http://localhost:5000/api
```

### Frontend Development Setup

```bash
cd frontend
cp .env.example .env

# Edit .env if needed (usually no changes needed for local dev)
nano .env
```

## Different Environments

### Local Development

**Backend (.env)**
```env
GEMINI_API_KEY=your_key
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

### Local Testing (Different Machines)

**Backend (.env) - on machine A (192.168.1.100)**
```env
GEMINI_API_KEY=your_key
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://192.168.1.101:5173
```

**Frontend (.env) - on machine B (192.168.1.101)**
```env
VITE_API_URL=http://192.168.1.100:5000/api
```

### Production Deployment

**Backend (.env)**
```env
GEMINI_API_KEY=your_production_key
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

**Frontend (.env)**
```env
VITE_API_URL=https://api.yourdomain.com/api
```

## Security Best Practices

⚠️ **Important**:

1. **Never commit .env files** to git
   ```bash
   # Already in .gitignore, but verify:
   echo ".env" >> .gitignore
   ```

2. **Never share your API key**
   - Don't post in issues/forums
   - Don't screenshot with key visible
   - Regenerate if accidentally exposed

3. **Use environment variables in production**
   - Use platform secrets (Vercel, Heroku, etc.)
   - Never hardcode credentials
   - Rotate keys periodically

4. **Validate all inputs**
   - Don't trust user input
   - Sanitize file names
   - Check file types

## Troubleshooting Configuration

### "GEMINI_API_KEY is not set" error

**Solution:**
```bash
# Verify .env exists
cat backend/.env

# Check if GEMINI_API_KEY line exists
grep GEMINI_API_KEY backend/.env

# Make sure there are no spaces:
# ✓ GEMINI_API_KEY=sk-...
# ✗ GEMINI_API_KEY = sk-...  (spaces around =)
# ✗ GEMINI_API_KEY="sk-..."  (quotes included in value)
```

### CORS errors in browser

**Solution:**
```bash
# Verify CORS_ORIGIN in backend/.env
# Should match your frontend URL exactly:
# Frontend: http://localhost:5173
# Backend: CORS_ORIGIN=http://localhost:5173
```

### Port already in use

**Solution:**
```bash
# Change PORT in backend/.env:
PORT=5001

# Then update frontend/.env:
VITE_API_URL=http://localhost:5001/api
```

### Frontend can't reach backend

**Solution:**
```bash
# In frontend/.env:
VITE_API_URL=http://localhost:5000/api

# Restart frontend dev server
# And ensure backend is running
curl http://localhost:5000/api/health
```

## Configuration Templates

### Quick Setup (Minimal)

Create `backend/.env`:
```env
GEMINI_API_KEY=your_key_here
```

That's it! Other values have sensible defaults.

### Advanced Setup (Full Control)

Create `backend/.env`:
```env
GEMINI_API_KEY=your_key_here
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://chatbot.example.com
```

Create `frontend/.env`:
```env
VITE_API_URL=https://api.example.com/api
```

## Environment Validation

To validate your configuration:

```bash
# Backend
cd backend
npm start

# Check output for:
# ✓ GEMINI_API_KEY: Set
# ✓ 🚀 Backend running on http://localhost:PORT
```

## Configuration for Docker

If using Docker (future):

```dockerfile
# Set via environment variables
ENV GEMINI_API_KEY=${GEMINI_API_KEY}
ENV PORT=5000
ENV CORS_ORIGIN=${CORS_ORIGIN}
```

## Configuration for Production Services

### Vercel (Frontend)

1. Add environment variable in Vercel dashboard:
   ```
   VITE_API_URL=https://api.yourdomain.com/api
   ```

### Heroku (Backend)

1. Add config vars:
   ```
   GEMINI_API_KEY=your_key
   CORS_ORIGIN=https://yourdomain.com
   ```

### Railway (Backend/Frontend)

1. Set environment variables in project settings

## Resetting Configuration

To reset and start fresh:

```bash
# Backend
rm backend/.env
cp backend/.env.example backend/.env
nano backend/.env  # Add API key

# Frontend (optional)
rm frontend/.env
cp frontend/.env.example frontend/.env
```

---

Need help? Check QUICKSTART.md for setup instructions.

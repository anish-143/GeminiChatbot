# Quick Start Guide

Get the Gemini Chatbot running in 5 minutes!

## Prerequisites
- Node.js 16+ installed
- Google Gemini API key (free at https://aistudio.google.com/app/apikey)

## Step 1: Get API Key
1. Visit https://aistudio.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key

## Step 2: Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Open .env and add your API key:
# GEMINI_API_KEY=paste_your_key_here
```

## Step 3: Setup Frontend

```bash
# Navigate to frontend (in new terminal)
cd frontend

# Install dependencies
npm install

# Create .env (optional)
cp .env.example .env
```

## Step 4: Run Both

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Wait for: 🚀 Gemini Chatbot Backend running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Wait for: ➜  Local:   http://localhost:5173/
```

## Step 5: Open Browser
Visit: **http://localhost:5173**

Start chatting! 🎉

## Troubleshooting

### Port already in use?
```bash
# Backend alternative port
PORT=5001 npm run dev

# Update frontend .env
VITE_API_URL=http://localhost:5001/api
```

### "Cannot find module" error?
```bash
rm -rf node_modules package-lock.json
npm install
```

### API key not working?
- Check it's copied correctly from Google AI Studio
- Ensure no extra spaces
- Regenerate if needed

## Features to Try

1. **Text Chat** - Just type and chat
2. **Upload PDF** - Upload a document and ask questions
3. **Upload Image** - Upload a screenshot and ask Gemini to analyze it
4. **Copy Chat** - Copy all messages to clipboard
5. **New Chat** - Start fresh conversation

## Next Steps

- Read full [README.md](./README.md)
- Explore the codebase
- Customize colors in `frontend/tailwind.config.js`
- Add new features!

Enjoy! 🚀

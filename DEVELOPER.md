# Developer Guide

Quick reference for common development tasks.

## Setup

### First Time Setup

```bash
# Clone/Extract project
cd GeminiChatbot

# Backend
cd backend
npm install
cp .env.example .env
# Edit .env and add GEMINI_API_KEY

# Frontend
cd ../frontend
npm install
```

### Start Development

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Open http://localhost:5173
```

## Common Commands

### Backend Commands

```bash
# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Install new package
npm install package-name

# Remove package
npm uninstall package-name
```

### Frontend Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint

# Install new package
npm install package-name
```

## Project Structure Quick Reference

```
GeminiChatbot/
├── backend/
│   ├── src/
│   │   ├── server.js              # Main entry point
│   │   ├── controllers/
│   │   │   └── chatController.js  # Request handlers
│   │   ├── routes/
│   │   │   ├── chatRoutes.js      # Chat endpoints
│   │   │   └── healthRoutes.js    # Health check
│   │   ├── services/
│   │   │   ├── geminiService.js   # Gemini AI logic
│   │   │   └── fileService.js     # File processing
│   │   ├── middleware/
│   │   │   ├── errorHandler.js    # Error handling
│   │   │   └── validation.js      # Input validation
│   │   └── utils/                 # Utilities (empty, for future)
│   ├── .env.example               # Template env file
│   └── package.json               # Dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Root component
│   │   ├── main.jsx               # Entry point
│   │   ├── pages/
│   │   │   └── Home.jsx           # Main page
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx     # Message display
│   │   │   ├── MessageBubble.jsx  # Single message
│   │   │   ├── ChatInput.jsx      # Input textarea
│   │   │   ├── UploadButtons.jsx  # File uploads
│   │   │   └── Sidebar.jsx        # Side navigation
│   │   ├── context/
│   │   │   └── ChatContext.jsx    # State management
│   │   ├── services/
│   │   │   └── api.js             # API calls
│   │   └── hooks/
│   │       └── useToast.js        # Toast notifications
│   ├── index.html                 # HTML template
│   ├── vite.config.js             # Vite config
│   ├── tailwind.config.js         # Tailwind config
│   └── package.json               # Dependencies
│
├── README.md                       # Main documentation
├── QUICKSTART.md                   # Quick setup guide
├── CONFIGURATION.md               # Env configuration
├── DEPLOYMENT.md                  # Deployment guide
├── ARCHITECTURE.md                # System design
└── DEVELOPER.md                   # This file
```

## Adding New Features

### Add Backend Endpoint

1. **Create controller method** in `backend/src/controllers/chatController.js`:
   ```javascript
   export async function newFeature(req, res) {
     try {
       // Your logic
       res.json({ success: true, data: {} });
     } catch (error) {
       res.status(500).json({ success: false, error: { message: error.message } });
     }
   }
   ```

2. **Add route** in `backend/src/routes/chatRoutes.js`:
   ```javascript
   router.post("/new-endpoint", newFeature);
   ```

3. **Test with curl**:
   ```bash
   curl -X POST http://localhost:5000/api/new-endpoint \
     -H "Content-Type: application/json" \
     -d '{"key":"value"}'
   ```

### Add Frontend Component

1. **Create component** in `frontend/src/components/NewComponent.jsx`:
   ```javascript
   export function NewComponent() {
     return <div>Component</div>;
   }
   ```

2. **Import in page**:
   ```javascript
   import { NewComponent } from "../components/NewComponent";
   ```

3. **Use in JSX**:
   ```javascript
   <NewComponent />
   ```

### Add Context State

1. **Update** `frontend/src/context/ChatContext.jsx`:
   ```javascript
   const [newState, setNewState] = useState(null);
   
   const value = {
     // ... existing
     newState,
     setNewState,
   };
   ```

2. **Use in component**:
   ```javascript
   const { newState, setNewState } = useChat();
   ```

## API Testing

### Using curl

```bash
# Test health
curl http://localhost:5000/api/health

# Send message
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message":"Hello",
    "sessionId":"test",
    "chatHistory":[]
  }'

# Upload document
curl -X POST http://localhost:5000/api/upload/document \
  -F "file=@document.pdf"
```

### Using Postman

1. Import requests
2. Set `{{BASE_URL}}` to `http://localhost:5000/api`
3. Test each endpoint

### Using VS Code REST Client

Create `test.http`:
```http
### Health Check
GET http://localhost:5000/api/health

### Send Message
POST http://localhost:5000/api/chat
Content-Type: application/json

{
  "message": "Hello",
  "sessionId": "test",
  "chatHistory": []
}

### Reset Chat
POST http://localhost:5000/api/reset
```

Then: Right-click → Send Request

## Debugging

### Frontend Debugging

```javascript
// Add debug logs
console.log('Debug:', value);

// Use React DevTools
// - Install React DevTools browser extension
// - View component hierarchy
// - Inspect props/state

// Use Vite debug
// - Press 'h' in terminal during dev
```

### Backend Debugging

```javascript
// Add logs
console.log('Debug:', value);

// Use Node debugger
node --inspect src/server.js
// Then open chrome://inspect

// Check environment
console.log(process.env.GEMINI_API_KEY ? '✓' : '✗');
```

### Network Debugging

```javascript
// Browser DevTools: Network tab
// - See all requests
// - Check response/request
// - View headers

// curl verbose
curl -v http://localhost:5000/api/health
```

## Performance Optimization

### Frontend

```bash
# Analyze bundle
npm run build
# Check dist/assets sizes

# Lighthouse check
# DevTools → Lighthouse → Run audit
```

### Backend

```bash
# Monitor memory
node --trace-gc src/server.js

# Check response times
# Add timestamps to logs
console.time('fetch-data');
// ... code ...
console.timeEnd('fetch-data');
```

## Code Quality

### Linting Frontend

```bash
npm run lint

# Fix issues
npm run lint -- --fix
```

### Format Code

Install Prettier:
```bash
npm install --save-dev prettier
npx prettier --write "src/**/*.{js,jsx}"
```

## Git Workflow

```bash
# Check status
git status

# See changes
git diff

# Stage changes
git add .

# Commit
git commit -m "Add feature description"

# Push
git push origin main

# View log
git log --oneline
```

## Environment Variables

### Add New Variable

1. **Backend**: Add to `.env` and `.env.example`
   ```bash
   # .env
   NEW_VAR=value

   # .env.example
   NEW_VAR=example_value
   ```

2. **Access in code**:
   ```javascript
   const value = process.env.NEW_VAR;
   ```

3. **Frontend**: Add to `.env` and `.env.example`
   ```bash
   # .env
   VITE_NEW_VAR=value

   # Note: Must start with VITE_
   ```

4. **Access in code**:
   ```javascript
   const value = import.meta.env.VITE_NEW_VAR;
   ```

## Common Issues & Solutions

### Hot Reload Not Working

```bash
# Frontend
# Kill process and restart
# Ctrl+C then: npm run dev

# Backend (if using nodemon)
# Kill process and restart
# Ctrl+C then: npm run dev
```

### Dependencies Out of Date

```bash
# Check
npm outdated

# Update
npm update

# Major updates (be careful)
npm upgrade package-name
```

### Port Conflicts

```bash
# List processes on port
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000

# Kill process or use different port
PORT=5001 npm start
```

### Module Not Found

```bash
# Reinstall node_modules
rm -rf node_modules
npm install

# Restart dev server
```

## Testing Checklist

Before pushing code:

- [ ] Feature works locally
- [ ] No console errors
- [ ] No console warnings
- [ ] All files saved
- [ ] Code formatted
- [ ] Comments added where needed
- [ ] Tested in different browsers
- [ ] Mobile responsive (if applicable)
- [ ] API errors handled
- [ ] Loading states visible

## Documentation

When adding features, update:

1. **Code comments**
   ```javascript
   /**
    * Function description
    * @param {type} param - Parameter description
    * @returns {type} Return description
    */
   ```

2. **README.md** - Add to features list

3. **ARCHITECTURE.md** - Update diagrams

4. **API Docs** - Add endpoint documentation

## Performance Monitoring

### Add Timing Logs

```javascript
// Backend
const startTime = Date.now();
// ... operation ...
console.log(`Operation took ${Date.now() - startTime}ms`);

// Frontend
console.time('operation');
// ... operation ...
console.timeEnd('operation');
```

### Monitor Memory

```bash
# Backend
node --max-old-space-size=4096 src/server.js

# Check memory usage
# DevTools → Performance → Record
```

## Resources

- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)
- [Vite Docs](https://vitejs.dev)
- [Tailwind Docs](https://tailwindcss.com)
- [Google Gemini API](https://ai.google.dev)
- [MDN Web Docs](https://developer.mozilla.org)

## Getting Help

1. Check documentation files
2. Search code for similar patterns
3. Check browser console for errors
4. Check server logs
5. Use debugger tools
6. Ask in issues/discussions

---

Happy coding! 🚀

Questions? See other docs or create an issue.

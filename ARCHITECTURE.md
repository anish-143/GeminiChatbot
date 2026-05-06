# Architecture & Design Documentation

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │          React Frontend (Vite + Tailwind)        │  │
│  │                                                  │  │
│  │  ├─ ChatWindow (Message Display)               │  │
│  │  ├─ ChatInput (Text Input)                     │  │
│  │  ├─ UploadButtons (File/Image Upload)          │  │
│  │  ├─ Sidebar (Navigation)                       │  │
│  │  └─ Context (State Management)                 │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                        │
                   Axios HTTP
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Express Backend (Node.js)                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │            Routes & Controllers                 │  │
│  │  ├─ POST /api/chat                             │  │
│  │  ├─ POST /api/upload/document                  │  │
│  │  ├─ POST /api/upload/image                     │  │
│  │  ├─ POST /api/reset                            │  │
│  │  └─ GET /api/health                            │  │
│  └──────────────────────────────────────────────────┘  │
│                       │                                │
│  ┌────────────────────┼────────────────────┐         │
│  ▼                    ▼                    ▼         │
│ Gemini Service   File Service       Session Store   │
└─────────────────────────────────────────────────────────┘
        │                 │
        ▼                 ▼
   Google Gemini      PDF/TXT Parsing
   Multimodal API     & Extraction
```

## Data Flow

### 1. Chat Message Flow
```
User Input → ChatInput Component → 
  sendChatMessage(API) → Backend /api/chat → 
    Gemini Service (with context) → 
      Gemini API Response → 
        Backend returns → 
          Frontend adds to messages → 
            MessageBubble rendered
```

### 2. Document Upload Flow
```
File Selected → UploadButtons → 
  uploadDocument(FormData) → Backend /api/upload/document → 
    File Service (extract text) → 
      Return text content → 
        Frontend stores in context → 
          Used in next messages to Gemini
```

### 3. Image Upload Flow
```
Image Selected → UploadButtons → 
  uploadImage(FormData) → Backend /api/upload/image → 
    Convert to Base64 → 
      Return encoded data → 
        Frontend stores in context → 
          Sent to Gemini in multimodal messages
```

## Component Architecture

### Frontend Components

```
App (Root)
├─ ChatProvider (Context)
└─ Home (Main Page)
   ├─ Sidebar
   │  └─ New Chat Button
   ├─ ChatWindow
   │  ├─ Message List
   │  └─ MessageBubble (Multiple)
   │     ├─ Markdown Renderer
   │     └─ Syntax Highlighter
   ├─ UploadButtons
   │  ├─ Document Input
   │  └─ Image Input
   └─ ChatInput
      └─ Message Textarea + Send Button
```

### Backend Structure

```
Server (Express)
├─ Routes
│  ├─ chatRoutes
│  │  ├─ POST /chat
│  │  ├─ POST /upload/document
│  │  ├─ POST /upload/image
│  │  ├─ POST /reset
│  │  └─ GET /session/:sessionId
│  └─ healthRoutes
│     └─ GET /health
├─ Controllers
│  └─ chatController
│     ├─ handleChatMessage()
│     ├─ uploadDocument()
│     ├─ uploadImage()
│     ├─ resetChat()
│     └─ getChatSession()
├─ Services
│  ├─ geminiService
│  │  ├─ sendMessageToGemini()
│  │  └─ sendSimpleMessage()
│  └─ fileService
│     ├─ extractTextFromPDF()
│     ├─ extractTextFromTXT()
│     ├─ convertImageToBase64()
│     └─ getImageMimeType()
└─ Middleware
   ├─ errorHandler
   └─ validation
```

## State Management

### Context (Frontend)

```javascript
ChatContext {
  // Session State
  sessionId: string
  isLoading: boolean

  // Message State
  messages: Array<{
    id: number
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>

  // Document State
  documentContent: string | null
  documentName: string | null

  // Image State
  imageData: {
    mimeType: string
    data: string (base64)
  } | null
  imageName: string | null

  // Functions
  addMessage()
  clearMessages()
  setDocument()
  clearDocument()
  setImage()
  clearImage()
  resetChat()
}
```

### In-Memory Session (Backend)

```javascript
chatSessions Map {
  sessionId: {
    id: string
    messages: Array<{
      role: 'user' | 'assistant'
      content: string
      timestamp: Date
    }>
    documentContent: string | null
    createdAt: Date
  }
}
```

## API Contract

### Request/Response Pattern

All responses follow:
```javascript
{
  success: boolean
  data?: Object
  error?: {
    status: number
    message: string
  }
}
```

### Message Schema

```javascript
Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: ISO8601
  id: number
}
```

### File Upload Response

```javascript
{
  filename: string
  mimeType: string
  size: number
  base64?: string (images only)
  content?: string (documents only)
  preview?: string (first 500 chars)
}
```

## Gemini Integration

### Model: gemini-1.5-flash

Used for:
- Fast responses
- Lower latency
- Cost-effective
- Multimodal support

### Multimodal Capabilities

1. **Text + Text** - Chat with context
2. **Text + Document** - Include document content in context
3. **Text + Image** - Analyze images
4. **Text + Document + Image** - Combined analysis

### Context Window

- Maintains full conversation history
- Documents stored in session
- Images encoded in base64
- Context resets on new chat

## Error Handling

### Frontend
- Axios interceptors for HTTP errors
- Toast notifications for user feedback
- Fallback error messages
- Try-catch blocks

### Backend
- Express error middleware
- File validation
- Gemini API error handling
- Request body validation

## Performance Optimizations

1. **Frontend**
   - Code splitting with Vite
   - Lazy loading components
   - Memoization with useCallback
   - Smooth animations with Framer Motion

2. **Backend**
   - In-memory storage (fast)
   - Multer streaming for files
   - Efficient PDF parsing
   - Session cleanup (24-hour TTL)

3. **Network**
   - Gzip compression
   - Minimal payload size
   - Timeout handling

## Security Measures

1. **API Key**
   - Stored in backend .env only
   - Never exposed to frontend
   - Server-side Gemini calls

2. **File Uploads**
   - Type validation (MIME)
   - Size limits (10MB)
   - In-memory storage (no disk)

3. **CORS**
   - Whitelist specific origin
   - Credentials handling
   - POST/GET method support

4. **Input Validation**
   - Empty message checks
   - File format validation
   - Size limits

## Scalability Considerations

Current (Single Server):
- In-memory session storage
- Single Node.js process
- File limit: 10MB
- ~100 concurrent users

Future improvements:
- Redis for session persistence
- Database for message history
- Multiple worker processes
- CDN for static assets
- Message queuing (Bull/RabbitMQ)

## Development Workflow

```
1. Clone Repository
   └─ Install dependencies

2. Configure Environment
   └─ Set API keys

3. Development Mode
   ├─ npm run dev (both)
   ├─ Hot reloading enabled
   └─ Source maps available

4. Testing
   └─ Manual integration tests

5. Build
   ├─ Frontend: npm run build
   └─ Backend: Production config

6. Deploy
   └─ Frontend: Vercel/Netlify
   └─ Backend: Heroku/Railway
```

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| CORS error | Wrong origin | Check CORS_ORIGIN in .env |
| File upload fails | Wrong type | Validate file extension |
| Blank AI response | API error | Check API key validity |
| Session not found | Timeout | Create new session |
| Port conflict | In use | Change PORT in .env |

## Future Enhancements

1. **Database Integration**
   - MongoDB/PostgreSQL
   - Persistent storage
   - User accounts

2. **Advanced Features**
   - Streaming responses
   - Voice input/output
   - Multiple files
   - Chat history export

3. **Performance**
   - Caching layer
   - CDN integration
   - Load balancing

4. **Analytics**
   - Usage tracking
   - Error monitoring
   - Performance metrics

---

For more details, see README.md and code comments.

# Gemini AI Chatbot

A full-stack, modern web application for chatting with Google's Gemini AI. Features text conversations, document uploads (PDF/TXT), image uploads (PNG/JPG), and real-time chat context management.

![Gemini Chatbot](./screenshot.png)

## 🌐 Live Demo

[Click Here to Open Gemini Chatbot](https://gemini-chatbot-frontend-wp7k.onrender.com)

## ✨ Features

### Core Features
- 💬 **Real-time Chat** - Seamless text-based conversations with Gemini AI
- 📄 **Document Support** - Upload and analyze PDF and TXT files
- 🖼️ **Image Analysis** - Upload PNG/JPG images for multimodal AI responses
- 🧠 **Context Memory** - Maintains full conversation history within a session
- 🔄 **New Chat** - Reset and start fresh conversations anytime
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile

### UI/UX Features
- ⚡ **Smooth Animations** - Framer Motion powered transitions
- 🎨 **Modern Dark Theme** - Tailwind CSS with gradient backgrounds
- ⌨️ **Markdown Support** - Rich text rendering with syntax highlighting
- 🔔 **Toast Notifications** - Real-time feedback for user actions
- 📋 **Copy to Clipboard** - Easy message sharing
- ✏️ **File Uploads** - Drag-drop ready input fields
- 💫 **Loading States** - Beautiful typing indicators

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Hot Toast** - Notification system
- **Lucide React** - Icon library
- **React Markdown** - Markdown rendering
- **React Syntax Highlighter** - Code block highlighting
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Google Generative AI SDK** - Gemini AI integration
- **Multer** - File upload handling
- **pdf-parse** - PDF text extraction
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment configuration

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v16.0.0 or higher)
- npm or yarn
- Google Gemini API key (get it from [Google AI Studio](https://aistudio.google.com))

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd GeminiChatbot
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your Gemini API key
# GEMINI_API_KEY=your_key_here
```

**Get your Gemini API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and paste it in `.env`

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file (optional, defaults to localhost:5000)
cp .env.example .env
```

## ▶️ Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

Expected output:
```
🚀 Gemini Chatbot Backend running on http://localhost:5000
📚 API Documentation available at http://localhost:5000/api
🔑 GEMINI_API_KEY: ✓ Set
```

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v5.0.2  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### 4. Open in Browser

Visit `http://localhost:5173` and start chatting!

## 📖 API Documentation

### Chat Endpoints

#### POST `/api/chat`
Send a message and get AI response with context

**Request:**
```json
{
  "message": "What is machine learning?",
  "sessionId": "session_123",
  "chatHistory": [
    { "role": "user", "content": "Hi" },
    { "role": "assistant", "content": "Hello!" }
  ],
  "documentContent": null,
  "imageData": null
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "session_123",
    "response": "Machine learning is...",
    "messageCount": 2
  }
}
```

#### POST `/api/upload/document`
Upload and extract text from PDF or TXT

**Request:** multipart/form-data with file

**Response:**
```json
{
  "success": true,
  "data": {
    "filename": "document.pdf",
    "mimeType": "application/pdf",
    "contentLength": 5234,
    "preview": "First 500 chars...",
    "content": "Full extracted text..."
  }
}
```

#### POST `/api/upload/image`
Upload and encode image

**Request:** multipart/form-data with file

**Response:**
```json
{
  "success": true,
  "data": {
    "filename": "image.png",
    "mimeType": "image/png",
    "size": 45232,
    "base64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  }
}
```

#### POST `/api/reset`
Create a new chat session

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "session_new_123",
    "message": "New chat session created"
  }
}
```

#### GET `/api/health`
Health check endpoint

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 📁 Project Structure

```
GeminiChatbot/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── chatController.js
│   │   ├── services/
│   │   │   ├── geminiService.js
│   │   │   └── fileService.js
│   │   ├── routes/
│   │   │   ├── chatRoutes.js
│   │   │   └── healthRoutes.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── validation.js
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   ├── UploadButtons.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   ├── context/
│   │   │   └── ChatContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── hooks/
│   │   │   └── useToast.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   ├── package.json
│   └── .gitignore
│
└── README.md
```

## 🎯 Usage Guide

### 1. Start a Conversation
- Simply type your message in the input box
- Press "Send" or use Ctrl+Enter
- Wait for Gemini's response

### 2. Upload a Document
- Click "Upload Document (PDF/TXT)"
- Select your file
- The document content will be used in conversations
- Ask questions about the document!

### 3. Upload an Image
- Click "Upload Image (PNG/JPG)"
- Select your image
- Ask Gemini to analyze or describe it

### 4. Start a New Chat
- Click "New Chat" button
- All context will be cleared
- Messages, documents, and images reset

### 5. Copy Chat
- Click "Copy" button to copy all messages
- Useful for saving conversations

## 🔒 Security & Limitations

- ⏱️ **Session Timeout** - Chat sessions expire after 24 hours
- 📦 **File Size Limit** - Max 10MB per file
- 🔑 **API Key Security** - Never commit `.env` files
- 🔐 **CORS** - Only accepts requests from configured origin
- ⚠️ **In-Memory Storage** - Data lost on server restart

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process or use different port
PORT=5001 npm run dev
```

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS_ORIGIN in backend `.env`
- Clear browser cache and restart

### Gemini API errors
- Verify API key is correct
- Check API quotas at [Google Cloud Console](https://console.cloud.google.com)
- Ensure API is enabled for your project

### File upload fails
- Check file format (PDF/TXT for docs, PNG/JPG for images)
- Verify file size is under 10MB
- Try with a different file

## 📦 Build for Production

### Frontend

```bash
cd frontend
npm run build
```

Creates optimized build in `frontend/dist/`

### Backend

```bash
cd backend
npm start
```

For production deployment:
1. Set `NODE_ENV=production`
2. Use a process manager like PM2
3. Set up reverse proxy (Nginx)
4. Configure CORS properly

## 📝 Example Conversations

### 1. Document Analysis
```
User: Upload a research paper PDF
User: What are the main findings?
AI: Provides detailed summary of findings...
```

### 2. Image Analysis
```
User: Upload a screenshot
User: What's in this image?
AI: Analyzes and describes the image...
```

### 3. Contextual Questions
```
User: What is React?
AI: React is a JavaScript library...
User: How do I use hooks?
AI: In React, hooks are functions that let you...
```

## 🚀 Future Enhancements

- [ ] Multiple chat history with sidebar
- [ ] User authentication
- [ ] Chat persistence with database
- [ ] Streaming responses for faster feedback
- [ ] Voice input/output
- [ ] Custom system prompts
- [ ] Export chats as PDF/Markdown
- [ ] Dark/Light theme toggle
- [ ] Regenerate responses
- [ ] Message editing

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Google Generative AI for Gemini API
- React and Vite communities
- Tailwind CSS for beautiful utilities

## 📧 Support

For issues, questions, or suggestions:
1. Check existing documentation
2. Review GitHub issues
3. Create a new issue with details

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Google Gemini API](https://ai.google.dev)
- [Express.js](https://expressjs.com)

---

**Made with ❤️ by the Gemini Chatbot Team**

Happy Chatting! 🚀

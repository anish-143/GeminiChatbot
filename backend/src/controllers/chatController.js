import { sendMessageToGemini } from "../services/geminiService.js";
import { extractFileContent, convertImageToBase64, getImageMimeType } from "../services/fileService.js";

// In-memory storage for chat sessions
const chatSessions = new Map();

/**
 * Generate a unique chat session ID
 */
function generateChatSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Chat message handler
 */
export async function handleChatMessage(req, res) {
  try {
    const {
      message,
      sessionId,
      chatHistory = [],
      documentContent = null,
      imageData = null,
    } = req.body;

    // Validate input
    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        error: {
          message: "Message cannot be empty",
        },
      });
    }

    // Get or initialize session
    let session = chatSessions.get(sessionId);
    if (!session) {
      session = {
        id: sessionId || generateChatSessionId(),
        messages: [],
        documentContent: documentContent,
        createdAt: new Date(),
      };
      chatSessions.set(session.id, session);
    }

    // Update document content if provided
    if (documentContent) {
      session.documentContent = documentContent;
    }

    // Get AI response
    const aiResponse = await sendMessageToGemini(
      message,
      chatHistory,
      session.documentContent,
      imageData
    );

    // Store message in session history
    session.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    session.messages.push({
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    });

    // Clean up old sessions (older than 24 hours)
    const now = Date.now();
    for (const [key, value] of chatSessions.entries()) {
      if (now - value.createdAt.getTime() > 24 * 60 * 60 * 1000) {
        chatSessions.delete(key);
      }
    }

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        response: aiResponse,
        messageCount: session.messages.length,
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || "Failed to process chat message",
      },
    });
  }
}

/**
 * Upload and extract document
 */
export async function uploadDocument(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          message: "No file provided",
        },
      });
    }

    const { mimetype, originalname } = req.file;

    // Extract text based on file type
    const extractedText = await extractFileContent(req.file.buffer, mimetype);

    res.json({
      success: true,
      data: {
        filename: originalname,
        mimeType: mimetype,
        contentLength: extractedText.length,
        preview: extractedText.substring(0, 500),
        content: extractedText,
      },
    });
  } catch (error) {
    console.error("Document upload error:", error);
    res.status(400).json({
      success: false,
      error: {
        message: error.message || "Failed to process document",
      },
    });
  }
}

/**
 * Upload and encode image
 */
export async function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          message: "No file provided",
        },
      });
    }

    const { mimetype, originalname, size, buffer } = req.file;
    const base64Data = convertImageToBase64(buffer);
    const mimeType = getImageMimeType(originalname);

    res.json({
      success: true,
      data: {
        filename: originalname,
        mimeType: mimeType,
        size: size,
        base64: base64Data,
      },
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(400).json({
      success: false,
      error: {
        message: error.message || "Failed to process image",
      },
    });
  }
}

/**
 * Reset/create new chat session
 */
export async function resetChat(req, res) {
  try {
    const newSessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const session = {
      id: newSessionId,
      messages: [],
      documentContent: null,
      createdAt: new Date(),
    };

    chatSessions.set(newSessionId, session);

    res.json({
      success: true,
      data: {
        sessionId: newSessionId,
        message: "New chat session created",
      },
    });
  } catch (error) {
    console.error("Reset error:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to reset chat",
      },
    });
  }
}

/**
 * Get chat session info
 */
export async function getChatSession(req, res) {
  try {
    const { sessionId } = req.params;
    const session = chatSessions.get(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Chat session not found",
        },
      });
    }

    res.json({
      success: true,
      data: {
        id: session.id,
        messageCount: session.messages.length,
        hasDocument: !!session.documentContent,
        createdAt: session.createdAt,
      },
    });
  } catch (error) {
    console.error("Session retrieval error:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to retrieve session",
      },
    });
  }
}

export default {
  handleChatMessage,
  uploadDocument,
  uploadImage,
  resetChat,
  getChatSession,
};

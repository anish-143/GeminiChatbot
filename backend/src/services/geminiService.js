import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

function createGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Please add it to backend/.env or set it in your environment."
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

/**
 * Send a message to Gemini with context
 * @param {string} userMessage - User's text message
 * @param {Array} conversationHistory - Array of previous messages
 * @param {string} documentContent - Optional extracted document text
 * @param {Object} imageData - Optional image data { mimeType, data }
 */
export async function sendMessageToGemini(
  userMessage,
  conversationHistory = [],
  documentContent = null,
  imageData = null
) {
  try {
    // Build the content array for multimodal support
    const content = [];

    // Add document context if available
    if (documentContent) {
      content.push({
        text: `You are a helpful AI assistant. The user has uploaded a document. Here is its content:\n\n${documentContent}\n\n`,
      });
    }

    // Add image if provided
    if (imageData) {
      content.push({
        inlineData: {
          mimeType: imageData.mimeType,
          data: imageData.data,
        },
      });
    }

    // Add user message
    content.push({
      text: userMessage,
    });

    // Prepare messages for context
    const messages = [];

    // Add conversation history
    for (const msg of conversationHistory) {
      if (msg.role === "user") {
        messages.push({
          role: "user",
          parts: [{ text: msg.content }],
        });
      } else {
        messages.push({
          role: "model",
          parts: [{ text: msg.content }],
        });
      }
    }

    // Add current user message
    messages.push({
      role: "user",
      parts: content,
    });

    const model = createGeminiModel();

    // Start a chat session
    const chat = model.startChat({
      history: messages.slice(0, -1), // All messages except the last one
    });

    // Send the current message and get response
    const result = await chat.sendMessage(content);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(`Failed to get response from Gemini: ${error.message}`);
  }
}

/**
 * Simple text-only chat
 */
export async function sendSimpleMessage(userMessage, conversationHistory = []) {
  return sendMessageToGemini(userMessage, conversationHistory, null, null);
}

export default {
  sendMessageToGemini,
  sendSimpleMessage,
};

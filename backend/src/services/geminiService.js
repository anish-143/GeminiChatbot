import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing.");
}

const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Available fallback models
 */
const MODEL_FALLBACKS = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-1.5-flash-latest",
];

/**
 * Delay helper
 */
function sleep(ms) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

/**
 * Try generating with fallback models
 */
async function generateWithFallback(
  messages,
  content
) {
  let lastError = null;

  for (const modelName of MODEL_FALLBACKS) {
    try {
      console.log(`Using model: ${modelName}`);

      const model =
        genAI.getGenerativeModel({
          model: modelName,
        });

      const chat = model.startChat({
        history: messages.slice(0, -1),
      });

      /**
       * Retry per model
       */
      for (let retry = 0; retry < 3; retry++) {
        try {
          const result =
            await chat.sendMessage(content);

          return result.response.text();
        } catch (error) {
          lastError = error;

          console.error(
            `Retry ${retry + 1} failed for ${modelName}`,
            error.message
          );

          const retryable =
            error.message.includes("503") ||
            error.message.includes("429") ||
            error.message.includes("overloaded") ||
            error.message.includes("high demand");

          if (
            retryable &&
            retry < 2
          ) {
            await sleep(2000 * (retry + 1));
            continue;
          }

          /**
           * Try next fallback model
           */
          break;
        }
      }
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

/**
 * Main Gemini function
 */
export async function sendMessageToGemini(
  userMessage,
  conversationHistory = [],
  documentContent = null,
  imageData = null
) {
  try {
    const content = [];

    /**
     * Document context
     */
    if (documentContent) {
      content.push({
        text: `You are a helpful AI assistant.

Document content:
${documentContent}`,
      });
    }

    /**
     * Image support
     */
    if (imageData) {
      content.push({
        inlineData: {
          mimeType: imageData.mimeType,
          data: imageData.data,
        },
      });
    }

    /**
     * User message
     */
    content.push({
      text: userMessage,
    });

    /**
     * Conversation history
     */
    const messages = [];

    for (const msg of conversationHistory) {
      messages.push({
        role:
          msg.role === "user"
            ? "user"
            : "model",
        parts: [
          {
            text: msg.content,
          },
        ],
      });
    }

    messages.push({
      role: "user",
      parts: content,
    });

    /**
     * Generate response
     */
    const text =
      await generateWithFallback(
        messages,
        content
      );

    return text;
  } catch (error) {
    console.error(
      "Gemini API Error:",
      error
    );

    if (error.message.includes("429")) {
      throw new Error(
        "AI quota exceeded. Please try again later."
      );
    }

    if (error.message.includes("503")) {
      throw new Error(
        "Gemini servers are busy. Please retry in a few seconds."
      );
    }

    throw new Error(
      "Failed to generate AI response."
    );
  }
}

/**
 * Simple text chat
 */
export async function sendSimpleMessage(
  userMessage,
  conversationHistory = []
) {
  return sendMessageToGemini(
    userMessage,
    conversationHistory,
    null,
    null
  );
}

export default {
  sendMessageToGemini,
  sendSimpleMessage,
};

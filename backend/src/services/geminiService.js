import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

/**
 * Gemini client
 */
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured"
    );
  }

  return new GoogleGenerativeAI(apiKey);
};

/**
 * Trim very large documents
 */
const trimDocumentText = (documentText) => {
  if (!documentText) return "";

  const limit = Number(
    process.env.DOCUMENT_TEXT_LIMIT || 12000
  );

  if (!Number.isFinite(limit) || limit <= 0) {
    return documentText;
  }

  return documentText.length > limit
    ? `${documentText.slice(
        0,
        limit
      )}\n\n[Document truncated]`
    : documentText;
};

/**
 * Build optimized prompt
 */
const buildPrompt = ({
  message,
  chatHistory,
  documentText,
  hasImage,
}) => {
  // Keep only recent messages
  const recentHistory = chatHistory.slice(-10);

  const historyText = recentHistory
    .map(
      (entry) =>
        `${entry.role === "user"
          ? "User"
          : "Assistant"}: ${entry.content}`
    )
    .join("\n");

  const docSection = documentText
    ? `\n\nDocument Context:\n${documentText}`
    : "";

  const hasDocument = Boolean(documentText);

  const normalizedMessage =
    message.toLowerCase();

  const visualKeywords = [
    "image",
    "diagram",
    "figure",
    "chart",
    "graph",
    "visual",
    "picture",
    "photo",
    "screenshot",
    "table",
  ];

  const docKeywords = [
    "summary",
    "summarize",
    "explain",
    "theory",
    "paper",
    "document",
    "method",
    "algorithm",
    "conclusion",
    "abstract",
    "results",
  ];

  const asksVisual = visualKeywords.some(
    (keyword) =>
      normalizedMessage.includes(keyword)
  );

  const asksDoc = docKeywords.some(
    (keyword) =>
      normalizedMessage.includes(keyword)
  );

  let contextInstruction =
    "Answer normally.";

  if (hasImage && !hasDocument) {
    contextInstruction =
      "Answer ONLY using the uploaded image.";
  } else if (hasDocument && !hasImage) {
    contextInstruction =
      "Answer ONLY using the uploaded document.";
  } else if (hasDocument && hasImage) {
    contextInstruction = `You have BOTH a document and an image.

- If the question is about diagram, figure, or visual → use IMAGE
- If the question is about explanation, summary, or theory → use DOCUMENT
- If needed, combine both carefully
- Do NOT hallucinate`;

    if (asksVisual && !asksDoc) {
      contextInstruction +=
        "\n\nThe user intent is visual. Use IMAGE only.";
    } else if (asksDoc && !asksVisual) {
      contextInstruction +=
        "\n\nThe user intent is document-based. Use DOCUMENT only.";
    }
  }

  const missingContextNotice =
    !hasDocument && !hasImage
      ? "\n\nIf the user asks about uploaded files or images and none were provided, respond exactly: No files have been uploaded yet."
      : "";

  const fallbackInstruction =
    "If the provided content does not contain the answer, respond exactly: The provided content does not contain this information.";

  return `You are a precise AI assistant.

Keep answers concise and grounded in provided context.

${contextInstruction}

${fallbackInstruction}

${missingContextNotice}

Conversation:
${historyText}

USER QUESTION:
${message}

${docSection}`;
};

/**
 * Delay helper
 */
const sleep = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

/**
 * Generate Gemini response
 */
const generateGeminiResponse = async ({
  message,
  chatHistory,
  documentText,
  image,
}) => {
  const client = getGeminiClient();

  const MODELS = [
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash",
  ];

  const trimmedDocument =
    trimDocumentText(documentText);

  const prompt = buildPrompt({
    message,
    chatHistory,
    documentText: trimmedDocument,
    hasImage: Boolean(image),
  });

  const parts = [{ text: prompt }];

  /**
   * Add image if exists
   */
  if (image) {
    parts.push({
      inlineData: {
        data: image.buffer.toString(
          "base64"
        ),
        mimeType: image.mimetype,
      },
    });
  }

  let lastError = null;

  /**
   * Try fallback models
   */
  for (const modelName of MODELS) {
    try {
      console.log(
        `Using Gemini model: ${modelName}`
      );

      const model =
        client.getGenerativeModel({
          model: modelName,
        });

      /**
       * Retry overloaded requests
       */
      for (
        let retry = 0;
        retry < 3;
        retry++
      ) {
        try {
          const result =
            await model.generateContent({
              contents: [
                {
                  role: "user",
                  parts,
                },
              ],
            });

          const response =
            await result.response;

          return response.text();
        } catch (error) {
          lastError = error;

          console.error(
            `Retry ${retry + 1} failed for ${modelName}:`,
            error.message
          );

          const retryable =
            error.message.includes(
              "503"
            ) ||
            error.message.includes(
              "429"
            ) ||
            error.message.includes(
              "overloaded"
            ) ||
            error.message.includes(
              "high demand"
            );

          if (
            retryable &&
            retry < 2
          ) {
            await sleep(
              2000 * (retry + 1)
            );

            continue;
          }

          break;
        }
      }
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(
    lastError?.message ||
      "Gemini failed to respond."
  );
};

/**
 * Main exported function
 */
export async function sendMessageToGemini(
  userMessage,
  conversationHistory = [],
  documentContent = null,
  imageData = null
) {
  try {
    return await generateGeminiResponse({
      message: userMessage,
      chatHistory: conversationHistory,
      documentText: documentContent,
      image: imageData,
    });
  } catch (error) {
    console.error(
      "Gemini API Error:",
      error.message,
      error.stack
    );

    if (
      error.message.includes("429")
    ) {
      throw new Error(
        "AI quota exceeded. Please try again later."
      );
    }

    if (
      error.message.includes("503")
    ) {
      throw new Error(
        "Gemini servers are busy right now. Please retry in a few seconds."
      );
    }

    throw new Error(
      "Failed to generate AI response."
    );
  }
}

/**
 * Simple text-only chat
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

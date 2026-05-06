import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured"
    );
  }

  return new GoogleGenerativeAI(apiKey);
};

const trimDocumentText = (
  documentText
) => {
  if (!documentText) return "";

  const limit = Number(
    process.env.DOCUMENT_TEXT_LIMIT ||
      12000
  );

  if (
    !Number.isFinite(limit) ||
    limit <= 0
  ) {
    return documentText;
  }

  return documentText.length > limit
    ? `${documentText.slice(
        0,
        limit
      )}\n\n[Document truncated]`
    : documentText;
};

const buildPrompt = ({
  message,
  chatHistory,
  documentText,
  hasImage,
}) => {
  // Keep recent history only
  const recentHistory =
    chatHistory.slice(-10);

  const historyText =
    recentHistory
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

  const hasDocument =
    Boolean(documentText);

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

  const asksVisual =
    visualKeywords.some((keyword) =>
      normalizedMessage.includes(
        keyword
      )
    );

  const asksDoc =
    docKeywords.some((keyword) =>
      normalizedMessage.includes(
        keyword
      )
    );

  let contextInstruction =
    "Answer normally.";

  if (hasImage && !hasDocument) {
    contextInstruction =
      "Answer ONLY using the uploaded image.";
  } else if (
    hasDocument &&
    !hasImage
  ) {
    contextInstruction =
      "Answer ONLY using the uploaded document.";
  } else if (
    hasDocument &&
    hasImage
  ) {
    contextInstruction = `You have BOTH a document and an image.

- If the question is about diagram, figure, or visual → use IMAGE
- If the question is about explanation, summary, or theory → use DOCUMENT
- If needed, combine both carefully
- Do NOT hallucinate`;

    if (asksVisual && !asksDoc) {
      contextInstruction +=
        "\n\nThe user intent is visual. Use IMAGE only.";
    } else if (
      asksDoc &&
      !asksVisual
    ) {
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

  return `You are a precise assistant.

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

const generateGeminiResponse =
  async ({
    message,
    chatHistory,
    documentText,
    image,
  }) => {
    const client =
      getGeminiClient();

    const primaryModel =
      process.env.GEMINI_MODEL ||
      "gemini-2.0-flash-lite";

    const fallbackModel =
      process.env
        .GEMINI_FALLBACK_MODEL ||
      "gemini-2.0-flash";

    const trimmedDocument =
      trimDocumentText(
        documentText
      );

    const prompt = buildPrompt({
      message,
      chatHistory,
      documentText:
        trimmedDocument,
      hasImage: Boolean(image),
    });

    const parts = [
      {
        text: prompt,
      },
    ];

    if (image) {
      parts.push({
        inlineData: {
          data: image.buffer.toString(
            "base64"
          ),
          mimeType:
            image.mimetype,
        },
      });
    }

    const runModel = async (
      modelName
    ) => {
      const model =
        client.getGenerativeModel({
          model: modelName,
        });

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
    };

    try {
      return await runModel(
        primaryModel
      );
    } catch (error) {
      console.error(
        "Primary Gemini Error:",
        error.message
      );

      const messageText = String(
        error?.message || ""
      ).toLowerCase();

      const retryable =
        messageText.includes(
          "503"
        ) ||
        messageText.includes(
          "overloaded"
        ) ||
        messageText.includes(
          "high demand"
        );

      if (
        retryable &&
        fallbackModel !==
          primaryModel
      ) {
        try {
          return await runModel(
            fallbackModel
          );
        } catch (fallbackError) {
          console.error(
            "Fallback Gemini Error:",
            fallbackError.message
          );

          throw new Error(
            "Gemini servers are busy. Please try again in a few seconds."
          );
        }
      }

      if (
        messageText.includes("429")
      ) {
        throw new Error(
          "AI quota exceeded. Please try again later."
        );
      }

      throw new Error(
        error?.message ||
          "Gemini failed to respond."
      );
    }
  };

export async function sendMessageToGemini(
  userMessage,
  conversationHistory = [],
  documentContent = null,
  imageData = null
) {
  return generateGeminiResponse({
    message: userMessage,
    chatHistory:
      conversationHistory,
    documentText:
      documentContent,
    image: imageData,
  });
}

export async function sendSimpleMessage(
  userMessage,
  conversationHistory = []
) {
  return sendMessageToGemini(
    userMessage,
    conversationHistory
  );
}

export default {
  sendMessageToGemini,
  sendSimpleMessage,
};

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Send a chat message to the AI
 */
export async function sendChatMessage(
  message,
  sessionId,
  chatHistory,
  documentContent = null,
  imageData = null
) {
  try {
    const response = await apiClient.post("/chat", {
      message,
      sessionId,
      chatHistory,
      documentContent,
      imageData,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

/**
 * Upload a document (PDF or TXT)
 */
export async function uploadDocument(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post("/upload/document", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
}

/**
 * Upload an image (PNG or JPG)
 */
export async function uploadImage(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

/**
 * Reset chat session
 */
export async function resetChatSession() {
  try {
    const response = await apiClient.post("/reset");
    return response.data.data;
  } catch (error) {
    console.error("Error resetting chat:", error);
    throw error;
  }
}

/**
 * Get chat session info
 */
export async function getChatSessionInfo(sessionId) {
  try {
    const response = await apiClient.get(`/session/${sessionId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error getting session info:", error);
    throw error;
  }
}

export default {
  sendChatMessage,
  uploadDocument,
  uploadImage,
  resetChatSession,
  getChatSessionInfo,
};

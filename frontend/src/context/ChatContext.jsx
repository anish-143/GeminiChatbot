import { createContext, useContext, useState, useCallback } from "react";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [documentContent, setDocumentContent] = useState(null);
  const [documentName, setDocumentName] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((role, content, timestamp = new Date()) => {
    setMessages((prev) => [
      ...prev,
      { role, content, timestamp, id: Date.now() },
    ]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const setDocument = useCallback((content, name) => {
    setDocumentContent(content);
    setDocumentName(name);
  }, []);

  const clearDocument = useCallback(() => {
    setDocumentContent(null);
    setDocumentName(null);
  }, []);

  const setImage = useCallback((data, name) => {
    setImageData(data);
    setImageName(name);
  }, []);

  const clearImage = useCallback(() => {
    setImageData(null);
    setImageName(null);
  }, []);

  const resetChat = useCallback(() => {
    setMessages([]);
    setDocumentContent(null);
    setDocumentName(null);
    setImageData(null);
    setImageName(null);
    setSessionId(null);
  }, []);

  const value = {
    // State
    sessionId,
    messages,
    documentContent,
    documentName,
    imageData,
    imageName,
    isLoading,

    // Session management
    setSessionId,
    setIsLoading,

    // Message management
    addMessage,
    clearMessages,

    // Document management
    setDocument,
    clearDocument,

    // Image management
    setImage,
    clearImage,

    // Chat management
    resetChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
}

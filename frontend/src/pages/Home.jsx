import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Plus, Copy, Check } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { ChatWindow } from "../components/ChatWindow";
import { ChatInput } from "../components/ChatInput";
import { UploadButtons } from "../components/UploadButtons";
import { Sidebar } from "../components/Sidebar";
import { useChat } from "../context/ChatContext";
import { useToast } from "../hooks/useToast";
import { sendChatMessage, resetChatSession } from "../services/api";

export function Home() {
  const {
    sessionId,
    messages,
    documentContent,
    imageData,
    isLoading,
    setSessionId,
    setIsLoading,
    addMessage,
    resetChat,
  } = useChat();

  const { showError, showSuccess } = useToast();
  const [copied, setCopied] = useState(false);

  // Initialize session on mount
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const data = await resetChatSession();
        setSessionId(data.sessionId);
      } catch (error) {
        console.error("Failed to initialize session:", error);
        showError("Failed to initialize chat session");
      }
    };

    if (!sessionId) {
      initializeSession();
    }
  }, []);

  const handleSendMessage = async (message) => {
    if (!sessionId) {
      showError("Chat session not initialized");
      return;
    }

    if (!message.trim()) {
      return;
    }

    // Add user message to UI
    addMessage("user", message);

    try {
      setIsLoading(true);

      // Prepare chat history
      const chatHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Send to API
      const response = await sendChatMessage(
        message,
        sessionId,
        chatHistory,
        documentContent,
        imageData
      );

      // Add AI response to UI
      addMessage("assistant", response.response);
      showSuccess("Response received!");
    } catch (error) {
      console.error("Error sending message:", error);
      showError(
        error.response?.data?.error?.message || "Failed to send message"
      );
      // Remove the user message if the API call failed
      // In a real app, we might want to retry
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      resetChat();
      const data = await resetChatSession();
      setSessionId(data.sessionId);
      showSuccess("New chat started!");
    } catch (error) {
      console.error("Error creating new chat:", error);
      showError("Failed to create new chat");
    }
  };

  const handleCopyMessages = () => {
    const text = messages
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showSuccess("Chat copied to clipboard!");
  };

  return (
    <div className="flex h-screen bg-slate-900">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <Sidebar onNewChat={handleNewChat} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col gap-4 p-4 md:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold">
              G
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Gemini Chatbot</h1>
              <p className="text-sm text-slate-400">Powered by Google Gemini AI</p>
            </div>
          </div>

          {/* Mobile New Chat Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNewChat}
            className="md:hidden flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium"
          >
            <Plus size={18} />
          </motion.button>
        </motion.div>

        {/* Chat Window */}
        <ChatWindow messages={messages} isLoading={isLoading} />

        {/* Upload Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-3 sm:flex-row sm:gap-2"
        >
          <div className="flex-1">
            <UploadButtons />
          </div>

          {messages.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopyMessages}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              <span className="hidden sm:inline text-sm font-medium">
                {copied ? "Copied" : "Copy"}
              </span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNewChat}
            className="hidden sm:flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
          >
            <Plus size={18} />
            <span className="text-sm font-medium">New Chat</span>
          </motion.button>
        </motion.div>

        {/* Chat Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </motion.div>
      </div>
    </div>
  );
}

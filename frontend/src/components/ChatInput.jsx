import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useChat } from "../context/ChatContext";

export function ChatInput({ onSendMessage, isLoading }) {
  const [message, setMessage] = useState("");
  const { messages } = useChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (Ctrl+Enter to send)"
            disabled={isLoading}
            rows="3"
            className="w-full px-4 py-3 bg-slate-700 text-white placeholder-slate-400 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed max-h-24"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!message.trim() || isLoading}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed h-full"
        >
          <Send size={18} />
          <span className="hidden sm:inline">Send</span>
        </motion.button>
      </div>
      <p className="text-xs text-slate-400 mt-2">
        {messages.length} messages in this chat
      </p>
    </form>
  );
}

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageBubble } from "./MessageBubble";

export function ChatWindow({ messages, isLoading }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-800 to-slate-900 p-6 space-y-4 rounded-lg">
      {messages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-full flex flex-col items-center justify-center text-slate-400"
        >
          <div className="text-center">
            <div className="text-5xl mb-4">💬</div>
            <h2 className="text-2xl font-semibold mb-2">Start a conversation</h2>
            <p className="text-sm">
              Upload documents or images to get started with Gemini AI
            </p>
          </div>
        </motion.div>
      ) : (
        <>
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
            />
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-center gap-2 bg-slate-700 px-4 py-3 rounded-lg rounded-bl-none">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: 0,
                    }}
                    className="w-2 h-2 bg-blue-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: 0.2,
                    }}
                    className="w-2 h-2 bg-blue-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: 0.4,
                    }}
                    className="w-2 h-2 bg-blue-400 rounded-full"
                  />
                </div>
                <span className="text-sm text-slate-300 ml-2">Thinking...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}

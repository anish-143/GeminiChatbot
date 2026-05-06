import React from "react";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";

export function Sidebar({ onNewChat }) {
  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="hidden md:flex flex-col w-64 bg-slate-800 border-r border-slate-700 p-4 gap-4"
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNewChat}
        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-medium transition-all"
      >
        <Plus size={20} />
        <span>New Chat</span>
      </motion.button>

      <div className="flex-1 overflow-y-auto">
        <div className="text-slate-400 text-sm text-center py-8">
          <Trash2 size={32} className="mx-auto mb-3 opacity-50" />
          <p>No chat history yet</p>
          <p className="text-xs mt-2">Future feature: Multiple chats</p>
        </div>
      </div>

      <div className="text-xs text-slate-500 text-center py-3 border-t border-slate-700">
        <p>Powered by Google Gemini</p>
      </div>
    </motion.aside>
  );
}

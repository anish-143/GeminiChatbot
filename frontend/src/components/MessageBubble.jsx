import React from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export function MessageBubble({ role, content, timestamp }) {
  const [copied, setCopied] = useState(false);
  const isUser = role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
          isUser
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
            : "bg-slate-700 text-slate-100 rounded-bl-none"
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed">{content}</p>
        ) : (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              components={{
                code: ({ node, inline, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <div className="relative">
                      <SyntaxHighlighter
                        style={atomOneDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                      <button
                        onClick={() =>
                          handleCopy(String(children).replace(/\n$/, ""))
                        }
                        className="absolute top-2 right-2 bg-slate-600 hover:bg-slate-500 p-2 rounded transition-colors"
                      >
                        {copied ? (
                          <Check size={16} />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                  ) : (
                    <code className="bg-slate-600 px-2 py-1 rounded text-sm">
                      {children}
                    </code>
                  );
                },
                ul: ({ node, children }) => (
                  <ul className="list-disc list-inside space-y-1">{children}</ul>
                ),
                ol: ({ node, children }) => (
                  <ol className="list-decimal list-inside space-y-1">
                    {children}
                  </ol>
                ),
                p: ({ node, children }) => (
                  <p className="text-sm leading-relaxed mb-2">{children}</p>
                ),
                h1: ({ node, children }) => (
                  <h1 className="text-lg font-bold mb-2">{children}</h1>
                ),
                h2: ({ node, children }) => (
                  <h2 className="text-base font-bold mb-2">{children}</h2>
                ),
                h3: ({ node, children }) => (
                  <h3 className="text-sm font-bold mb-1">{children}</h3>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
        {timestamp && (
          <p className="text-xs mt-2 opacity-70">
            {new Date(timestamp).toLocaleTimeString()}
          </p>
        )}
      </div>
    </motion.div>
  );
}

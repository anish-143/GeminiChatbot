import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, File, X } from "lucide-react";
import { useChat } from "../context/ChatContext";
import { uploadDocument, uploadImage } from "../services/api";
import { useToast } from "../hooks/useToast";

export function UploadButtons() {
  const { documentName, imageName, setDocument, setImage, clearDocument, clearImage } = useChat();
  const documentInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleDocumentUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!["application/pdf", "text/plain"].includes(file.type)) {
      showError("Only PDF and TXT files are supported");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showError("File size must be less than 10MB");
      return;
    }

    try {
      setUploading(true);
      const data = await uploadDocument(file);
      setDocument(data.content, file.name);
      showSuccess(`Document uploaded: ${file.name}`);
    } catch (error) {
      console.error("Upload error:", error);
      showError(error.response?.data?.error?.message || "Failed to upload document");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      showError("Only PNG and JPG images are supported");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showError("File size must be less than 10MB");
      return;
    }

    try {
      setUploading(true);
      const data = await uploadImage(file);
      setImage(
        {
          mimeType: data.mimeType,
          data: data.base64,
        },
        file.name
      );
      showSuccess(`Image uploaded: ${file.name}`);
    } catch (error) {
      console.error("Upload error:", error);
      showError(error.response?.data?.error?.message || "Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Document Upload */}
      <div className="relative">
        <input
          ref={documentInputRef}
          type="file"
          accept=".pdf,.txt"
          onChange={handleDocumentUpload}
          disabled={uploading}
          className="hidden"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => documentInputRef.current?.click()}
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload size={18} />
          <span className="text-sm font-medium">Upload Document (PDF/TXT)</span>
        </motion.button>
        {documentName && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 flex items-center justify-between bg-slate-700 p-2 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <File size={16} className="text-blue-400" />
              <span className="text-sm text-slate-200 truncate">{documentName}</span>
            </div>
            <button
              onClick={clearDocument}
              className="text-slate-400 hover:text-red-400 transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </div>

      {/* Image Upload */}
      <div className="relative">
        <input
          ref={imageInputRef}
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleImageUpload}
          disabled={uploading}
          className="hidden"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => imageInputRef.current?.click()}
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload size={18} />
          <span className="text-sm font-medium">Upload Image (PNG/JPG)</span>
        </motion.button>
        {imageName && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 flex items-center justify-between bg-slate-700 p-2 rounded-lg"
          >
            <div className="flex items-center gap-2 flex-1">
              <div className="w-6 h-6 bg-blue-400 rounded flex items-center justify-center text-xs text-white">
                IMG
              </div>
              <span className="text-sm text-slate-200 truncate">{imageName}</span>
            </div>
            <button
              onClick={clearImage}
              className="text-slate-400 hover:text-red-400 transition-colors ml-2"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

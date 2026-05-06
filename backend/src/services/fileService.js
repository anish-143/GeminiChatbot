import pdfParse from "pdf-parse";
import fs from "fs";

/**
 * Extract text from PDF file
 * @param {Buffer} fileBuffer - PDF file buffer
 */
export async function extractTextFromPDF(fileBuffer) {
  try {
    const pdfData = await pdfParse(fileBuffer);
    return pdfData.text;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error(`Failed to extract PDF content: ${error.message}`);
  }
}

/**
 * Extract text from TXT file
 * @param {Buffer} fileBuffer - TXT file buffer
 */
export async function extractTextFromTXT(fileBuffer) {
  try {
    return fileBuffer.toString("utf-8");
  } catch (error) {
    console.error("Error reading TXT file:", error);
    throw new Error(`Failed to extract TXT content: ${error.message}`);
  }
}

/**
 * Extract text based on file type
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} mimeType - MIME type of the file
 */
export async function extractFileContent(fileBuffer, mimeType) {
  if (mimeType === "application/pdf") {
    return extractTextFromPDF(fileBuffer);
  } else if (mimeType === "text/plain") {
    return extractTextFromTXT(fileBuffer);
  } else {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }
}

/**
 * Convert image file to base64
 * @param {Buffer} fileBuffer - Image file buffer
 */
export function convertImageToBase64(fileBuffer) {
  return fileBuffer.toString("base64");
}

/**
 * Get MIME type for image
 * @param {string} filename - File name
 */
export function getImageMimeType(filename) {
  const ext = filename.toLowerCase().split(".").pop();
  const mimeTypes = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
  };
  return mimeTypes[ext] || "image/png";
}

export default {
  extractTextFromPDF,
  extractTextFromTXT,
  extractFileContent,
  convertImageToBase64,
  getImageMimeType,
};

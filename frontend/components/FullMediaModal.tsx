"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MediaItem } from "@/types";
import { removeMedia } from "@/services/api";
import { useUser } from "@/context/UserContext";
import { usePortfolio } from "@/context/PortfolioContext";
import { useState } from "react";

interface FullMediaModalProps {
  item: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function FullMediaModal({
  item,
  isOpen,
  onClose,
}: FullMediaModalProps) {
  const { userId } = useUser();
  const { dispatch } = usePortfolio();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!item) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await removeMedia(userId, item.id);
      dispatch({ type: "REMOVE_ITEM", payload: { id: item.id } });
      onClose();
    } catch (error) {
      console.error("Failed to delete media:", error);
      alert("Failed to delete media. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40 min-h-screen"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-[95%] max-w-6xl bg-white rounded-2xl shadow-2xl border border-[#E8E0D8] overflow-hidden max-h-[90vh] flex flex-col"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="bg-gradient-to-r from-[#E8D5C4] to-[#D8B4A0] px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-[#2D2A24]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#2D2A24]">
                      {item.title}
                    </h2>
                    <p className="text-[#6B5F5A] text-sm">Viewing full media</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-[#2D2A24]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* content */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* media */}
              <div className="flex-1 bg-[#FAF8F5] flex items-center justify-center p-4 lg:p-6">
                <motion.div
                  className="w-full h-full flex items-center justify-center"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  {item.media_type === "image" ? (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="object-contain rounded-lg shadow-lg"
                      style={{
                        minWidth: "60%",
                        minHeight: "45%",
                        maxWidth: "90%",
                        maxHeight: "90%",
                      }}
                    />
                  ) : (
                    <video
                      src={item.url}
                      controls
                      className="object-contain rounded-lg shadow-lg"
                      style={{
                        minWidth: "300px",
                        minHeight: "200px",
                        maxWidth: "80%",
                        maxHeight: "80vh",
                      }}
                    />
                  )}
                </motion.div>
              </div>

              {/* details */}
              <div className="w-full lg:w-96 bg-white p-8 border-l border-[#E8E0D8] overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="space-y-6"
                >
                  {/* title */}
                  <div>
                    <h3 className="text-2xl font-bold text-[#2D2A24] mb-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#E8D5C4] text-[#2D2A24]">
                        {item.category}
                      </span>
                      <span className="text-xs text-[#9A8F8A]">
                        {item.media_type === "image" ? "📷" : "🎥"}{" "}
                        {item.media_type}
                      </span>
                    </div>
                  </div>

                  {/* desc */}
                  <div>
                    <h4 className="text-sm font-semibold text-[#2D2A24] mb-3 uppercase tracking-wide">
                      Description
                    </h4>
                    <p className="text-[#6B5F5A] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* file info */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-[#2D2A24] mb-3 uppercase tracking-wide">
                        File Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#9A8F8A]">Filename:</span>
                          <span className="text-[#2D2A24] font-medium">
                            {item.filename}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#9A8F8A]">Type:</span>
                          <span className="text-[#2D2A24] font-medium capitalize">
                            {item.media_type}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#9A8F8A]">Category:</span>
                          <span className="text-[#2D2A24] font-medium">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* actions */}
                  <div className="pt-4 border-t border-[#E8E0D8]">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => window.open(item.url, "_blank")}
                        className="flex-1 px-4 py-2 bg-[#E8D5C4] hover:bg-[#D4C4B7] text-[#2D2A24] rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        <span>Open Full Size</span>
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.url);
                        }}
                        className="px-4 py-2 bg-[#F5F1EB] hover:bg-[#E8E0D8] text-[#6B5F5A] rounded-lg font-medium transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors flex items-center justify-center"
                      >
                        {isDeleting ? (
                          <svg
                            className="w-4 h-4 animate-spin"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

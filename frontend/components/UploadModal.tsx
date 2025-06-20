"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { uploadFile, savePortfolio } from "@/services/api";
import { MediaItem, Category } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@/context/UserContext";

export default function UploadModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = usePortfolio();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { userId } = useUser();

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadFile(file);

      // use custom category if 'other' is selected and custom category is typed in
      const finalCategory =
        category === Category.OTHER && customCategory.trim()
          ? customCategory.trim()
          : category;

      const newItem: MediaItem = {
        id: uuidv4(),
        filename: res.filename,
        media_type: res.media_type,
        title,
        description,
        category: finalCategory,
        url: res.url,
      };

      dispatch({ type: "ADD_ITEM", payload: newItem });
      await savePortfolio(userId, [...state.items, newItem]);
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // clean up preview url when done
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (selected) {
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    if (e.target.value !== Category.OTHER) {
      setCustomCategory("");
    }
  };

  const isFormValid =
    file &&
    title.trim() &&
    description.trim() &&
    category &&
    (category !== Category.OTHER || customCategory.trim());

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-[95%] max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E8E0D8] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* header */}
          <div className="bg-gradient-to-r from-[#E8D5C4] to-[#D8B4A0] px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
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
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#2D2A24]">
                    Upload New Media
                  </h2>
                  <p className="text-[#6B5F5A] text-sm">
                    Add a new piece to your portfolio
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                data-testid="close-modal"
                className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-[#2D2A24]"
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
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* left column - form inputs */}
              <div className="space-y-6">
                {/* file upload */}
                <div>
                  <label className="block text-sm font-medium text-[#2D2A24] mb-3">
                    Choose File
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#E8E0D8] rounded-xl bg-[#FAF8F5] hover:bg-[#F5F1EB] hover:border-[#D8B4A0] transition-all cursor-pointer"
                    >
                      <svg
                        className="w-8 h-8 text-[#9A8F8A] mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span className="text-sm text-[#6B5F5A]">
                        {file ? file.name : "Click to select image or video"}
                      </span>
                      <span className="text-xs text-[#9A8F8A] mt-1">
                        Supports: JPG, PNG, GIF, WEBP, MP4, MOV
                      </span>
                    </label>
                  </div>
                </div>

                {/* form fields */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-[#2D2A24] mb-2">
                      Title *
                    </label>
                    <input
                      id="title"
                      type="text"
                      placeholder="Enter a descriptive title"
                      className="w-full px-4 py-3 border border-[#E8E0D8] rounded-lg bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#D8B4A0] focus:border-transparent transition-all placeholder-[#9A8F8A]"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-[#2D2A24] mb-2">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      placeholder="Describe your work..."
                      className="w-full px-4 py-3 border border-[#E8E0D8] rounded-lg bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#D8B4A0] focus:border-transparent transition-all placeholder-[#9A8F8A] resize-none"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-[#2D2A24] mb-2">
                      Category *
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        value={category}
                        onChange={handleCategoryChange}
                        className="w-full px-4 py-3 border border-[#E8E0D8] rounded-lg bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#D8B4A0] focus:border-transparent transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>
                          Select a category
                        </option>
                        {Object.values(Category).map((cat) => (
                          <option key={cat} value={cat} className="py-2">
                            {cat}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-[#9A8F8A]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* custom category */}
                  <AnimatePresence>
                    {category === Category.OTHER && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <label htmlFor="custom-category" className="block text-sm font-medium text-[#2D2A24] mb-2">
                          Custom Category *
                        </label>
                        <input
                          id="custom-category"
                          type="text"
                          placeholder="Enter your custom category name"
                          className="w-full px-4 py-3 border border-[#E8E0D8] rounded-lg bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#D8B4A0] focus:border-transparent transition-all placeholder-[#9A8F8A]"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                        />
                        <p className="text-xs text-[#9A8F8A] mt-1">
                          Create a custom category for your work
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* right column - preview */}
              <div>
                <label className="block text-sm font-medium text-[#2D2A24] mb-3">
                  Preview
                </label>
                <div className="bg-[#FAF8F5] border border-[#E8E0D8] rounded-xl overflow-hidden flex items-center justify-center">
                  {previewUrl ? (
                    <div className="w-full">
                      {file?.type.startsWith("image/") ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-auto max-h-[400px] object-contain"
                        />
                      ) : (
                        <video
                          src={previewUrl}
                          controls
                          className="w-full h-auto max-h-[400px] object-contain"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 min-h-[300px] flex items-center justify-center">
                      <div>
                        <svg
                          className="w-16 h-16 text-[#E8E0D8] mx-auto mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-[#9A8F8A] text-sm">
                          Preview will appear here
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* cancel / upload */}
            <div className="flex justify-end gap-3 pt-8 border-t border-[#E8E0D8] mt-8">
              <button
                onClick={onClose}
                className="px-6 py-3 text-[#6B5F5A] hover:bg-[#F5F1EB] rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!isFormValid || isUploading}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  !isFormValid || isUploading
                    ? "bg-[#E8E0D8] text-[#9A8F8A] cursor-not-allowed"
                    : "bg-[#E8D5C4] hover:bg-[#D4C4B7] text-[#2D2A24] shadow-sm hover:shadow-md"
                }`}
              >
                {isUploading ? (
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Uploading...</span>
                  </div>
                ) : (
                  "Upload Media"
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

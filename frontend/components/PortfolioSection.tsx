"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MediaItem } from "@/types";
import MediaCard from "./MediaCard";
import FullMediaModal from "./FullMediaModal";

interface PortfolioSectionProps {
  category: string;
  items: MediaItem[];
  isExpanded?: boolean;
  onToggle?: () => void;
}

export default function PortfolioSection({
  category,
  items,
  isExpanded = true,
  onToggle,
}: PortfolioSectionProps) {
  const [isOpen, setIsOpen] = useState(isExpanded);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    onToggle?.();
  };

  const handleCardClick = (item: MediaItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // map category options to emojis
  const getCategoryIcon = (categoryName: string) => {
    const cat = categoryName.toLowerCase();

    if (cat.includes("photo")) return "📷";
    if (cat.includes("video")) return "🎥";
    if (cat.includes("design")) return "🎨";
    if (cat.includes("illustration")) return "✏️";
    if (cat.includes("digital art")) return "🖼️";
    if (cat.includes("animation")) return "🎬";
    if (cat.includes("architecture")) return "🏛️";
    if (cat.includes("fashion")) return "👗";
    if (cat.includes("fine art")) return "🎭";

    return "📁";
  };

  // map category options to different gradient colors
  const getCategoryColor = (categoryName: string) => {
    const cat = categoryName.toLowerCase();

    if (cat.includes("photo") || cat.includes("fine art"))
      return "from-[#E8D5C4] to-[#D8B4A0]";

    if (cat.includes("video") || cat.includes("digital art"))
      return "from-[#D8B4A0] to-[#C4A08C]";

    if (cat.includes("design") || cat.includes("fashion"))
      return "from-[#F5F1EB] to-[#E8D5C4]";

    if (cat.includes("illustration") || cat.includes("animation"))
      return "from-[#E8E0D8] to-[#D4C4B7]";

    return "from-[#F5F1EB] to-[#E8E0D8]";
  };

  return (
    <>
      <div className="mb-8">
        {/* section header */}
        <motion.button
          onClick={handleToggle}
          className={`w-full group relative overflow-hidden rounded-xl border border-[#E8E0D8] bg-gradient-to-r ${getCategoryColor(category)} p-6 text-left transition-all duration-300 hover:shadow-md`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
                {getCategoryIcon(category)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#2D2A24]">{category}</h2>
                <p className="text-sm text-[#6B5F5A]">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium text-[#2D2A24]">
                  {items.length} {items.length === 1 ? "piece" : "pieces"}
                </div>
                <div className="text-xs text-[#6B5F5A]">
                  Click to {isOpen ? "collapse" : "expand"}
                </div>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.div>
            </div>
          </div>
        </motion.button>

        {/* content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <MediaCard
                        item={item}
                        onClick={() => handleCardClick(item)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FullMediaModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

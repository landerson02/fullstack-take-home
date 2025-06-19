"use client";

import { useState } from "react";
import UploadModal from "./UploadModal";

interface HeaderProps {
  title?: string;
}

export default function Header({ title = "Portfolio Viewer" }: HeaderProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E8E0D8] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#E8D5C4] to-[#D8B4A0] rounded-lg flex items-center justify-center shadow-sm">
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
                <h1 className="text-2xl font-bold text-[#2D2A24]">{title}</h1>
                <p className="text-sm text-[#6B5F5A]">
                  Create and manage your creative portfolio
                </p>
              </div>
            </div>

            {/* Upload Button */}
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>Upload New</span>
            </button>
          </div>
        </div>
      </header>

      {showModal && <UploadModal onClose={() => setShowModal(false)} />}
    </>
  );
}


"use client";

import { useState } from "react";
import UploadModal from "./UploadModal";
import ThemeSelector from "./ThemeSelector";
import { useUser } from "@/context/UserContext";

interface HeaderProps {
  title?: string;
}

export default function Header({ title = "Portfolio Viewer" }: HeaderProps) {
  const [showModal, setShowModal] = useState(false);
  const [isEditingUserId, setIsEditingUserId] = useState(false);
  const [tempUserId, setTempUserId] = useState("");
  const { userId, setUserId } = useUser();

  const handleUserIdClick = () => {
    setTempUserId(userId);
    setIsEditingUserId(true);
  };

  const handleUserIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUserId.trim()) {
      setUserId(tempUserId.trim());
    }
    setIsEditingUserId(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsEditingUserId(false);
    }
  };

  return (
    <>
      <header
        className="sticky top-0 z-50 backdrop-blur-md border-b shadow-sm"
        style={{
          backgroundColor: "var(--color-background)",
          borderColor: "var(--color-border)",
          opacity: 0.95,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
                style={{
                  background: `linear-gradient(135deg, var(--color-primary), var(--color-accent))`,
                }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: "var(--color-text-primary)" }}
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
                <h1
                  className="text-2xl font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {title}
                </h1>
                <div
                  className="text-sm flex items-center h-6"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <span>Create and manage your creative portfolio</span>
                  <span className="mx-3 select-none">•</span>
                  {isEditingUserId ? (
                    <form
                      onSubmit={handleUserIdSubmit}
                      className="inline-flex items-center"
                    >
                      <input
                        type="text"
                        value={tempUserId}
                        onChange={(e) => setTempUserId(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleUserIdSubmit}
                        autoFocus
                        className="w-[180px] px-2 py-0.5 text-sm border rounded-md focus:outline-none focus:ring-1"
                        style={{
                          borderColor: "var(--color-primary)",
                          color: "var(--color-text-primary)",
                          backgroundColor: "var(--color-surface)",
                        }}
                        placeholder="Enter portfolio ID"
                      />
                    </form>
                  ) : (
                    <button
                      onClick={handleUserIdClick}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 min-w-[150px] group border"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text-secondary)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--color-secondary)";
                        e.currentTarget.style.borderColor =
                          "var(--color-accent)";
                        e.currentTarget.style.color =
                          "var(--color-text-primary)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--color-surface)";
                        e.currentTarget.style.borderColor =
                          "var(--color-border)";
                        e.currentTarget.style.color =
                          "var(--color-text-secondary)";
                      }}
                    >
                      <span className="text-sm font-medium">
                        Portfolio: {userId}
                      </span>
                      <svg
                        className="w-3.5 h-3.5 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Theme Selector and Upload Button */}
            <div className="flex items-center space-x-3">
              <ThemeSelector />
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
        </div>
      </header>

      {showModal && <UploadModal onClose={() => setShowModal(false)} />}
    </>
  );
}

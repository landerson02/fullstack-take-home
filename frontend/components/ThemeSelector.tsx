"use client";

import { useState } from "react";
import { useTheme, Theme } from "@/context/ThemeContext";

const themes: { value: Theme; name: string; color: string }[] = [
  { value: "beige", name: "Beige", color: "#E8D5C4" },
  { value: "pastel-blue", name: "Pastel Blue", color: "#B8D4E3" },
  { value: "pastel-pink", name: "Pastel Pink", color: "#F4C2C2" },
  { value: "pastel-green", name: "Pastel Green", color: "#C8E6C9" },
  { value: "bright-orange", name: "Bright Orange", color: "#FFB74D" },
];

export default function ThemeSelector() {
  const { theme, setTheme, colorMode, setColorMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const toggleColorMode = () => {
    setColorMode(colorMode === "light" ? "dark" : "light");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-[var(--color-surface)] hover:bg-[var(--color-border)] border border-[var(--color-border)] rounded-lg transition-all duration-200 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
      >
        <div
          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
          style={{
            backgroundColor: themes.find((t) => t.value === theme)?.color,
          }}
        />
        <span className="text-sm font-medium">Theme</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
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
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg z-20 py-2">
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                onClick={() => {
                  setTheme(themeOption.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-[var(--color-border)] transition-colors duration-150 ${
                  theme === themeOption.value
                    ? "bg-[var(--color-primary)] text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-secondary)]"
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: themeOption.color }}
                />
                <span className="text-sm font-medium">{themeOption.name}</span>
                {theme === themeOption.value && (
                  <svg
                    className="w-4 h-4 ml-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}

            <div
              className="border-t my-2"
              style={{ borderColor: "var(--color-border)" }}
            />

            <div className="px-4 py-2">
              <div className="flex items-center justify-between">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Dark Mode
                </span>
                <button
                  onClick={toggleColorMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    colorMode === "dark"
                      ? "bg-[var(--color-primary)]"
                      : "bg-[var(--color-border)]"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      colorMode === "dark" ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


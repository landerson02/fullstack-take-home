"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import { useEffect, useMemo } from "react";
import Header from "@/components/Header";
import PortfolioSection from "@/components/PortfolioSection";
import { loadPortfolio, savePortfolio } from "@/services/api";

const USER_ID = "a";

export default function HomePage() {
  const { state, dispatch } = usePortfolio();

  // load portfolio items on initial render
  useEffect(() => {
    (async () => {
      try {
        const res = await loadPortfolio(USER_ID);
        dispatch({ type: "LOAD_ITEMS", payload: res.items });
      } catch (error) {
        console.error("Error loading portfolio:", error);
      }
    })();
  }, [dispatch]);

  // auto-save portfolio whenever items change
  useEffect(() => {
    if (state.items.length > 0) {
      savePortfolio(USER_ID, state.items).catch(console.error);
    }
  }, [state.items]);

  // group items by category
  const groupedItems = useMemo(() => {
    const groups: { [key: string]: typeof state.items } = {};

    state.items.forEach((item) => {
      const category = item.category || "Uncategorized";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });

    return Object.fromEntries(
      Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)),
    );
  }, [state.items]);

  const totalItems = state.items.length;
  const categoryCount = Object.keys(groupedItems).length;

  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Portfolio Stats */}
        {totalItems > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-[#E8D5C4] to-[#D8B4A0] rounded-xl p-6 border border-[#E8E0D8]">
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
                        // outline of a bar chart
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#2D2A24]">
                      Portfolio Overview
                    </h2>
                    <p className="text-sm text-[#6B5F5A]">
                      {totalItems} total {totalItems === 1 ? "piece" : "pieces"}{" "}
                      across {categoryCount} categories
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#2D2A24]">
                    {totalItems}
                  </div>
                  <div className="text-sm text-[#6B5F5A]">Total Items</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Content */}
        <div className="space-y-8">
          {/* Empty State */}
          {totalItems === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#E8D5C4] to-[#D8B4A0] rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-[#2D2A24]"
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
              </div>
              <h2 className="text-2xl font-semibold text-[#2D2A24] mb-2">
                Your portfolio is empty
              </h2>
              <p className="text-[#6B5F5A] max-w-md mx-auto mb-6">
                Start building your portfolio by uploading your first image or
                video. Organize your work into categories to create a beautiful,
                professional showcase.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-[#9A8F8A]">
                <div className="flex items-center space-x-1">
                  <span>📷</span>
                  <span>Images</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>🎥</span>
                  <span>Videos</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>📁</span>
                  <span>Categories</span>
                </div>
              </div>
            </div>
          )}

          {/* Portfolio Sections */}
          {totalItems > 0 && (
            <div className="space-y-8">
              {Object.entries(groupedItems).map(([category, items]) => (
                <PortfolioSection
                  key={category}
                  category={category}
                  items={items}
                  isExpanded={true}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

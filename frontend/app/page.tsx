"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import { useEffect, useState } from "react";
import UploadModal from "@/components/UploadModal";
import MediaCard from "@/components/MediaCard";
import { loadPortfolio, savePortfolio } from "@/services/api";

const USER_ID = "mvp";

export default function HomePage() {
  const { state, dispatch } = usePortfolio();
  const [showModal, setShowModal] = useState(false);

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Portfolio</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add New
        </button>
      </div>

      {showModal && <UploadModal onClose={() => setShowModal(false)} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {state.items.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

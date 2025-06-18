"use client";

import { useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { uploadFile } from "@/services/api";
import { MediaItem } from "@/types";
import { v4 as uuidv4 } from "uuid";

export default function UploadModal({ onClose }: { onClose: () => void }) {
  const { dispatch } = usePortfolio();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    const result = await uploadFile(file);

    const newItem: MediaItem = {
      id: uuidv4(),
      filename: result.filename,
      media_type: result.media_type,
      title,
      description,
      category,
      url: result.url,
    };

    dispatch({ type: "ADD_ITEM", payload: newItem });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Media</h2>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-2"
        />
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="w-full border p-2 mb-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category (e.g. Photography)"
          className="w-full border p-2 mb-4"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

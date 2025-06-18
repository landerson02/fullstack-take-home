import { MediaItem } from "@/types";

export default function MediaCard({ item }: { item: MediaItem }) {
  return (
    <div className="border rounded-lg shadow p-4">
      <div className="mb-2">
        {item.media_type === "image" ? (
          <img
            src={item.url}
            alt={item.title}
            className="w-full h-auto rounded"
          />
        ) : (
          <video controls src={item.url} className="w-full h-auto rounded" />
        )}
      </div>
      <h3 className="text-lg font-semibold">{item.title}</h3>
      <p className="text-sm text-gray-600">{item.description}</p>
      <p className="text-xs text-gray-400 italic mt-1">
        Category: {item.category}
      </p>
    </div>
  );
}

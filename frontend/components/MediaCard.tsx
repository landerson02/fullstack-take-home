import { MediaItem } from "@/types";

interface MediaCardProps {
  item: MediaItem;
  onClick?: () => void;
}

export default function MediaCard({ item, onClick }: MediaCardProps) {
  return (
    <div
      className="group card overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <div
        className="aspect-video relative overflow-hidden"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        {item.media_type === "image" ? (
          <img
            src={item.url}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <video src={item.url} className="w-full h-full object-cover" />
        )}
        <div className="absolute top-3 right-3">
          <div
            className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {item.media_type === "image" ? "📷" : "🎥"}
          </div>
        </div>
        {/* click indicator */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-3">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3
          className="text-lg font-semibold mb-2 line-clamp-1"
          style={{ color: "var(--color-text-primary)" }}
        >
          {item.title}
        </h3>
        <p
          className="text-sm line-clamp-2 mb-3 leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-text-primary)",
            }}
          >
            {item.category}
          </span>
        </div>
      </div>
    </div>
  );
}

import { MediaItem } from "@/types";

export default function MediaCard({ item }: { item: MediaItem }) {
  return (
    <div className="group card overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <div className="aspect-video bg-[#FAF8F5] relative overflow-hidden">
        {item.media_type === "image" ? (
          <img
            src={item.url}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <video
            controls
            src={item.url}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute top-3 right-3">
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-[#6B5F5A]">
            {item.media_type === "image" ? "📷" : "🎥"}
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-[#2D2A24] mb-2 line-clamp-1">
          {item.title}
        </h3>
        <p className="text-sm text-[#6B5F5A] line-clamp-2 mb-3 leading-relaxed">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#E8D5C4] text-[#2D2A24]">
            {item.category}
          </span>
        </div>
      </div>
    </div>
  );
}

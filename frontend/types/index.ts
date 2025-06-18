export type MediaItem = {
  id: string;
  filename: string;
  media_type: "image" | "video";
  title: string;
  description: string;
  category: string;
  url: string;
};

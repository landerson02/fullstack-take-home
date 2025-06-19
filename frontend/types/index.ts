export type MediaItem = {
  id: string;
  filename: string;
  media_type: "image" | "video";
  title: string;
  description: string;
  category: string;
  url: string;
};

export enum Category {
  PHOTOGRAPHY = "Photography",
  VIDEOS = "Videos",
  DESIGN = "Design",
  ILLUSTRATION = "Illustration",
  DIGITAL_ART = "Digital Art",
  ANIMATION = "Animation",
  ARCHITECTURE = "Architecture",
  FASHION = "Fashion",
  FINE_ART = "Fine Art",
  OTHER = "Other",
}

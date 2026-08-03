import ClassicTemplate from "./Classic";
import ModernTemplate from "./Modern";
import PlayfulTemplate from "./Playful";
import WeddingTemplate from "./Wedding";

export const templates = {
  classic: { name: "Classic", component: ClassicTemplate },
  modern: { name: "Modern", component: ModernTemplate },
  playful: { name: "Playful", component: PlayfulTemplate },
  wedding: { name: "Wedding", component: WeddingTemplate },
} as const;

export type TemplateId = keyof typeof templates;

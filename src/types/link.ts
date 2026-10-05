export interface LinkItem {
  id: string;
  url: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  createdAt: string;
  featured?: boolean;
  youtubeId?: string;
  author?: string;
}

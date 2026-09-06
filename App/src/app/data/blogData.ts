export interface BlogPost {
  id: string;
  slug?: string;
  date: string;
  title: string;
  subtitle?: string;
  description: string;
  content: string | string[];
  image: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  category: string;
  readTime: string;
  quote?: string;
}

export const blogPosts: BlogPost[] = [];

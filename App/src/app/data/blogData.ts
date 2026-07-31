export interface BlogPost {
  id: string;
  slug: string;
  date: string;
  title: string;
  subtitle?: string;
  description: string;
  content: string;
  image: string;
  author: string;
  authorRole?: string;
  category: string;
  readTime: string;
}

// 100% Fresh - Empty by default until created via Admin Dashboard / API
export const blogPosts: BlogPost[] = [];

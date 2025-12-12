export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
}

export enum Category {
  TECHNOLOGY = 'Technology',
  LIFESTYLE = 'Lifestyle',
  TRAVEL = 'Travel',
  FOOD = 'Food',
  BUSINESS = 'Business'
}

export type BlogPostFormData = Omit<BlogPost, 'id' | 'date'>;
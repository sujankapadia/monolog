export interface SiteMetadata {
  site_title: string;
  author: string;
  [key: string]: any;
}

export interface PostMetadata {
  title: string;
  date: string;
  topic?: string;
  tags?: string[];
}

export interface Post {
  metadata: PostMetadata;
  content: string;
  html: string;
  id: string;
}

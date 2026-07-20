export type ProjectStatus = "online" | "desenvolvimento" | "demonstracao";

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string;
  result_description: string;
  image_url: string | null;
  live_url: string | null;
  status: ProjectStatus;
  featured: boolean;
  published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type ProjectInput = Omit<Project, "id" | "created_at" | "updated_at">;

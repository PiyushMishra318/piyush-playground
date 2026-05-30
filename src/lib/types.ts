export interface Repo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  url: string;
  demo: string | null;
  topics: string[];
  emoji: string;
  color: string;
}

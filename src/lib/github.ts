import type { Repo } from "./types";

const USERNAME = "PiyushMishra318";

const DEMO_URLS: Record<string, string> = {
  "Threshold-Background-Cutout": "https://threshold-background-cutout.vercel.app",
  "SVG-Palette-Processor": "https://svg-palette-processor.vercel.app",
  "canvas-component-parser": "https://canvas-component-parser.vercel.app",
  "django-learning-projects": "https://django-learning-projects.vercel.app",
  "ESP8266-DHT11-Google-Sheets-Logger":
    "https://esp8266-dht11-google-sheets-logger.vercel.app",
  "HTML5-Canvas-Mini-Games": "https://html5-canvas-games.vercel.app",
  XBat: "https://xbat.vercel.app",
  lumina: "https://lumina.vercel.app",
  "postman-to-swagger": "https://postman-to-swagger.vercel.app",
  "Tsukiyomi-Platform": "https://tsukiyomi-platform.vercel.app",
  wingman: "https://wingman-rho-seven.vercel.app",
  transcribe: "https://transcribe-wine.vercel.app",
  talkative: "https://talkative-brown.vercel.app",
  "website-page-speed-report":
    "https://website-page-speed-report.vercel.app",
  "htmx-reading-time": "https://htmx-reading-time.vercel.app",
  CodeDiff: "https://codediff-zeta.vercel.app",
  lambda: "https://lambda-sepia.vercel.app",
  "Email-Validation": "https://email-validation-three-neon.vercel.app",
};

const FALLBACK_DESCRIPTIONS: Record<string, string> = {
  CodeDiff: "Side-by-side and unified diff viewer for comparing code",
  "postman-to-swagger": "Convert Postman collections into OpenAPI + Swagger UI",
  transcribe: "Local-first speech transcription powered by Rust",
  XBat: "Batch automation scripts for Windows power users",
  wingman: "CLI companion for developer workflows in Go",
  "github-api-test": "NestJS playground for GitHub API integrations",
  piyushmishra318: "Classic portfolio site — the before times",
  "ThreeJsFilters-Research": "WebGL filter experiments with Three.js",
  "advent-of-code": "Advent of Code solutions as a Go CLI",
};

const LANGUAGE_EMOJI: Record<string, string> = {
  JavaScript: "⚡",
  TypeScript: "🔷",
  Python: "🐍",
  Rust: "🦀",
  Go: "🐹",
  Dart: "🎯",
  CSS: "🎨",
  HTML: "📄",
  "Vim script": "✨",
};

const PALETTE = [
  "#FF6B6B",
  "#4ECDC4",
  "#FFE66D",
  "#A78BFA",
  "#FB923C",
  "#34D399",
  "#F472B6",
  "#60A5FA",
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  homepage: string | null;
  topics: string[];
  fork: boolean;
  archived: boolean;
}

function enrichRepo(repo: GitHubRepo, index: number): Repo {
  const demo =
    (repo.homepage && repo.homepage.trim()) ||
    DEMO_URLS[repo.name] ||
    null;

  return {
    name: repo.name,
    description:
      repo.description ||
      FALLBACK_DESCRIPTIONS[repo.name] ||
      "A curious corner of the codebase",
    language: repo.language,
    stars: repo.stargazers_count,
    url: repo.html_url,
    demo,
    topics: repo.topics ?? [],
    emoji: LANGUAGE_EMOJI[repo.language ?? ""] ?? "📦",
    color: PALETTE[hashString(repo.name) % PALETTE.length],
  };
}

export async function getRepos(): Promise<Repo[]> {
  const res = await fetch(
    `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`,
    {
      next: { revalidate: 3600 },
      headers: { Accept: "application/vnd.github+json" },
    },
  );

  if (!res.ok) {
    return getFallbackRepos();
  }

  const data = (await res.json()) as GitHubRepo[];

  return data
    .filter(
      (r) =>
        !r.fork &&
        !r.archived &&
        r.name !== "piyush-playground" &&
        r.name !== "my-profile",
    )
    .sort(
      (a, b) =>
        b.stargazers_count - a.stargazers_count ||
        a.name.localeCompare(b.name),
    )
    .map(enrichRepo);
}

async function getFallbackRepos(): Promise<Repo[]> {
  const { readFile } = await import("fs/promises");
  const { join } = await import("path");

  try {
    const raw = await readFile(
      join(process.cwd(), "repos-data.jsonl"),
      "utf8",
    );
    const lines = raw.trim().split("\n").filter(Boolean);
    const repos = lines.map((line) => JSON.parse(line) as GitHubRepo);
    return repos
      .filter((r) => r.name !== "piyush-playground")
      .map((r, i) => enrichRepo(r, i));
  } catch {
    return [];
  }
}

export const profile = {
  username: USERNAME,
  name: "Piyush Mishra",
  site: "https://piyushm.dev",
  avatar: `https://avatars.githubusercontent.com/u/42195216?v=4`,
};

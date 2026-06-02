import type { Repo } from "./types";

const USERNAME = "PiyushMishra318";

/** Canonical Vercel demo URLs (suffixed aliases from portfolio handoff). */
const DEMO_URLS: Record<string, string> = {
  "Threshold-Background-Cutout": "https://threshold-background-cutout.vercel.app",
  "SVG-Palette-Processor": "https://svg-palette-processor.vercel.app",
  "canvas-component-parser": "https://coot-parser-experimental.vercel.app",
  "django-learning-projects": "https://django-learning-projects-neon.vercel.app",
  "ESP8266-DHT11-Google-Sheets-Logger":
    "https://esp8266-dht11-google-sheets-logger.vercel.app",
  "HTML5-Canvas-Mini-Games": "https://html5-canvas-games.vercel.app",
  XBat: "https://xbat.vercel.app",
  lumina: "https://lumina-one-beta.vercel.app",
  "postman-to-swagger": "https://postman-to-swagger.vercel.app",
  "Tsukiyomi-Platform": "https://tsukiyomi-platform.vercel.app",
  wingman: "https://wingman-rho-seven.vercel.app",
  transcribe: "https://transcribe-wine.vercel.app",
  talkative: "https://talkative-brown.vercel.app",
  "website-page-speed-report": "https://website-page-speed-report.vercel.app",
  "htmx-reading-time": "https://htmx-reading-time.vercel.app",
  CodeDiff: "https://codediff-zeta.vercel.app",
  lambda: "https://lambda-sepia.vercel.app",
  "Email-Validation": "https://email-validation-three-neon.vercel.app",
};

const FALLBACK_DESCRIPTIONS: Record<string, string> = {
  CodeDiff: "Side-by-side and unified diff viewer for comparing code",
  "postman-to-swagger": "Convert Postman collections into OpenAPI + Swagger UI",
  transcribe: "Batch episode transcription with whisper.cpp",
  XBat: "Xbox controller battery widget for Windows",
  wingman: "Terminal UI to upgrade software across package managers",
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
  "#64748B",
  "#475569",
  "#2563EB",
  "#0891B2",
  "#059669",
  "#78716C",
  "#6366F1",
  "#0D9488",
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
}

export const profile = {
  username: USERNAME,
  name: "Piyush Mishra",
  site: "https://piyushm.dev",
  avatar: `https://github.com/${USERNAME}.png`,
};

function mapRepo(raw: GitHubRepo): Repo {
  const emoji = LANGUAGE_EMOJI[raw.language ?? ""] ?? "📦";
  const color = PALETTE[hashString(raw.name) % PALETTE.length];
  const demo = DEMO_URLS[raw.name] ?? raw.homepage ?? undefined;
  const description =
    raw.description ??
    FALLBACK_DESCRIPTIONS[raw.name] ??
    "A public experiment from the GitHub playground.";

  return {
    name: raw.name,
    description,
    language: raw.language ?? "Code",
    stars: raw.stargazers_count,
    url: raw.html_url,
    demo,
    emoji,
    color,
    topics: raw.topics,
  };
}

export async function getRepos(): Promise<Repo[]> {
  const res = await fetch(
    `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`,
    { next: { revalidate: 3600 } },
  );

  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}`);
  }

  const data = (await res.json()) as GitHubRepo[];

  return data
    .filter((r) => !r.fork && r.name !== "piyush-playground")
    .map(mapRepo)
    .sort((a, b) => b.stars - a.stars);
}

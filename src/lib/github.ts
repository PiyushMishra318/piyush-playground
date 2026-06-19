import type { Repo } from "./types";

const USERNAME = "PiyushMishra318";

/** GitHub repo name → portfolio product slug (see scripts/products-manifest.mjs). */
const REPO_TO_PRODUCT_SLUG: Record<string, string> = {
  "Threshold-Background-Cutout": "background-remover",
  "SVG-Palette-Processor": "svg-palette",
  "canvas-component-parser": "coot-parser",
  "django-learning-projects": "django-learning",
  "Email-Validation": "email-validation",
  "ESP8266-DHT11-Google-Sheets-Logger": "tracktemp",
  "HTML5-Canvas-Mini-Games": "canvas-games",
  CodeDiff: "codediff",
  lambda: "lambda",
  lumina: "lumina",
  "postman-to-swagger": "postman-to-swagger",
  "htmx-reading-time": "readtime",
  talkative: "talkative",
  transcribe: "transcribe",
  "Tsukiyomi-Platform": "tsukiyomi",
  "website-page-speed-report": "page-speed",
  wingman: "wingman",
  XBat: "xbat",
  "piyush-playground": "playground",
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
  site: "/",
  avatar: `https://github.com/${USERNAME}.png`,
};

function normalizeProductPath(pathname: string): string {
  const withLeading = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
}

/** Portfolio product demos only — ignore stale GitHub homepage / vercel.app URLs. */
function resolveDemo(repoName: string, homepage: string | null | undefined): string | undefined {
  const slug = REPO_TO_PRODUCT_SLUG[repoName];
  if (slug) return `/products/${slug}/`;

  const home = homepage?.trim();
  if (!home) return undefined;

  if (home.startsWith("/products/")) {
    return normalizeProductPath(home);
  }

  if (home.includes("piyushm.dev/products/")) {
    try {
      return normalizeProductPath(new URL(home).pathname);
    } catch {
      return undefined;
    }
  }

  return undefined;
}

function mapRepo(raw: GitHubRepo): Repo {
  const emoji = LANGUAGE_EMOJI[raw.language ?? ""] ?? "📦";
  const color = PALETTE[hashString(raw.name) % PALETTE.length];
  const demo = resolveDemo(raw.name, raw.homepage);
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

# Piyush's GitHub Playground

An interactive portfolio — playful, curious, and definitely not a boring project grid.

**Live:** [piyush-playground.vercel.app](https://piyush-playground.vercel.app) · [piyushm.dev](https://piyushm.dev)

## Features

- **Intro gate** — typewriter welcome before you enter
- **Repo galaxy** — draggable floating orbs for every public repo
- **Flip cards** — click-to-reveal project descriptions
- **Star hunt** — 5 hidden stars scattered across the page
- **Konami easter egg** — unlocks a shortcut to the canvas games demo
- **Playful cursor** — magnifying glass / grab / star modes (desktop)

Repos are fetched from the GitHub API at build time (revalidated hourly). No API token required for public data.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Deployed on Vercel

## Local development

```bash
git clone https://github.com/PiyushMishra318/piyush-playground.git
cd piyush-playground
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

None required for the public GitHub API. Optional:

| Variable | Description |
|----------|-------------|
| `GITHUB_USERNAME` | Override username (defaults to `PiyushMishra318`) |

## Deploy to Vercel

The Vercel project is linked locally (`.vercel/`). From the repo root:

```bash
npm install
npx vercel deploy --prod --yes
```

If you hit the free-tier **100 deploys/day** cap, wait ~24 hours and retry, or connect the repo in the [Vercel dashboard](https://vercel.com/new) for Git-triggered deploys once the cap resets.

No environment variables are required for public GitHub data.

## License

MIT © 2026 · [piyushm.dev](https://piyushm.dev)

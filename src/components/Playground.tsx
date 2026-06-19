"use client";

import { useState } from "react";
import type { Repo } from "@/lib/types";
import IntroGate from "./IntroGate";
import PlayfulCursor from "./PlayfulCursor";
import RepoDeck from "./RepoDeck";
import RepoGalaxy from "./RepoGalaxy";
import RepoModal from "./RepoModal";
import StarHunt from "./StarHunt";
import ThemeToggle from "./ThemeToggle";

interface PlaygroundProps {
  repos: Repo[];
  profile: {
    username: string;
    name: string;
    site: string;
    avatar: string;
  };
}

export default function Playground({ repos, profile }: PlaygroundProps) {
  const [entered, setEntered] = useState(false);
  const [selected, setSelected] = useState<Repo | null>(null);
  const [view, setView] = useState<"galaxy" | "deck">("galaxy");

  const withDemo = repos.filter((r) => r.demo);

  return (
    <>
      <ThemeToggle />
      <PlayfulCursor />
      {!entered && (
        <IntroGate repoCount={repos.length} onEnter={() => setEntered(true)} />
      )}

      {entered && (
        <>
          <StarHunt repos={repos} />

          <header className="sticky top-0 z-20 border-b border-foreground/10 bg-background/90 backdrop-blur-md">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <img
                  src={profile.avatar}
                  alt=""
                  className="h-10 w-10 rounded-full border-2 border-foreground"
                />
                <div>
                  <p className="font-display text-sm font-bold text-foreground">
                    {profile.name}
                  </p>
                  <a
                    href={profile.site}
                    className="text-xs text-accent hover:underline"
                  >
                    piyushm.dev
                  </a>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setView("galaxy")}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${view === "galaxy" ? "bg-foreground text-background" : "bg-surface text-foreground"}`}
                >
                  Galaxy
                </button>
                <button
                  type="button"
                  onClick={() => setView("deck")}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${view === "deck" ? "bg-foreground text-background" : "bg-surface text-foreground"}`}
                >
                  Cards
                </button>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-5xl flex-1 px-4 py-8">
            <section className="mb-12 grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
              <div>
                <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  Project demos · not the work portfolio
                </p>
                <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.05] text-foreground sm:text-6xl">
                  The GitHub
                  <br />
                  Playground
                </h1>
                <p className="mt-4 max-w-lg text-lg text-muted-foreground">
                  {repos.length} public repos as toys — galaxy or cards, hidden
                  stars, live product demos. For résumé-style work history visit{" "}
                  <a
                    href={profile.site}
                    className="font-medium text-accent underline decoration-highlight decoration-2 underline-offset-4"
                  >
                    piyushm.dev
                  </a>
                  .
                </p>
              </div>
              <div className="rounded-3xl border-2 border-foreground bg-surface p-5 shadow-brutal">
                <p className="font-display text-sm font-bold text-foreground">
                  How to play
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>◆ Drag orbs in Galaxy view</li>
                  <li>◆ Flip cards to read repo stories</li>
                  <li>◆ Find every hidden star</li>
                  <li>◆ Jump to live demos below</li>
                </ul>
              </div>
            </section>

            {view === "galaxy" ? (
              <RepoGalaxy repos={repos} onSelect={setSelected} />
            ) : (
              <RepoDeck repos={repos} onSelect={setSelected} />
            )}

            {withDemo.length > 0 && (
              <section className="mt-14">
                <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-muted">
                  Live demos
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold text-foreground">
                  Try the demos ({withDemo.length})
                </h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {withDemo.map((repo) => (
                    <a
                      key={repo.name}
                      href={repo.demo!}
                      className="group flex items-start gap-3 rounded-2xl border-2 border-foreground/12 bg-surface p-4 shadow-card transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover"
                      data-cursor="star"
                    >
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg"
                        style={{ backgroundColor: repo.color }}
                      >
                        {repo.emoji}
                      </span>
                      <span>
                        <span className="block font-display font-bold text-foreground group-hover:text-accent">
                          {repo.name}
                        </span>
                        <span className="mt-1 line-clamp-2 text-xs text-muted">
                          {repo.description}
                        </span>
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </main>

          <footer className="border-t border-foreground/10 bg-background py-6 text-center text-sm text-muted">
            MIT © 2026 ·{" "}
            <a href={profile.site} className="text-accent hover:underline">
              piyushm.dev
            </a>
            {" · "}
            <a
              href={`https://github.com/${profile.username}`}
              className="hover:underline"
            >
              @{profile.username}
            </a>
          </footer>

          <RepoModal repo={selected} onClose={() => setSelected(null)} />
        </>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import type { Repo } from "@/lib/types";
import IntroGate from "./IntroGate";
import PlayfulCursor from "./PlayfulCursor";
import RepoDeck from "./RepoDeck";
import RepoGalaxy from "./RepoGalaxy";
import RepoModal from "./RepoModal";
import StarHunt from "./StarHunt";

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
      <PlayfulCursor />
      {!entered && (
        <IntroGate repoCount={repos.length} onEnter={() => setEntered(true)} />
      )}

      {entered && (
        <>
          <StarHunt repos={repos} />

          <header className="sticky top-0 z-20 border-b border-[#2D2A26]/10 bg-[#FFF5E6]/90 backdrop-blur-md">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <img
                  src={profile.avatar}
                  alt=""
                  className="h-10 w-10 rounded-full border-2 border-[#2D2A26]"
                />
                <div>
                  <p className="font-display text-sm font-bold text-[#2D2A26]">
                    {profile.name}
                  </p>
                  <a
                    href={profile.site}
                    className="text-xs text-[#FF6B6B] hover:underline"
                  >
                    piyushm.dev
                  </a>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setView("galaxy")}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${view === "galaxy" ? "bg-[#2D2A26] text-white" : "bg-white text-[#2D2A26]"}`}
                >
                  Galaxy
                </button>
                <button
                  type="button"
                  onClick={() => setView("deck")}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${view === "deck" ? "bg-[#2D2A26] text-white" : "bg-white text-[#2D2A26]"}`}
                >
                  Cards
                </button>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-5xl flex-1 px-4 py-8">
            <section className="mb-10 text-center">
              <h1 className="font-display text-4xl font-bold text-[#2D2A26] sm:text-5xl">
                The GitHub Playground
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-[#5C534A]">
                {repos.length} repos, zero corporate vibes. Drag orbs, flip
                cards, hunt hidden stars. Konami code optional but encouraged.
              </p>
            </section>

            {view === "galaxy" ? (
              <RepoGalaxy repos={repos} onSelect={setSelected} />
            ) : (
              <RepoDeck repos={repos} onSelect={setSelected} />
            )}

            {withDemo.length > 0 && (
              <section className="mt-12">
                <h2 className="mb-4 font-display text-xl font-bold text-[#2D2A26]">
                  Live demos ({withDemo.length})
                </h2>
                <div className="flex flex-wrap gap-2">
                  {withDemo.map((repo) => (
                    <a
                      key={repo.name}
                      href={repo.demo!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-[#2D2A26]/20 bg-white px-4 py-2 text-sm text-[#2D2A26] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      data-cursor="star"
                    >
                      {repo.emoji} {repo.name}
                    </a>
                  ))}
                </div>
              </section>
            )}
          </main>

          <footer className="border-t border-[#2D2A26]/10 bg-[#FFF5E6] py-6 text-center text-sm text-[#8B7355]">
            MIT © 2026 ·{" "}
            <a href={profile.site} className="text-[#FF6B6B] hover:underline">
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

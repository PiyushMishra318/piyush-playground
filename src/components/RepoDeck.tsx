"use client";

import { useState } from "react";
import type { Repo } from "@/lib/types";

interface RepoDeckProps {
  repos: Repo[];
  onSelect: (repo: Repo) => void;
}

export default function RepoDeck({ repos, onSelect }: RepoDeckProps) {
  const [flipped, setFlipped] = useState<Set<string>>(new Set());

  const toggle = (name: string, repo: Repo) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
        onSelect(repo);
      }
      return next;
    });
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo) => {
        const isFlipped = flipped.has(repo.name);

        return (
          <button
            key={repo.name}
            type="button"
            className="flip-card group h-44 perspective-[1000px] text-left"
            onClick={() => toggle(repo.name, repo)}
            data-cursor="star"
          >
            <div
              className={`flip-inner relative h-full w-full transition-transform duration-500 ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="flip-front absolute inset-0 flex flex-col justify-between rounded-2xl border-2 border-foreground/15 bg-surface p-4 shadow-card"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                    style={{ backgroundColor: repo.color }}
                  >
                    {repo.emoji}
                  </span>
                  <span className="truncate font-display font-bold text-foreground">
                    {repo.name}
                  </span>
                </div>
                <p className="text-xs text-muted">tap to reveal →</p>
              </div>

              <div
                className="flip-back absolute inset-0 flex flex-col justify-between rounded-2xl border-2 border-foreground p-4 text-foreground"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  backgroundColor: repo.color,
                }}
              >
                <p className="line-clamp-3 text-sm font-medium">
                  {repo.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span>{repo.language ?? "misc"}</span>
                  {repo.stars > 0 && <span>★ {repo.stars}</span>}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

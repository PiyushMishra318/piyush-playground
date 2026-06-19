"use client";

import { useEffect } from "react";
import type { Repo } from "@/lib/types";

interface RepoModalProps {
  repo: Repo | null;
  onClose: () => void;
}

export default function RepoModal({ repo, onClose }: RepoModalProps) {
  useEffect(() => {
    if (!repo) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [repo, onClose]);

  if (!repo) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-foreground/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label={`${repo.name} details`}
    >
      <div
        className="modal-card w-full max-w-md animate-pop rounded-3xl border-2 border-foreground bg-surface p-6 shadow-brutal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl"
            style={{ backgroundColor: repo.color }}
          >
            {repo.emoji}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm text-muted hover:bg-background"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <h2 className="font-display text-2xl font-bold text-foreground">
          {repo.name}
        </h2>

        <p className="mt-2 text-muted-foreground">{repo.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {repo.language && (
            <span className="rounded-full bg-background px-3 py-1 text-xs font-medium text-foreground">
              {repo.language}
            </span>
          )}
          {repo.stars > 0 && (
            <span className="rounded-full bg-highlight-muted px-3 py-1 text-xs font-medium">
              ★ {repo.stars}
            </span>
          )}
          {repo.demo && (
            <span className="rounded-full bg-accent-muted px-3 py-1 text-xs font-medium">
              live demo
            </span>
          )}
        </div>

        {repo.topics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {repo.topics.slice(0, 5).map((t) => (
              <span
                key={t}
                className="rounded-md bg-secondary-muted px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-foreground bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-brutal-accent transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            data-cursor="star"
          >
            View on GitHub →
          </a>
          {repo.demo && (
            <a
              href={repo.demo}
              className="rounded-full border-2 border-foreground bg-surface px-5 py-2.5 text-sm font-medium text-foreground shadow-brutal-secondary transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
              data-cursor="star"
            >
              Try demo →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

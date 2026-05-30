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
      className="fixed inset-0 z-40 flex items-end justify-center bg-[#2D2A26]/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label={`${repo.name} details`}
    >
      <div
        className="modal-card w-full max-w-md animate-pop rounded-3xl border-2 border-[#2D2A26] bg-white p-6 shadow-[8px_8px_0_#2D2A26]"
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
            className="rounded-full px-3 py-1 text-sm text-[#8B7355] hover:bg-[#FFF5E6]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <h2 className="font-display text-2xl font-bold text-[#2D2A26]">
          {repo.name}
        </h2>

        <p className="mt-2 text-[#5C534A]">{repo.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {repo.language && (
            <span className="rounded-full bg-[#FFF5E6] px-3 py-1 text-xs font-medium text-[#2D2A26]">
              {repo.language}
            </span>
          )}
          {repo.stars > 0 && (
            <span className="rounded-full bg-[#FFE66D]/40 px-3 py-1 text-xs font-medium">
              ★ {repo.stars}
            </span>
          )}
          {repo.demo && (
            <span className="rounded-full bg-[#4ECDC4]/30 px-3 py-1 text-xs font-medium">
              live demo
            </span>
          )}
        </div>

        {repo.topics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {repo.topics.slice(0, 5).map((t) => (
              <span
                key={t}
                className="rounded-md bg-[#F3F0EB] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[#8B7355]"
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
            className="rounded-full border-2 border-[#2D2A26] bg-[#2D2A26] px-5 py-2.5 text-sm font-medium text-white shadow-[3px_3px_0_#FF6B6B] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#FF6B6B]"
            data-cursor="star"
          >
            View on GitHub →
          </a>
          {repo.demo && (
            <a
              href={repo.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-[#2D2A26] bg-white px-5 py-2.5 text-sm font-medium text-[#2D2A26] shadow-[3px_3px_0_#4ECDC4] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#4ECDC4]"
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

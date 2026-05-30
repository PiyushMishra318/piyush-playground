"use client";

import { useCallback, useEffect, useState } from "react";
import type { Repo } from "@/lib/types";

interface StarHuntProps {
  repos: Repo[];
}

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export default function StarHunt({ repos }: StarHuntProps) {
  const [found, setFound] = useState<Set<number>>(new Set());
  const [secret, setSecret] = useState(false);
  const [konamiIdx, setKonamiIdx] = useState(0);

  const starPositions = repos.slice(0, 5).map((_, i) => ({
    id: i,
    top: `${12 + i * 16}%`,
    left: `${8 + ((i * 17) % 75)}%`,
  }));

  const collect = useCallback((id: number) => {
    setFound((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const expected = KONAMI[konamiIdx];
      if (e.key === expected) {
        const next = konamiIdx + 1;
        if (next === KONAMI.length) {
          setSecret(true);
          setKonamiIdx(0);
        } else {
          setKonamiIdx(next);
        }
      } else {
        setKonamiIdx(e.key === KONAMI[0] ? 1 : 0);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [konamiIdx]);

  return (
    <>
      {starPositions.map((star) =>
        found.has(star.id) ? null : (
          <button
            key={star.id}
            type="button"
            className="star-hunt fixed z-30 animate-float text-2xl opacity-70 transition hover:scale-125 hover:opacity-100"
            style={{ top: star.top, left: star.left }}
            onClick={() => collect(star.id)}
            aria-label="Hidden star"
            data-cursor="star"
          >
            ⭐
          </button>
        ),
      )}

      {found.size > 0 && (
        <div className="fixed bottom-24 right-4 z-30 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-[#2D2A26] shadow-lg backdrop-blur">
          {found.size}/5 stars ·{" "}
          {found.size === 5 ? "you're nosy. we like that." : "keep looking…"}
        </div>
      )}

      {secret && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D2A26]/60 p-4 backdrop-blur"
          onClick={() => setSecret(false)}
          role="dialog"
        >
          <div
            className="max-w-sm rounded-3xl border-2 border-[#FFE66D] bg-[#FFF5E6] p-8 text-center shadow-[8px_8px_0_#FFE66D]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-4xl">🎮</p>
            <h3 className="mt-3 font-display text-xl font-bold text-[#2D2A26]">
              Konami unlocked!
            </h3>
            <p className="mt-2 text-sm text-[#5C534A]">
              Piyush&apos;s canvas games are the real boss fight. Go play Space
              Shooter.
            </p>
            <a
              href="https://html5-canvas-games.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-full bg-[#FF6B6B] px-6 py-2.5 text-sm font-bold text-white"
            >
              Launch games →
            </a>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Repo } from "@/lib/types";

interface RepoGalaxyProps {
  repos: Repo[];
  onSelect: (repo: Repo) => void;
}

interface Orb {
  repo: Repo;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export default function RepoGalaxy({ repos, onSelect }: RepoGalaxyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(
    null,
  );

  useEffect(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    const h = typeof window !== "undefined" ? window.innerHeight : 800;

    setOrbs(
      repos.map((repo, i) => {
        const angle = (i / repos.length) * Math.PI * 2;
        const radius = Math.min(w, h) * 0.28;
        return {
          repo,
          x: w / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 60,
          y: h / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 60,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: 72 + Math.min(repo.stars * 8, 24) + (repo.demo ? 8 : 0),
        };
      }),
    );
  }, [repos]);

  useEffect(() => {
    let frame: number;

    const tick = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      setOrbs((prev) =>
        prev.map((orb) => {
          if (dragRef.current?.id === orb.repo.name) return orb;

          let { x, y, vx, vy } = orb;
          x += vx;
          y += vy;

          if (x < orb.size / 2 || x > w - orb.size / 2) vx *= -1;
          if (y < orb.size / 2 || y > h - orb.size / 2) vy *= -1;

          x = Math.max(orb.size / 2, Math.min(w - orb.size / 2, x));
          y = Math.max(orb.size / 2, Math.min(h - orb.size / 2, y));

          return { ...orb, x, y, vx, vy };
        }),
      );

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent, repoName: string) => {
      const orb = orbs.find((o) => o.repo.name === repoName);
      if (!orb || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      dragRef.current = {
        id: repoName,
        offsetX: e.clientX - rect.left - orb.x,
        offsetY: e.clientY - rect.top - orb.y,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [orbs],
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const { id, offsetX, offsetY } = dragRef.current;

    setOrbs((prev) =>
      prev.map((orb) =>
        orb.repo.name === id
          ? {
              ...orb,
              x: e.clientX - rect.left - offsetX,
              y: e.clientY - rect.top - offsetY,
              vx: 0,
              vy: 0,
            }
          : orb,
      ),
    );
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent, repo: Repo) => {
    if (dragRef.current) {
      dragRef.current = null;
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="repo-galaxy bg-galaxy relative h-[55vh] min-h-[320px] w-full overflow-hidden rounded-3xl border-2 border-foreground/10"
      onPointerMove={onPointerMove}
    >
      <p className="absolute left-4 top-4 z-10 rounded-full bg-surface/80 px-3 py-1 text-xs font-medium text-muted backdrop-blur">
        drag the orbs · click to inspect
      </p>

      {orbs.map((orb) => (
        <button
          key={orb.repo.name}
          type="button"
          className="orb absolute flex cursor-grab items-center justify-center rounded-full border-2 border-foreground/20 font-display text-sm font-bold text-foreground shadow-lg transition-shadow hover:shadow-xl active:cursor-grabbing"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x - orb.size / 2,
            top: orb.y - orb.size / 2,
            backgroundColor: orb.repo.color,
            touchAction: "none",
          }}
          data-cursor="grab"
          onPointerDown={(e) => onPointerDown(e, orb.repo.name)}
          onPointerUp={(e) => onPointerUp(e, orb.repo)}
          onClick={() => onSelect(orb.repo)}
          title={orb.repo.name}
        >
          <span className="pointer-events-none px-1 text-center leading-tight">
            {orb.repo.emoji}
          </span>
        </button>
      ))}
    </div>
  );
}

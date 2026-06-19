"use client";

import { useEffect, useState } from "react";
import Playground from "@/components/Playground";
import { getRepos, profile } from "@/lib/github";
import type { Repo } from "@/lib/types";

export default function PlaygroundPage() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRepos()
      .then(setRepos)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load repos"));
  }, []);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8 text-center">
        <p className="text-foreground/80">{error}</p>
      </main>
    );
  }

  if (!repos) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <p className="text-foreground/60">Loading playground…</p>
      </main>
    );
  }

  return <Playground repos={repos} profile={profile} />;
}

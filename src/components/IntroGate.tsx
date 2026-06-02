"use client";

import { useEffect, useState } from "react";

interface IntroGateProps {
  repoCount: number;
  onEnter: () => void;
}

export default function IntroGate({ repoCount, onEnter }: IntroGateProps) {
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState("");

  const lines = [
    "Hello, curious human.",
    `Piyush has ${repoCount} public repos.`,
    "Some are games. Some are tools. One logs humidity to a spreadsheet.",
    "Ready to explore?",
  ];

  useEffect(() => {
    if (step >= lines.length) return;

    const full = lines[step];
    let i = 0;
    setTyped("");

    const interval = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(interval);
    }, 28);

    return () => clearInterval(interval);
  }, [step, repoCount]);

  const advance = () => {
    if (step < lines.length - 1) {
      setStep((s) => s + 1);
    } else {
      onEnter();
    }
  };

  return (
    <div className="intro-gate fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="mx-auto max-w-lg px-6 text-center">
        <p className="mb-3 font-display text-xs font-bold uppercase tracking-[0.2em] text-secondary">
          GitHub playground
        </p>
        <p className="mb-8 min-h-[4rem] font-display text-2xl leading-relaxed text-foreground sm:text-3xl">
          {typed}
          <span className="animate-blink ml-0.5 inline-block w-2 bg-accent">|</span>
        </p>

        <button
          type="button"
          onClick={advance}
          className="group rounded-full border-2 border-foreground bg-surface px-8 py-4 font-display text-lg text-foreground shadow-brutal-sm transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1 active:shadow-none"
          data-cursor="star"
        >
          {step < lines.length - 1 ? "Continue →" : "Enter the playground →"}
        </button>
      </div>
    </div>
  );
}

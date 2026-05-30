"use client";

import { useEffect, useState } from "react";

export default function PlayfulCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<"default" | "grab" | "star">("default");

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-cursor='grab']")) setMode("grab");
      else if (target.closest("[data-cursor='star']")) setMode("star");
      else setMode("default");
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousemove", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousemove", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [visible]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  const icons = { default: "🔍", grab: "✋", star: "⭐" };

  return (
    <div
      className="playful-cursor pointer-events-none fixed z-[9999] mix-blend-difference"
      style={{
        left: pos.x,
        top: pos.y,
        opacity: visible ? 1 : 0,
        transform: `translate(-50%, -50%) scale(${mode === "grab" ? 1.3 : 1})`,
      }}
      aria-hidden
    >
      <span className="text-3xl drop-shadow-lg">{icons[mode]}</span>
    </div>
  );
}

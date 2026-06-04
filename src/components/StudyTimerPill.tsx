import { Link, useRouterState } from "@tanstack/react-router";
import { Timer } from "lucide-react";
import { useStudyTimer, formatHMS } from "./StudyTimerProvider";

export function StudyTimerPill() {
  const t = useStudyTimer();
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (t.phase === "idle" || path === "/timer" || path.startsWith("/timer/")) return null;
  return (
    <Link
      to="/timer"
      className="fixed bottom-6 right-6 z-[9999] inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand text-brand-foreground shadow-2xl shadow-brand/30 font-bold tabular-nums hover:scale-105 transition"
    >
      <Timer className={"size-4 " + (t.running ? "animate-pulse text-diva" : "text-brand-foreground/60")} />
      <span className="text-xs uppercase tracking-wider opacity-70">{t.phase === "focus" ? "Fokus" : "Istirahat"}</span>
      <span className="text-sm">{formatHMS(Math.max(0, t.targetSec - t.elapsed))}</span>
    </Link>
  );
}

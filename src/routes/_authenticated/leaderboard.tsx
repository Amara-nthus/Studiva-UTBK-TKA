import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { getLeaderboards } from "@/lib/studiva.functions";
import { Trophy, Flame, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/leaderboard")({
  component: LeaderboardPage,
});

type Tab = "exp" | "snbt" | "tka";
const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }>; field: "exp" | "snbt_best" | "tka_best" }[] = [
  { id: "exp", label: "EXP Total", icon: Sparkles, field: "exp" },
  { id: "snbt", label: "Skor SNBT", icon: Trophy, field: "snbt_best" },
  { id: "tka", label: "Skor TKA", icon: Flame, field: "tka_best" },
];

function LeaderboardPage() {
  const fn = useServerFn(getLeaderboards);
  const q = useQuery({ queryKey: ["leaderboards"], queryFn: () => fn() });
  const [tab, setTab] = useState<Tab>("exp");
  const cur = tabs.find((t) => t.id === tab)!;
  const rows = (q.data?.[tab] ?? []) as Array<{
    user_id: string;
    exp: number;
    snbt_best: number;
    tka_best: number;
    profile: { display_name: string; avatar_url: string | null; school: string | null } | null;
  }>;

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold">Leaderboard</h1>
        <p className="text-brand/60 mt-2">Saling pacu menuju kampus impian. Update real-time.</p>
      </div>
      <div className="flex gap-2 mb-6 bg-card border border-brand/5 rounded-2xl p-1.5 max-w-md">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={
              "flex-1 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition " +
              (tab === t.id ? "bg-brand text-brand-foreground" : "text-brand/60 hover:bg-brand/5")
            }
          >
            <t.icon className="size-4" /> {t.label}
          </button>
        ))}
      </div>
      {q.isLoading ? (
        <p className="text-brand/40">Memuat…</p>
      ) : rows.length === 0 ? (
        <p className="text-brand/40">Belum ada data.</p>
      ) : (
        <div className="bg-card rounded-3xl border border-brand/5 overflow-hidden">
          {rows.map((r, i) => {
            const score = (r as unknown as Record<string, number>)[cur.field] ?? 0;
            const isPodium = i < 3;
            return (
              <div
                key={r.user_id}
                className={
                  "flex items-center gap-4 p-4 border-b border-brand/5 last:border-0 " +
                  (isPodium ? "bg-diva/5" : "")
                }
              >
                <div
                  className={
                    "size-10 grid place-items-center rounded-full font-extrabold " +
                    (i === 0
                      ? "bg-diva text-brand"
                      : i === 1
                        ? "bg-brand/10 text-brand"
                        : i === 2
                          ? "bg-accent/20 text-accent"
                          : "bg-surface text-brand/50")
                  }
                >
                  {i + 1}
                </div>
                <div className="size-10 rounded-full bg-accent/10 grid place-items-center font-bold text-accent shrink-0">
                  {r.profile?.display_name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{r.profile?.display_name ?? "Pelajar"}</div>
                  <div className="text-xs text-brand/50 truncate">{r.profile?.school ?? "—"}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-extrabold">{score}</div>
                  <div className="text-[10px] uppercase font-bold text-brand/40">{cur.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}

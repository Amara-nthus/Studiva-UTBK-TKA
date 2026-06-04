import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { getStudyLeaderboard } from "@/lib/study.functions";
import { pomodoroCoach } from "@/lib/chatbot.functions";
import { useStudyTimer, formatHMS } from "@/components/StudyTimerProvider";
import { Timer, Play, Pause, RotateCcw, Trophy, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/timer")({
  component: TimerPage,
});

type Mood = "fresh" | "ok" | "tired" | "stressed";

function TimerPage() {
  const coachFn = useServerFn(pomodoroCoach);
  const lbFn = useServerFn(getStudyLeaderboard);
  const lb = useQuery({ queryKey: ["study-lb"], queryFn: () => lbFn() });
  const t = useStudyTimer();

  const [coachMsg, setCoachMsg] = useState<string | null>(null);
  const [tab, setTab] = useState<"today" | "week" | "all">("today");

  // auto trigger coach when segment ends
  useEffect(() => {
    if (t.running && t.elapsed >= t.targetSec) {
      t.pause().then(() => askCoach(t.phase === "focus" ? "focus_done" : "break_done"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t.elapsed, t.targetSec, t.running, t.phase]);

  async function askCoach(p: "start" | "focus_done" | "break_done" | "session_end") {
    try {
      const minutes = Math.floor(t.totalSeconds / 60);
      const { message } = await coachFn({ data: { phase: p, mood: t.mood, minutesStudied: minutes } });
      setCoachMsg(message);
      lb.refetch();
    } catch {
      setCoachMsg(null);
    }
  }

  async function handleStart() {
    toast.info("Tombol mulai diklik, sedang memproses...");
    console.log("handleStart button clicked");
    try {
      await t.startFocus();
      console.log("startFocus completed successfully in handler");
      askCoach("start");
    } catch (e) {
      console.error("handleStart failed:", e);
      toast.error(e instanceof Error ? e.message : "Gagal mulai");
    }
  }

  async function handleEnd() {
    await t.endSession();
    askCoach("session_end");
  }

  const progress = Math.min(100, (t.elapsed / t.targetSec) * 100);
  const board = tab === "today" ? lb.data?.today : tab === "week" ? lb.data?.week : lb.data?.all;
  const myTotal = tab === "today" ? lb.data?.mine.today : tab === "week" ? lb.data?.mine.week : lb.data?.mine.all;

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold flex items-center gap-3">
          <Timer className="size-9 text-accent" /> Study Timer
        </h1>
        <p className="text-brand/60 mt-2">Timer tetap berjalan selama tab Studiva terbuka — pindah halaman tetap aman.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="bg-card rounded-3xl border border-brand/5 p-8 shadow-xl shadow-brand/5">
          <div className="flex items-center justify-between mb-6">
            <div className="text-xs font-bold uppercase tracking-widest text-brand/50">
              {t.phase === "idle" ? "Siap mulai" : t.phase === "focus" ? "Sesi Fokus" : "Istirahat"}
            </div>
            <div className="text-xs text-brand/50">
              Akumulasi sesi: <span className="font-bold text-brand">{formatHMS(t.totalSeconds)}</span>
            </div>
          </div>

          <div className="text-center my-8">
            <div className="text-7xl md:text-8xl font-black tabular-nums tracking-tight">
              {formatHMS(Math.max(0, t.targetSec - t.elapsed))}
            </div>
            <p className="text-sm text-brand/50 mt-2">Target {Math.round(t.targetSec / 60)} menit</p>
            <div className="mt-4 h-2 bg-brand/10 rounded-full overflow-hidden">
              <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {t.phase === "idle" && (
            <div className="mb-6">
              <p className="text-xs font-bold uppercase text-brand/50 mb-2">Mood-mu sekarang?</p>
              <div className="flex flex-wrap gap-2">
                {(["fresh", "ok", "tired", "stressed"] as Mood[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => t.setMood(m)}
                    className={
                      "px-3 py-2 rounded-xl border-2 text-sm font-bold capitalize transition " +
                      (t.mood === m ? "border-accent bg-accent/10" : "border-brand/10 hover:border-accent/40")
                    }
                  >
                    {m === "fresh" ? "😊 Fresh" : m === "ok" ? "🙂 OK" : m === "tired" ? "😴 Capek" : "😖 Stress"}
                  </button>
                ))}
              </div>
              {(t.mood === "tired" || t.mood === "stressed") && (
                <p className="text-xs text-accent mt-2">AI akan otomatis membuat sesi lebih ringan (15 menit).</p>
              )}
            </div>
          )}

          <div className="flex gap-3">
            {t.phase === "idle" ? (
              <button onClick={handleStart} className="flex-1 py-4 bg-brand text-brand-foreground rounded-2xl font-bold inline-flex items-center justify-center gap-2">
                <Play className="size-5" /> Mulai Sesi
              </button>
            ) : (
              <>
                <button
                  onClick={async () => {
                    if (t.running) {
                      await t.pause();
                      lb.refetch();
                    } else {
                      t.resume();
                    }
                  }}
                  className="flex-1 py-4 bg-brand text-brand-foreground rounded-2xl font-bold inline-flex items-center justify-center gap-2"
                >
                  {t.running ? <><Pause className="size-5" /> Jeda</> : <><Play className="size-5" /> Lanjut</>}
                </button>
                <button onClick={handleEnd} className="px-5 py-4 border-2 border-brand/15 rounded-2xl font-bold hover:bg-destructive/10 hover:border-destructive hover:text-destructive">
                  <RotateCcw className="size-5" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-card rounded-3xl border border-brand/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-lg flex items-center gap-2"><Trophy className="size-5 text-diva" /> Papan Belajar</h2>
          </div>
          <div className="inline-flex rounded-xl border border-brand/15 bg-surface overflow-hidden mb-4">
            {(["today", "week", "all"] as const).map((tk) => (
              <button
                key={tk}
                onClick={() => setTab(tk)}
                className={"px-3 py-1.5 text-xs font-bold " + (tab === tk ? "bg-brand text-brand-foreground" : "text-brand/60 hover:text-accent")}
              >
                {tk === "today" ? "Hari Ini" : tk === "week" ? "7 Hari" : "All Time"}
              </button>
            ))}
          </div>
          <p className="text-xs text-brand/60 mb-3">
            Total kamu: <span className="font-bold text-brand">{formatHMS(myTotal ?? 0)}</span>
          </p>
          <ol className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {lb.isLoading && <li className="text-xs text-brand/40">Memuat…</li>}
            {(board ?? []).slice(0, 20).map((row, i) => (
              <li key={row.user_id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent/5">
                <span className={"size-7 grid place-items-center rounded-full text-xs font-black " + (i < 3 ? "bg-diva text-diva-foreground" : "bg-brand/10 text-brand")}>{i + 1}</span>
                {row.profile?.avatar_url ? (
                  <img src={row.profile.avatar_url} alt="" className="size-7 rounded-full" />
                ) : (
                  <div className="size-7 rounded-full bg-accent/20 grid place-items-center text-[10px] font-bold text-accent">
                    {(row.profile?.display_name ?? "?").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate">{row.profile?.display_name ?? "Pelajar"}</div>
                  {row.profile?.school && <div className="text-[10px] text-brand/40 truncate">{row.profile.school}</div>}
                </div>
                <span className="text-sm font-bold tabular-nums">{formatHMS(row.seconds)}</span>
              </li>
            ))}
            {!lb.isLoading && !(board ?? []).length && (
              <li className="text-xs text-brand/40">Belum ada yang belajar. Jadilah yang pertama!</li>
            )}
          </ol>
        </div>
      </div>

      {coachMsg && (
        <div className="fixed bottom-6 right-6 max-w-sm bg-card border-2 border-accent rounded-3xl shadow-2xl shadow-accent/20 p-5 z-50">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-accent text-accent-foreground grid place-items-center shrink-0">
              <Sparkles className="size-5" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold uppercase text-accent mb-1">Pomodoro Coach</div>
              <p className="text-sm">{coachMsg}</p>
              {t.phase === "focus" && !t.running && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => { t.startBreak(); setCoachMsg(null); }} className="flex-1 py-2 bg-brand text-brand-foreground rounded-xl text-sm font-bold">
                    Ya, istirahat 5 menit
                  </button>
                  <button onClick={() => { t.resume(); setCoachMsg(null); }} className="flex-1 py-2 border border-brand/15 rounded-xl text-sm font-bold hover:bg-accent/10">
                    Lanjut belajar
                  </button>
                </div>
              )}
            </div>
            <button onClick={() => setCoachMsg(null)} className="text-brand/40 hover:text-destructive">
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}

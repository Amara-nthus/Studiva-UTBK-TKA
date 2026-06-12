import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useServerFn } from "./createSsrRpc-QeTLlYSS.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-D8QFwA2R.mjs";
import { u as useStudyTimer, f as formatHMS, g as getStudyLeaderboard } from "./StudyTimerProvider-BqscofFv.mjs";
import { p as pomodoroCoach } from "./chatbot.functions-Dm1l8__l.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { T as Timer, P as Play, b as Pause, R as RotateCcw, a as Trophy, S as Sparkles, X } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "./server-DDQ41ls2.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./client-D5O_ac7f.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./auth-middleware-CuXDYw0K.mjs";
import "../_libs/zod.mjs";
function TimerPage() {
  const coachFn = useServerFn(pomodoroCoach);
  const lbFn = useServerFn(getStudyLeaderboard);
  const lb = useQuery({
    queryKey: ["study-lb"],
    queryFn: () => lbFn()
  });
  const t = useStudyTimer();
  const [coachMsg, setCoachMsg] = reactExports.useState(null);
  const [tab, setTab] = reactExports.useState("today");
  reactExports.useEffect(() => {
    if (t.running && t.elapsed >= t.targetSec) {
      t.pause().then(() => askCoach(t.phase === "focus" ? "focus_done" : "break_done"));
    }
  }, [t.elapsed, t.targetSec, t.running, t.phase]);
  async function askCoach(p) {
    try {
      const minutes = Math.floor(t.totalSeconds / 60);
      const {
        message
      } = await coachFn({
        data: {
          phase: p,
          mood: t.mood,
          minutesStudied: minutes
        }
      });
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
  const progress = Math.min(100, t.elapsed / t.targetSec * 100);
  const board = tab === "today" ? lb.data?.today : tab === "week" ? lb.data?.week : lb.data?.all;
  const myTotal = tab === "today" ? lb.data?.mine.today : tab === "week" ? lb.data?.mine.week : lb.data?.mine.all;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl font-extrabold flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "size-9 text-accent" }),
        " Study Timer"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/60 mt-2", children: "Timer tetap berjalan selama tab Studiva terbuka — pindah halaman tetap aman." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[1fr_360px] gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-3xl border border-brand/5 p-8 shadow-xl shadow-brand/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold uppercase tracking-widest text-brand/50", children: t.phase === "idle" ? "Siap mulai" : t.phase === "focus" ? "Sesi Fokus" : "Istirahat" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-brand/50", children: [
            "Akumulasi sesi: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-brand", children: formatHMS(t.totalSeconds) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center my-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-7xl md:text-8xl font-black tabular-nums tracking-tight", children: formatHMS(Math.max(0, t.targetSec - t.elapsed)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-brand/50 mt-2", children: [
            "Target ",
            Math.round(t.targetSec / 60),
            " menit"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 h-2 bg-brand/10 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-accent transition-all", style: {
            width: `${progress}%`
          } }) })
        ] }),
        t.phase === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold uppercase text-brand/50 mb-2", children: "Mood-mu sekarang?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: ["fresh", "ok", "tired", "stressed"].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => t.setMood(m), className: "px-3 py-2 rounded-xl border-2 text-sm font-bold capitalize transition " + (t.mood === m ? "border-accent bg-accent/10" : "border-brand/10 hover:border-accent/40"), children: m === "fresh" ? "😊 Fresh" : m === "ok" ? "🙂 OK" : m === "tired" ? "😴 Capek" : "😖 Stress" }, m)) }),
          (t.mood === "tired" || t.mood === "stressed") && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-accent mt-2", children: "AI akan otomatis membuat sesi lebih ringan (15 menit)." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: t.phase === "idle" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleStart, className: "flex-1 py-4 bg-brand text-brand-foreground rounded-2xl font-bold inline-flex items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "size-5" }),
          " Mulai Sesi"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
            if (t.running) {
              await t.pause();
              lb.refetch();
            } else {
              t.resume();
            }
          }, className: "flex-1 py-4 bg-brand text-brand-foreground rounded-2xl font-bold inline-flex items-center justify-center gap-2", children: t.running ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "size-5" }),
            " Jeda"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "size-5" }),
            " Lanjut"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleEnd, className: "px-5 py-4 border-2 border-brand/15 rounded-2xl font-bold hover:bg-destructive/10 hover:border-destructive hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "size-5" }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-3xl border border-brand/5 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-extrabold text-lg flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "size-5 text-diva" }),
          " Papan Belajar"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex rounded-xl border border-brand/15 bg-surface overflow-hidden mb-4", children: ["today", "week", "all"].map((tk) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab(tk), className: "px-3 py-1.5 text-xs font-bold " + (tab === tk ? "bg-brand text-brand-foreground" : "text-brand/60 hover:text-accent"), children: tk === "today" ? "Hari Ini" : tk === "week" ? "7 Hari" : "All Time" }, tk)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-brand/60 mb-3", children: [
          "Total kamu: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-brand", children: formatHMS(myTotal ?? 0) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "space-y-2 max-h-[420px] overflow-y-auto pr-1", children: [
          lb.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-xs text-brand/40", children: "Memuat…" }),
          (board ?? []).slice(0, 20).map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3 p-2 rounded-xl hover:bg-accent/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-7 grid place-items-center rounded-full text-xs font-black " + (i < 3 ? "bg-diva text-diva-foreground" : "bg-brand/10 text-brand"), children: i + 1 }),
            row.profile?.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: row.profile.avatar_url, alt: "", className: "size-7 rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-7 rounded-full bg-accent/20 grid place-items-center text-[10px] font-bold text-accent", children: (row.profile?.display_name ?? "?").charAt(0).toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold truncate", children: row.profile?.display_name ?? "Pelajar" }),
              row.profile?.school && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-brand/40 truncate", children: row.profile.school })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold tabular-nums", children: formatHMS(row.seconds) })
          ] }, row.user_id)),
          !lb.isLoading && !(board ?? []).length && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-xs text-brand/40", children: "Belum ada yang belajar. Jadilah yang pertama!" })
        ] })
      ] })
    ] }),
    coachMsg && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-6 right-6 max-w-sm bg-card border-2 border-accent rounded-3xl shadow-2xl shadow-accent/20 p-5 z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-xl bg-accent text-accent-foreground grid place-items-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold uppercase text-accent mb-1", children: "Pomodoro Coach" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: coachMsg }),
        t.phase === "focus" && !t.running && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            t.startBreak();
            setCoachMsg(null);
          }, className: "flex-1 py-2 bg-brand text-brand-foreground rounded-xl text-sm font-bold", children: "Ya, istirahat 5 menit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            t.resume();
            setCoachMsg(null);
          }, className: "flex-1 py-2 border border-brand/15 rounded-xl text-sm font-bold hover:bg-accent/10", children: "Lanjut belajar" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCoachMsg(null), className: "text-brand/40 hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
    ] }) })
  ] });
}
export {
  TimerPage as component
};

import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useServerFn } from "./createSsrRpc-QeTLlYSS.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-D8QFwA2R.mjs";
import { u as updateProfile, s as submitDailyQuiz, a as getDashboard, b as getTodayQuiz } from "./studiva.functions-DrlDFqdk.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { F as Flame, S as Sparkles, a as Trophy, c as Target } from "../_libs/lucide-react.mjs";
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
function Dashboard() {
  const fetchDash = useServerFn(getDashboard);
  const fetchQuiz = useServerFn(getTodayQuiz);
  const submitQuiz = useServerFn(submitDailyQuiz);
  const updateProf = useServerFn(updateProfile);
  const dash = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchDash()
  });
  const quiz = useQuery({
    queryKey: ["daily-quiz"],
    queryFn: () => fetchQuiz()
  });
  const [chosen, setChosen] = reactExports.useState(null);
  const [result, setResult] = reactExports.useState(null);
  const profile = dash.data?.profile;
  const stats = dash.data?.stats;
  async function handleAnswer() {
    if (chosen == null || !quiz.data?.quiz) return;
    try {
      const r = await submitQuiz({
        data: {
          quizId: quiz.data.quiz.id,
          chosenIndex: chosen
        }
      });
      setResult(r);
      toast.success(r.isCorrect ? `Benar! +10 EXP · Streak ${r.streak}🔥` : `Yuk lanjut besok! +2 EXP`);
      dash.refetch();
      quiz.refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal mengirim jawaban");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-3 bg-brand text-brand-foreground rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-diva text-xs font-bold uppercase tracking-widest mb-2", children: "Selamat datang" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl md:text-4xl font-extrabold", children: [
          "Halo, ",
          profile?.display_name ?? "Pelajar",
          " 👋"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/70 mt-2", children: [
          "Pelajar SMA · ",
          profile?.school ?? "Atur sekolahmu di profil"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-center gap-4 md:gap-6 mt-4 md:mt-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "text-diva" }), label: "Streak", value: `${stats?.streak_current ?? 0}🔥` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "text-diva" }), label: "EXP", value: stats?.exp ?? 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "text-diva" }), label: "SNBT", value: stats?.snbt_best ?? 0 })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 bg-card rounded-3xl border border-brand/5 p-6 shadow-xl shadow-brand/5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-extrabold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "size-5 text-accent" }),
          " Kuis Harian"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-brand/40 uppercase", children: quiz.data?.quiz?.subject })
      ] }),
      quiz.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/40", children: "Memuat…" }) : !quiz.data?.quiz ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/60", children: "Belum ada soal hari ini. Cek lagi besok!" }) : quiz.data.attempt || result ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold mb-4", children: quiz.data.quiz.question }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: quiz.data.quiz.options.map((opt, i) => {
          const correctIdx = result?.answerIndex ?? -1;
          const myChoice = result ? chosen : quiz.data?.attempt?.chosen_index;
          const isCorrect = i === correctIdx;
          const isMine = i === myChoice;
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-xl border-2 text-sm " + (isCorrect ? "border-green-500 bg-green-500/10" : isMine ? "border-destructive bg-destructive/10" : "border-brand/10"), children: opt }, i);
        }) }),
        result?.explanation && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 p-4 rounded-xl bg-accent/5 text-sm", children: result.explanation }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-brand/50 mt-4", children: "Selesai untuk hari ini ✅ — kunjungi lagi besok untuk menjaga streak." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold mb-4", children: quiz.data.quiz.question }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 mb-4", children: quiz.data.quiz.options.map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setChosen(i), className: "w-full text-left p-3 rounded-xl border-2 text-sm transition " + (chosen === i ? "border-accent bg-accent/10 font-semibold" : "border-brand/10 hover:border-accent/40"), children: opt }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: chosen == null, onClick: handleAnswer, className: "w-full py-3 bg-brand text-brand-foreground rounded-xl font-bold disabled:opacity-40", children: "Kirim jawaban" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-3xl border border-brand/5 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-extrabold mb-4", children: "Target Kampus" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-3", onSubmit: async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        try {
          await updateProf({
            data: {
              display_name: String(fd.get("display_name") ?? profile?.display_name ?? "Pelajar"),
              school: String(fd.get("school") ?? ""),
              target_university: String(fd.get("target_university") ?? ""),
              target_major: String(fd.get("target_major") ?? "")
            }
          });
          toast.success("Profil tersimpan");
          dash.refetch();
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
        }
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { name: "display_name", label: "Nama", defaultValue: profile?.display_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { name: "school", label: "Sekolah", defaultValue: profile?.school ?? "" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { name: "target_university", label: "PTN Target", defaultValue: profile?.target_university ?? "" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { name: "target_major", label: "Jurusan Target", defaultValue: profile?.target_major ?? "" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full py-2.5 bg-accent text-accent-foreground rounded-xl font-bold text-sm", children: "Simpan" })
      ] })
    ] })
  ] }) });
}
function Stat({
  icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1 text-2xl font-extrabold", children: [
      icon,
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: value })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase font-bold tracking-widest text-white/50", children: label })
  ] });
}
function Field({
  name,
  label,
  defaultValue
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase text-brand/50", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name, defaultValue: defaultValue ?? "", className: "mt-1 w-full px-3 py-2 rounded-lg border border-brand/15 bg-surface text-sm focus:outline-none focus:border-accent" })
  ] });
}
export {
  Dashboard as component
};

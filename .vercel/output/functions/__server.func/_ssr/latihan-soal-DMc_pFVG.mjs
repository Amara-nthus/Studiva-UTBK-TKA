import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useServerFn, c as createSsrRpc } from "./createSsrRpc-QeTLlYSS.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-D8QFwA2R.mjs";
import { a as createServerFn } from "./server-DDQ41ls2.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CuXDYw0K.mjs";
import { a as analyzeWeakness } from "./weakness.functions-BKhESXGo.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { a as Trophy, F as Flame, L as LoaderCircle, S as Sparkles } from "../_libs/lucide-react.mjs";
import { o as objectType, e as enumType, r as recordType, s as stringType, n as numberType } from "../_libs/zod.mjs";
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
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const startSimulation = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  type: enumType(["snbt", "tka"])
}).parse(input)).handler(createSsrRpc("bb4a5542eab2054f80c94c705f47d6cd0beb888bd4421dde36bc2e6848b706b2"));
const getSimulationQuestions = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  simulationId: stringType().uuid()
}).parse(input)).handler(createSsrRpc("0391a6e08109195a884035fd0ef091988b2e00c70ecbecd06c24e3d7725ca9f8"));
const submitSimulation = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  simulationId: stringType().uuid(),
  type: enumType(["snbt", "tka"]),
  answers: recordType(stringType().uuid(), numberType().int())
}).parse(input)).handler(createSsrRpc("b6d142b0dd0594be4e97ed924c2cdc536937ce69d58dd56b11a0b82caf0b66a1"));
function LatihanSoalPage() {
  const startFn = useServerFn(startSimulation);
  const getQ = useServerFn(getSimulationQuestions);
  const submitFn = useServerFn(submitSimulation);
  const weaknessFn = useServerFn(analyzeWeakness);
  const [type, setType] = reactExports.useState(null);
  const [simId, setSimId] = reactExports.useState(null);
  const [starting, setStarting] = reactExports.useState(false);
  const [answers, setAnswers] = reactExports.useState({});
  const [result, setResult] = reactExports.useState(null);
  const [weakness, setWeakness] = reactExports.useState(null);
  const [analyzing, setAnalyzing] = reactExports.useState(false);
  const [section, setSection] = reactExports.useState(null);
  const q = useQuery({
    queryKey: ["sim-q", simId],
    queryFn: () => getQ({
      data: {
        simulationId: simId
      }
    }),
    enabled: !!simId
  });
  async function pick(t) {
    setType(t);
    setStarting(true);
    try {
      const r = await startFn({
        data: {
          type: t
        }
      });
      setSimId(r.simulationId);
      toast.success(`${r.total} soal siap. Selamat mengerjakan!`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal memulai");
      setType(null);
    } finally {
      setStarting(false);
    }
  }
  function reset() {
    setType(null);
    setSimId(null);
    setAnswers({});
    setResult(null);
    setWeakness(null);
    setSection(null);
  }
  async function submit() {
    if (!simId || !type) return;
    try {
      const r = await submitFn({
        data: {
          simulationId: simId,
          type,
          answers
        }
      });
      setResult(r);
      toast.success(`Skor: ${r.score} · ${r.correct}/${r.total} benar`);
      setAnalyzing(true);
      try {
        const w = await weaknessFn({
          data: {
            kind: type,
            label: type === "snbt" ? "Latihan Soal SNBT" : "Latihan Soal TKA",
            wrong: r.wrong,
            correctCount: r.correct,
            total: r.total
          }
        });
        setWeakness(w);
      } catch (e) {
        toast.error("Analisis AI gagal: " + (e instanceof Error ? e.message : ""));
      } finally {
        setAnalyzing(false);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menyimpan");
    }
  }
  if (!type) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-extrabold mb-2", children: "Latihan Soal" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/60 mb-8", children: "Pilih jenis latihan soal. Soal di-generate AI sesuai blueprint resmi." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => pick("snbt"), className: "text-left p-8 bg-brand text-brand-foreground rounded-3xl hover:scale-[1.02] transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "size-10 text-diva mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-extrabold mb-2", children: "Latihan Soal SNBT" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 text-sm", children: "30 soal · 7 subtes · skor 0-800 · +50 EXP" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => pick("tka"), className: "text-left p-8 bg-diva text-diva-foreground rounded-3xl hover:scale-[1.02] transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-10 text-brand mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-extrabold mb-2", children: "Latihan Soal TKA" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/80 text-sm", children: "30 soal · 5 mata pelajaran · skor 0-800 · +50 EXP" })
        ] })
      ] })
    ] }) });
  }
  if (starting || q.isLoading && simId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl mx-auto text-center py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-12 text-accent animate-spin mx-auto mb-6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-extrabold mb-2", children: "AI sedang menyusun 30 soal…" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/60", children: "Ini bisa memakan waktu 30–60 detik. Tetap di halaman ini." })
    ] }) });
  }
  if (result) {
    const pct = Math.round(result.correct / result.total * 100);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-brand/5 rounded-3xl p-10 text-center shadow-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-bold uppercase text-accent", children: [
          "Hasil Latihan Soal ",
          type.toUpperCase()
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-7xl font-black my-6 text-brand", children: result.score }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-brand/60 mb-6", children: [
          "Benar ",
          result.correct,
          " dari ",
          result.total,
          " soal (",
          pct,
          "%)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 gap-2 mb-6 text-left", children: result.perSection.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface rounded-xl p-3 border border-brand/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-brand/60", children: s.section }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-lg font-extrabold", children: [
            s.correct,
            "/",
            s.total
          ] })
        ] }, s.section)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: reset, className: "px-6 py-3 bg-brand text-brand-foreground rounded-xl font-bold", children: "Coba lagi" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-2 border-accent/30 rounded-3xl p-8 shadow-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-extrabold mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-5 text-accent" }),
          " Analisis Kelemahan AI"
        ] }),
        analyzing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-brand/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
          " AI sedang menganalisis polamu…"
        ] }) : weakness ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/80", children: weakness.summary }),
          weakness.weak_topics.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: weakness.weak_topics.map((w, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-surface rounded-xl border border-brand/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-accent mb-1", children: w.topic }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-brand/70 mb-2", children: w.why }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold", children: [
              "💡 ",
              w.recommendation
            ] })
          ] }, i)) }),
          weakness.suggested_drills.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold uppercase text-brand/50 mb-2", children: "Saran latihan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc list-inside space-y-1 text-sm", children: weakness.suggested_drills.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: d }, i)) })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/40 text-sm", children: "Tidak ada analisis." })
      ] })
    ] }) });
  }
  const questions = q.data?.questions ?? [];
  const sections = Array.from(new Set(questions.map((qq) => qq.section)));
  const active = section ?? sections[0] ?? null;
  const visible = active ? questions.filter((qq) => qq.section === active) : questions;
  const answered = Object.keys(answers).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6 flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-extrabold", children: [
        "Latihan Soal ",
        type.toUpperCase()
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-brand/50", children: [
        answered,
        "/",
        questions.length,
        " terjawab"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap mb-6 sticky top-20 bg-surface/90 backdrop-blur py-2 z-20 -mx-2 px-2 rounded-xl", children: sections.map((s) => {
      const total = questions.filter((qq) => qq.section === s).length;
      const done = questions.filter((qq) => qq.section === s && answers[qq.id] != null).length;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSection(s), className: "px-3 py-1.5 rounded-full text-xs font-bold border-2 transition " + (s === active ? "border-accent bg-accent text-accent-foreground" : "border-brand/10 hover:border-accent/40 text-brand/70"), children: [
        s,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "opacity-60", children: [
          done,
          "/",
          total
        ] })
      ] }, s);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: visible.map((qq, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-brand/5 rounded-2xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-accent mr-2", children: [
          i + 1,
          "."
        ] }),
        qq.question
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 gap-2", children: qq.options.map((opt, oi) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setAnswers((a) => ({
        ...a,
        [qq.id]: oi
      })), className: "text-left p-3 rounded-xl border-2 text-sm transition " + (answers[qq.id] === oi ? "border-accent bg-accent/10 font-semibold" : "border-brand/10 hover:border-accent/40"), children: opt }, oi)) })
    ] }, qq.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: submit, className: "mt-6 w-full py-4 bg-brand text-brand-foreground rounded-2xl font-bold", children: [
      "Selesai & lihat skor (",
      answered,
      "/",
      questions.length,
      ")"
    ] })
  ] }) });
}
export {
  LatihanSoalPage as component
};

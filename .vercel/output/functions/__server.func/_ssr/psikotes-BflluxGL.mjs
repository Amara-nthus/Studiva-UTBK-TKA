import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useServerFn, c as createSsrRpc } from "./createSsrRpc-QeTLlYSS.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-D8QFwA2R.mjs";
import { a as createServerFn } from "./server-DDQ41ls2.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CuXDYw0K.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { B as Brain, S as Sparkles } from "../_libs/lucide-react.mjs";
import { o as objectType, r as recordType, s as stringType, n as numberType } from "../_libs/zod.mjs";
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
const PSIKOTES_QUESTIONS = [{
  id: 1,
  text: "Saya senang menganalisis angka dan memecahkan soal matematika."
}, {
  id: 2,
  text: "Saya tertarik dengan eksperimen sains & laboratorium."
}, {
  id: 3,
  text: "Saya suka menggambar, mendesain, atau membuat sesuatu yang artistik."
}, {
  id: 4,
  text: "Saya nyaman berbicara di depan banyak orang."
}, {
  id: 5,
  text: "Saya senang membantu orang lain memahami sesuatu (mengajar)."
}, {
  id: 6,
  text: "Saya tertarik pada cara kerja komputer dan teknologi."
}, {
  id: 7,
  text: "Saya suka membaca buku non-fiksi, sejarah, atau filsafat."
}, {
  id: 8,
  text: "Saya tertarik pada bisnis, ekonomi, dan kewirausahaan."
}, {
  id: 9,
  text: "Saya peka terhadap isu sosial dan ingin memberi dampak."
}, {
  id: 10,
  text: "Saya senang merancang struktur, bangunan, atau sistem."
}, {
  id: 11,
  text: "Saya suka pekerjaan yang berhubungan dengan kesehatan & tubuh manusia."
}, {
  id: 12,
  text: "Saya nyaman bekerja sendiri dengan fokus mendalam."
}, {
  id: 13,
  text: "Saya senang bahasa asing dan komunikasi lintas budaya."
}, {
  id: 14,
  text: "Saya suka memimpin kelompok dan mengambil keputusan."
}, {
  id: 15,
  text: "Saya tertarik hukum, kebijakan publik, atau pemerintahan."
}];
const runPsikotes = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  answers: recordType(stringType(), numberType().int().min(1).max(5))
}).parse(input)).handler(createSsrRpc("af6cc0034ba70c96f8ac12e947d15d1e5cd9ec4f0cf2c3278b0dbe1a20940b91"));
const getLatestPsikotes = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("57282559122b77d8ed744ef6b56fff4c5a46f6d9722fa006ec68a92af61d8b7e"));
function PsikotesPage() {
  const latestFn = useServerFn(getLatestPsikotes);
  const runFn = useServerFn(runPsikotes);
  const latest = useQuery({
    queryKey: ["psikotes-latest"],
    queryFn: () => latestFn()
  });
  const [answers, setAnswers] = reactExports.useState({});
  const [loading, setLoading] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  async function submit() {
    if (Object.keys(answers).length < PSIKOTES_QUESTIONS.length) {
      toast.error("Jawab semua pertanyaan dulu");
      return;
    }
    setLoading(true);
    try {
      const r = await runFn({
        data: {
          answers
        }
      });
      setResult(r);
      latest.refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menganalisis");
    } finally {
      setLoading(false);
    }
  }
  const shown = result ?? latest.data?.result?.recommendations;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl font-extrabold flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "size-9 text-accent" }),
        " Psikotes & Minat Bakat"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/60 mt-2", children: "Jawab 15 pernyataan jujur, AI rekomendasikan jurusan paling cocok." })
    ] }),
    shown && !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-brand text-brand-foreground rounded-3xl p-8 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-diva text-xs font-bold uppercase mb-2", children: "Profil Kamu" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg", children: shown.summary })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-4", children: shown.recommendations.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-brand/5 rounded-2xl p-6 shadow-xl shadow-brand/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-extrabold", children: r.major }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-3xl font-black text-accent", children: [
            r.match,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-brand/60 mb-3", children: r.reason }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: r.sample_universities.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold bg-diva/10 text-brand px-2 py-0.5 rounded-full", children: u }, u)) })
      ] }, r.major)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        setResult(null);
        setAnswers({});
      }, className: "mt-6 text-sm font-bold text-accent hover:underline", children: "Kerjakan ulang" })
    ] }),
    !shown && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-3xl border border-brand/5 p-6 md:p-8 shadow-xl shadow-brand/5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-5", children: PSIKOTES_QUESTIONS.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-5 border-b border-brand/5 last:border-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-accent mr-2", children: [
            q.id,
            "."
          ] }),
          q.text
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: [1, 2, 3, 4, 5].map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setAnswers((a) => ({
          ...a,
          [String(q.id)]: v
        })), className: "flex-1 py-2 rounded-lg text-sm font-bold border-2 transition " + (answers[String(q.id)] === v ? "border-accent bg-accent text-accent-foreground" : "border-brand/10 hover:border-accent/40"), children: v }, v)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] uppercase font-bold text-brand/40 mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sangat tidak setuju" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sangat setuju" })
        ] })
      ] }, q.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: loading, onClick: submit, className: "mt-6 w-full py-4 bg-brand text-brand-foreground rounded-2xl font-bold disabled:opacity-40 flex items-center justify-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-5" }),
        loading ? "AI sedang menganalisis…" : "Analisis dengan AI"
      ] })
    ] })
  ] });
}
export {
  PsikotesPage as component
};

import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn } from "./createSsrRpc-QeTLlYSS.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-D8QFwA2R.mjs";
import { d as deleteNote, s as submitNoteQuiz, g as getNote } from "./notes.functions-CPys7pPB.mjs";
import { a as analyzeWeakness } from "./weakness.functions-BKhESXGo.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as Route } from "./router-CnvdVWMk.mjs";
import "../_libs/seroval.mjs";
import { k as ArrowLeft, l as Trash2, R as RotateCcw, S as Sparkles, L as LoaderCircle } from "../_libs/lucide-react.mjs";
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
function NoteDetail() {
  const {
    id
  } = Route.useParams();
  const router = useRouter();
  const fn = useServerFn(getNote);
  const submit = useServerFn(submitNoteQuiz);
  const del = useServerFn(deleteNote);
  const weaknessFn = useServerFn(analyzeWeakness);
  const q = useQuery({
    queryKey: ["note", id],
    queryFn: () => fn({
      data: {
        id
      }
    })
  });
  const [flipped, setFlipped] = reactExports.useState({});
  const [answers, setAnswers] = reactExports.useState({});
  const [result, setResult] = reactExports.useState(null);
  const [weakness, setWeakness] = reactExports.useState(null);
  const [analyzing, setAnalyzing] = reactExports.useState(false);
  async function handleSubmit() {
    if (!q.data?.quiz.length) return;
    const payload = q.data.quiz.map((qz) => ({
      quizId: qz.id,
      chosen: answers[qz.id] ?? -1
    }));
    try {
      const r = await submit({
        data: {
          noteId: id,
          answers: payload
        }
      });
      setResult(r);
      toast.success(`${r.correct}/${r.total} benar · +${r.correct * 5} EXP`);
      const wrong = q.data.quiz.filter((qz) => answers[qz.id] !== qz.answer_index).map((qz) => ({
        question: qz.question,
        chosen: answers[qz.id] != null ? qz.options[answers[qz.id]] : void 0,
        correct: qz.options[qz.answer_index]
      }));
      setAnalyzing(true);
      try {
        const w = await weaknessFn({
          data: {
            kind: "note_quiz",
            label: q.data.note?.title ?? "Kuis Catatan",
            wrong,
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
      toast.error(e instanceof Error ? e.message : "Gagal");
    }
  }
  async function handleDelete() {
    if (!confirm("Hapus catatan ini permanen?")) return;
    try {
      await del({
        data: {
          id
        }
      });
      toast.success("Catatan dihapus");
      router.navigate({
        to: "/catatan"
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal hapus");
    }
  }
  if (q.isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/40", children: "Memuat…" }) });
  if (!q.data?.note) return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Catatan tidak ditemukan." }) });
  const {
    note,
    cards,
    quiz: quizzes,
    imageUrl,
    owner,
    isOwner
  } = q.data;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/catatan", className: "inline-flex items-center gap-1 text-sm text-brand/60 hover:text-accent mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
      " Kembali ke pustaka"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-6 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-extrabold mb-3", children: note.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          owner?.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: owner.avatar_url, alt: "", className: "size-9 rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-full bg-accent/20 grid place-items-center text-sm font-bold text-accent", children: (owner?.display_name ?? "?").charAt(0).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-bold", children: [
              owner?.display_name ?? "Pelajar",
              " ",
              isOwner && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-accent ml-1", children: "· kamu" })
            ] }),
            owner?.school && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-brand/50", children: owner.school })
          ] }),
          isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleDelete, className: "ml-auto text-xs font-bold text-destructive hover:underline inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }),
            " Hapus"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/70", children: note.summary ?? "Belum diproses." })
      ] }),
      imageUrl && ((note.mime_type ?? "").startsWith("image/") || /\.(jpe?g|png|webp|gif|bmp)$/i.test(note.image_path ?? "") ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imageUrl, alt: note.title, className: "w-full aspect-square object-cover rounded-2xl border border-brand/10" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: imageUrl, target: "_blank", rel: "noreferrer", className: "block aspect-square rounded-2xl border-2 border-dashed border-brand/15 grid place-items-center text-center p-6 hover:border-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-2", children: "📄" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-brand/70", children: "Buka berkas asli" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-brand/40 mt-1", children: note.mime_type ?? "berkas" })
      ] }) }))
    ] }),
    note.status === "failed" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-destructive/10 border border-destructive/30 text-destructive rounded-2xl p-4 mb-6", children: "Analisis AI gagal pada catatan ini." }),
    cards.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-extrabold mb-4", children: [
        "Flashcard (",
        cards.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: cards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setFlipped((s) => ({
        ...s,
        [c.id]: !s[c.id]
      })), className: "text-left min-h-[180px] p-5 rounded-2xl bg-card border border-brand/10 hover:border-accent transition flex flex-col justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase text-accent", children: flipped[c.id] ? "Jawaban" : "Pertanyaan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold mt-2", children: flipped[c.id] ? c.back : c.front }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-brand/40 inline-flex items-center gap-1 mt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "size-3" }),
          " Klik untuk balik"
        ] })
      ] }, c.id)) })
    ] }),
    quizzes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-extrabold mb-4", children: "Kuis dari Catatan" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: quizzes.map((qz, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-brand/10 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-accent mr-2", children: [
            i + 1,
            "."
          ] }),
          qz.question
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 gap-2", children: qz.options.map((opt, oi) => {
          const myChoice = answers[qz.id];
          const showResult = !!result;
          const isCorrect = oi === qz.answer_index;
          const isMine = oi === myChoice;
          return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: !!result, onClick: () => setAnswers((a) => ({
            ...a,
            [qz.id]: oi
          })), className: "text-left p-3 rounded-xl border-2 text-sm transition " + (showResult && isCorrect ? "border-green-500 bg-green-500/10" : showResult && isMine ? "border-destructive bg-destructive/10" : isMine ? "border-accent bg-accent/10 font-semibold" : "border-brand/10 hover:border-accent/40"), children: opt }, oi);
        }) }),
        result && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-brand/60 italic", children: qz.explanation })
      ] }, qz.id)) }),
      !result ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: Object.keys(answers).length < quizzes.length, onClick: handleSubmit, className: "mt-6 w-full py-4 bg-brand text-brand-foreground rounded-2xl font-bold disabled:opacity-40", children: "Selesai · cek skor" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 p-6 bg-diva/10 rounded-2xl text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-4xl font-black", children: [
            result.correct,
            "/",
            result.total
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-brand/60 mt-1", children: [
            "Mantap! +",
            result.correct * 5,
            " EXP"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 bg-card border-2 border-accent/30 rounded-3xl p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-extrabold mb-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-5 text-accent" }),
            " Analisis Kelemahan AI"
          ] }),
          analyzing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-brand/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
            " Menganalisis…"
          ] }) : weakness ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/80 text-sm", children: weakness.summary }),
            weakness.weak_topics.map((w, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-surface rounded-xl border border-brand/5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-accent text-sm", children: w.topic }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-brand/70 mt-1", children: w.why }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold mt-1", children: [
                "💡 ",
                w.recommendation
              ] })
            ] }, i)),
            weakness.suggested_drills.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc list-inside text-xs space-y-1", children: weakness.suggested_drills.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: d }, i)) })
          ] }) : null
        ] })
      ] })
    ] })
  ] });
}
export {
  NoteDetail as component
};

import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useServerFn } from "./createSsrRpc-QeTLlYSS.mjs";
import { A as AppShell } from "./AppShell-D8QFwA2R.mjs";
import { c as chatbotReply } from "./chatbot.functions-Dm1l8__l.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { R as RotateCcw, M as MessageCircle, S as Sparkles, d as Send } from "../_libs/lucide-react.mjs";
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
const PERSONAS = [{
  id: "friendly",
  label: "Ramah",
  desc: "Kakak kelas yang suportif"
}, {
  id: "strict",
  label: "Tegas",
  desc: "Guru bimbel killer"
}, {
  id: "fun",
  label: "Santai",
  desc: "Bahasa gaul, suka humor"
}, {
  id: "mentor",
  label: "Mentor",
  desc: "Analitis & profesional"
}];
const STORAGE_KEY = "studiva-chat-v1";
function ChatbotPage() {
  const send = useServerFn(chatbotReply);
  const [messages, setMessages] = reactExports.useState([]);
  const [persona, setPersona] = reactExports.useState("friendly");
  const [custom, setCustom] = reactExports.useState("");
  const [input, setInput] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const scrollRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved.messages)) setMessages(saved.messages);
        if (saved.persona) setPersona(saved.persona);
        if (saved.custom) setCustom(saved.custom);
      }
    } catch {
    }
  }, []);
  reactExports.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      messages,
      persona,
      custom
    }));
  }, [messages, persona, custom]);
  reactExports.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, loading]);
  async function submit() {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, {
      role: "user",
      content: text
    }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const {
        reply
      } = await send({
        data: {
          messages: next.slice(-20),
          personality: persona,
          customPersona: custom.trim() || void 0
        }
      });
      setMessages([...next, {
        role: "assistant",
        content: reply
      }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menjawab");
      setMessages(next);
    } finally {
      setLoading(false);
    }
  }
  function reset() {
    if (!confirm("Mulai obrolan baru? Riwayat sekarang akan dihapus.")) return;
    setMessages([]);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[280px_1fr] gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "bg-card border border-brand/5 rounded-3xl p-5 h-fit", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-extrabold uppercase tracking-widest text-brand/50 mb-3", children: "Kepribadian AI" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 mb-4", children: PERSONAS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setPersona(p.id), className: "w-full text-left p-3 rounded-xl border-2 transition " + (persona === p.id ? "border-accent bg-accent/10" : "border-brand/10 hover:border-accent/40"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm", children: p.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-brand/60", children: p.desc })
      ] }, p.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase text-brand/50", children: "Persona Custom" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: custom, onChange: (e) => setCustom(e.target.value), maxLength: 300, placeholder: "Mis. 'Seperti coach motivasi yang ceria & pakai analogi sepak bola'", className: "mt-1 w-full p-3 rounded-xl border border-brand/15 bg-surface text-sm h-24 resize-none focus:outline-none focus:border-accent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-brand/40", children: "Custom akan menimpa preset di atas." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: reset, className: "mt-4 w-full py-2 text-xs font-bold text-brand/60 hover:text-destructive flex items-center justify-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "size-3" }),
        " Mulai obrolan baru"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-brand/5 rounded-3xl flex flex-col min-h-[70vh] max-h-[80vh] shadow-xl shadow-brand/5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-b border-brand/5 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-xl bg-brand text-brand-foreground grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-extrabold", children: "Konsultasi Studiva AI" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-brand/50", children: "Khusus UTBK, TKA, materi SMA & kampus. Pertanyaan di luar topik akan ditolak." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: scrollRef, className: "flex-1 overflow-y-auto p-5 space-y-4", children: [
        messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full grid place-items-center text-center px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-10 text-accent mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold mb-1", children: "Tanya apa saja seputar belajar 👋" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-brand/60", children: 'Contoh: "Jelaskan turunan parsial dengan analogi", "Tips strategi waktu di subtes PU", "Jurusan apa cocok kalau aku suka data?"' })
        ] }) }) : messages.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex " + (m.role === "user" ? "justify-end" : "justify-start"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-[85%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap " + (m.role === "user" ? "bg-brand text-brand-foreground rounded-br-sm" : "bg-surface border border-brand/10 rounded-bl-sm"), children: m.content }) }, i)),
        loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-surface border border-brand/10 px-4 py-3 rounded-2xl text-sm text-brand/50 inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full bg-accent animate-pulse" }),
          "Sedang mengetik…"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        submit();
      }, className: "p-4 border-t border-brand/5 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: input, onChange: (e) => setInput(e.target.value), placeholder: "Tulis pertanyaan…", disabled: loading, className: "flex-1 px-4 py-3 rounded-xl border border-brand/15 bg-surface focus:outline-none focus:border-accent disabled:opacity-50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: loading || !input.trim(), className: "px-4 py-3 bg-brand text-brand-foreground rounded-xl font-bold disabled:opacity-40 inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-4" }),
          " Kirim"
        ] })
      ] })
    ] })
  ] }) });
}
export {
  ChatbotPage as component
};

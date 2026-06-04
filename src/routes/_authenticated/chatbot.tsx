import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { chatbotReply } from "@/lib/chatbot.functions";
import { MessageCircle, Send, Sparkles, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/chatbot")({
  component: ChatbotPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const PERSONAS = [
  { id: "friendly", label: "Ramah", desc: "Kakak kelas yang suportif" },
  { id: "strict", label: "Tegas", desc: "Guru bimbel killer" },
  { id: "fun", label: "Santai", desc: "Bahasa gaul, suka humor" },
  { id: "mentor", label: "Mentor", desc: "Analitis & profesional" },
] as const;

const STORAGE_KEY = "studiva-chat-v1";

function ChatbotPage() {
  const send = useServerFn(chatbotReply);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [persona, setPersona] = useState<typeof PERSONAS[number]["id"]>("friendly");
  const [custom, setCustom] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // restore
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved.messages)) setMessages(saved.messages);
        if (saved.persona) setPersona(saved.persona);
        if (saved.custom) setCustom(saved.custom);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, persona, custom }));
  }, [messages, persona, custom]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function submit() {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { reply } = await send({
        data: {
          messages: next.slice(-20),
          personality: persona,
          customPersona: custom.trim() || undefined,
        },
      });
      setMessages([...next, { role: "assistant", content: reply }]);
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

  return (
    <AppShell>
      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Side: personality */}
        <aside className="bg-card border border-brand/5 rounded-3xl p-5 h-fit">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-brand/50 mb-3">Kepribadian AI</h2>
          <div className="space-y-2 mb-4">
            {PERSONAS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPersona(p.id)}
                className={
                  "w-full text-left p-3 rounded-xl border-2 transition " +
                  (persona === p.id
                    ? "border-accent bg-accent/10"
                    : "border-brand/10 hover:border-accent/40")
                }
              >
                <div className="font-bold text-sm">{p.label}</div>
                <div className="text-xs text-brand/60">{p.desc}</div>
              </button>
            ))}
          </div>
          <label className="block">
            <span className="text-xs font-bold uppercase text-brand/50">Persona Custom</span>
            <textarea
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              maxLength={300}
              placeholder="Mis. 'Seperti coach motivasi yang ceria & pakai analogi sepak bola'"
              className="mt-1 w-full p-3 rounded-xl border border-brand/15 bg-surface text-sm h-24 resize-none focus:outline-none focus:border-accent"
            />
            <span className="text-[10px] text-brand/40">Custom akan menimpa preset di atas.</span>
          </label>
          <button onClick={reset} className="mt-4 w-full py-2 text-xs font-bold text-brand/60 hover:text-destructive flex items-center justify-center gap-2">
            <RotateCcw className="size-3" /> Mulai obrolan baru
          </button>
        </aside>

        {/* Chat */}
        <div className="bg-card border border-brand/5 rounded-3xl flex flex-col min-h-[70vh] max-h-[80vh] shadow-xl shadow-brand/5">
          <div className="p-5 border-b border-brand/5 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-brand text-brand-foreground grid place-items-center">
              <MessageCircle className="size-5" />
            </div>
            <div>
              <h1 className="font-extrabold">Konsultasi Studiva AI</h1>
              <p className="text-xs text-brand/50">Khusus UTBK, TKA, materi SMA & kampus. Pertanyaan di luar topik akan ditolak.</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full grid place-items-center text-center px-6">
                <div>
                  <Sparkles className="size-10 text-accent mx-auto mb-3" />
                  <p className="font-bold mb-1">Tanya apa saja seputar belajar 👋</p>
                  <p className="text-sm text-brand/60">Contoh: "Jelaskan turunan parsial dengan analogi", "Tips strategi waktu di subtes PU", "Jurusan apa cocok kalau aku suka data?"</p>
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={"flex " + (m.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={
                      "max-w-[85%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap " +
                      (m.role === "user"
                        ? "bg-brand text-brand-foreground rounded-br-sm"
                        : "bg-surface border border-brand/10 rounded-bl-sm")
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-surface border border-brand/10 px-4 py-3 rounded-2xl text-sm text-brand/50 inline-flex items-center gap-2">
                  <span className="size-2 rounded-full bg-accent animate-pulse" />
                  Sedang mengetik…
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); submit(); }}
            className="p-4 border-t border-brand/5 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pertanyaan…"
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl border border-brand/15 bg-surface focus:outline-none focus:border-accent disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-3 bg-brand text-brand-foreground rounded-xl font-bold disabled:opacity-40 inline-flex items-center gap-2"
            >
              <Send className="size-4" /> Kirim
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}

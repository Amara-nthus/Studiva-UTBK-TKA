import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { startSimulation, getSimulationQuestions, submitSimulation } from "@/lib/simulasi.functions";
import { analyzeWeakness } from "@/lib/weakness.functions";
import { toast } from "sonner";
import { Trophy, Flame, Loader2, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/simulasi")({
  component: SimulasiPage,
});

type SimType = "snbt" | "tka";

function SimulasiPage() {
  const startFn = useServerFn(startSimulation);
  const getQ = useServerFn(getSimulationQuestions);
  const submitFn = useServerFn(submitSimulation);
  const weaknessFn = useServerFn(analyzeWeakness);

  const [type, setType] = useState<SimType | null>(null);
  const [simId, setSimId] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<Awaited<ReturnType<typeof submitFn>> | null>(null);
  const [weakness, setWeakness] = useState<Awaited<ReturnType<typeof weaknessFn>> | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [section, setSection] = useState<string | null>(null);

  const q = useQuery({
    queryKey: ["sim-q", simId],
    queryFn: () => getQ({ data: { simulationId: simId! } }),
    enabled: !!simId,
  });

  async function pick(t: SimType) {
    setType(t);
    setStarting(true);
    try {
      const r = await startFn({ data: { type: t } });
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
      const r = await submitFn({ data: { simulationId: simId, type, answers } });
      setResult(r);
      toast.success(`Skor: ${r.score} · ${r.correct}/${r.total} benar`);
      // Auto-trigger weakness analysis
      setAnalyzing(true);
      try {
        const w = await weaknessFn({
          data: {
            kind: type,
            label: type === "snbt" ? "Simulasi SNBT" : "Simulasi TKA",
            wrong: r.wrong,
            correctCount: r.correct,
            total: r.total,
          },
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
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-2">Simulasi</h1>
          <p className="text-brand/60 mb-8">Pilih jenis simulasi. Soal di-generate AI sesuai blueprint resmi.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <button onClick={() => pick("snbt")} className="text-left p-8 bg-brand text-brand-foreground rounded-3xl hover:scale-[1.02] transition">
              <Trophy className="size-10 text-diva mb-4" />
              <h2 className="text-2xl font-extrabold mb-2">Simulasi SNBT</h2>
              <p className="text-white/70 text-sm">30 soal · 7 subtes · skor 0-800 · +50 EXP</p>
            </button>
            <button onClick={() => pick("tka")} className="text-left p-8 bg-diva text-diva-foreground rounded-3xl hover:scale-[1.02] transition">
              <Flame className="size-10 text-brand mb-4" />
              <h2 className="text-2xl font-extrabold mb-2">Simulasi TKA</h2>
              <p className="text-brand/80 text-sm">30 soal · 5 mata pelajaran · skor 0-800 · +50 EXP</p>
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  if (starting || (q.isLoading && simId)) {
    return (
      <AppShell>
        <div className="max-w-xl mx-auto text-center py-20">
          <Loader2 className="size-12 text-accent animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-extrabold mb-2">AI sedang menyusun 30 soal…</h2>
          <p className="text-brand/60">Ini bisa memakan waktu 30–60 detik. Tetap di halaman ini.</p>
        </div>
      </AppShell>
    );
  }

  if (result) {
    const pct = Math.round((result.correct / result.total) * 100);
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-card border border-brand/5 rounded-3xl p-10 text-center shadow-xl">
            <div className="text-xs font-bold uppercase text-accent">Hasil Simulasi {type.toUpperCase()}</div>
            <div className="text-7xl font-black my-6 text-brand">{result.score}</div>
            <p className="text-brand/60 mb-6">Benar {result.correct} dari {result.total} soal ({pct}%)</p>
            <div className="grid sm:grid-cols-2 gap-2 mb-6 text-left">
              {result.perSection.map((s) => (
                <div key={s.section} className="bg-surface rounded-xl p-3 border border-brand/5">
                  <div className="text-xs font-bold text-brand/60">{s.section}</div>
                  <div className="text-lg font-extrabold">{s.correct}/{s.total}</div>
                </div>
              ))}
            </div>
            <button onClick={reset} className="px-6 py-3 bg-brand text-brand-foreground rounded-xl font-bold">
              Coba lagi
            </button>
          </div>

          <div className="bg-card border-2 border-accent/30 rounded-3xl p-8 shadow-xl">
            <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
              <Sparkles className="size-5 text-accent" /> Analisis Kelemahan AI
            </h2>
            {analyzing ? (
              <div className="flex items-center gap-3 text-brand/60"><Loader2 className="size-4 animate-spin" /> AI sedang menganalisis polamu…</div>
            ) : weakness ? (
              <div className="space-y-4">
                <p className="text-brand/80">{weakness.summary}</p>
                {weakness.weak_topics.length > 0 && (
                  <div className="space-y-3">
                    {weakness.weak_topics.map((w, i) => (
                      <div key={i} className="p-4 bg-surface rounded-xl border border-brand/5">
                        <div className="font-bold text-accent mb-1">{w.topic}</div>
                        <p className="text-sm text-brand/70 mb-2">{w.why}</p>
                        <p className="text-sm font-semibold">💡 {w.recommendation}</p>
                      </div>
                    ))}
                  </div>
                )}
                {weakness.suggested_drills.length > 0 && (
                  <div>
                    <div className="text-xs font-bold uppercase text-brand/50 mb-2">Saran latihan</div>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {weakness.suggested_drills.map((d, i) => (<li key={i}>{d}</li>))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-brand/40 text-sm">Tidak ada analisis.</p>
            )}
          </div>
        </div>
      </AppShell>
    );
  }

  const questions = q.data?.questions ?? [];
  const sections = Array.from(new Set(questions.map((qq) => qq.section)));
  const active = section ?? sections[0] ?? null;
  const visible = active ? questions.filter((qq) => qq.section === active) : questions;
  const answered = Object.keys(answers).length;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl font-extrabold">Simulasi {type.toUpperCase()}</h1>
          <span className="text-sm font-bold text-brand/50">{answered}/{questions.length} terjawab</span>
        </div>

        <div className="flex gap-2 flex-wrap mb-6 sticky top-20 bg-surface/90 backdrop-blur py-2 z-20 -mx-2 px-2 rounded-xl">
          {sections.map((s) => {
            const total = questions.filter((qq) => qq.section === s).length;
            const done = questions.filter((qq) => qq.section === s && answers[qq.id] != null).length;
            return (
              <button
                key={s}
                onClick={() => setSection(s)}
                className={
                  "px-3 py-1.5 rounded-full text-xs font-bold border-2 transition " +
                  (s === active ? "border-accent bg-accent text-accent-foreground" : "border-brand/10 hover:border-accent/40 text-brand/70")
                }
              >
                {s} <span className="opacity-60">{done}/{total}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          {visible.map((qq, i) => (
            <div key={qq.id} className="bg-card border border-brand/5 rounded-2xl p-5">
              <p className="font-semibold mb-3">
                <span className="text-accent mr-2">{i + 1}.</span>
                {qq.question}
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {(qq.options as string[]).map((opt, oi) => (
                  <button
                    key={oi}
                    onClick={() => setAnswers((a) => ({ ...a, [qq.id]: oi }))}
                    className={
                      "text-left p-3 rounded-xl border-2 text-sm transition " +
                      (answers[qq.id] === oi
                        ? "border-accent bg-accent/10 font-semibold"
                        : "border-brand/10 hover:border-accent/40")
                    }
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={submit}
          className="mt-6 w-full py-4 bg-brand text-brand-foreground rounded-2xl font-bold"
        >
          Selesai & lihat skor ({answered}/{questions.length})
        </button>
      </div>
    </AppShell>
  );
}

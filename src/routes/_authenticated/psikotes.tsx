import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { runPsikotes, getLatestPsikotes, PSIKOTES_QUESTIONS } from "@/lib/psikotes.functions";
import { Brain, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/psikotes")({
  component: PsikotesPage,
});

interface Recommendation {
  major: string;
  match: number;
  reason: string;
  sample_universities: string[];
}

function PsikotesPage() {
  const latestFn = useServerFn(getLatestPsikotes);
  const runFn = useServerFn(runPsikotes);
  const latest = useQuery({ queryKey: ["psikotes-latest"], queryFn: () => latestFn() });

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ summary: string; recommendations: Recommendation[] } | null>(null);

  async function submit() {
    if (Object.keys(answers).length < PSIKOTES_QUESTIONS.length) {
      toast.error("Jawab semua pertanyaan dulu");
      return;
    }
    setLoading(true);
    try {
      const r = await runFn({ data: { answers } });
      setResult(r);
      latest.refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menganalisis");
    } finally {
      setLoading(false);
    }
  }

  const shown = result ?? (latest.data?.result?.recommendations as { summary: string; recommendations: Recommendation[] } | undefined);

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold flex items-center gap-3">
          <Brain className="size-9 text-accent" /> Psikotes & Minat Bakat
        </h1>
        <p className="text-brand/60 mt-2">Jawab 15 pernyataan jujur, AI rekomendasikan jurusan paling cocok.</p>
      </div>

      {shown && !loading && (
        <div className="mb-10">
          <div className="bg-brand text-brand-foreground rounded-3xl p-8 mb-6">
            <div className="text-diva text-xs font-bold uppercase mb-2">Profil Kamu</div>
            <p className="text-lg">{shown.summary}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {shown.recommendations.map((r) => (
              <div key={r.major} className="bg-card border border-brand/5 rounded-2xl p-6 shadow-xl shadow-brand/5">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-xl font-extrabold">{r.major}</h3>
                  <span className="text-3xl font-black text-accent">{r.match}%</span>
                </div>
                <p className="text-sm text-brand/60 mb-3">{r.reason}</p>
                <div className="flex flex-wrap gap-1.5">
                  {r.sample_universities.map((u) => (
                    <span key={u} className="text-[10px] font-bold bg-diva/10 text-brand px-2 py-0.5 rounded-full">{u}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setResult(null); setAnswers({}); }}
            className="mt-6 text-sm font-bold text-accent hover:underline"
          >
            Kerjakan ulang
          </button>
        </div>
      )}

      {!shown && (
        <div className="bg-card rounded-3xl border border-brand/5 p-6 md:p-8 shadow-xl shadow-brand/5">
          <div className="space-y-5">
            {PSIKOTES_QUESTIONS.map((q) => (
              <div key={q.id} className="pb-5 border-b border-brand/5 last:border-0">
                <p className="font-semibold mb-3"><span className="text-accent mr-2">{q.id}.</span>{q.text}</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      onClick={() => setAnswers((a) => ({ ...a, [String(q.id)]: v }))}
                      className={
                        "flex-1 py-2 rounded-lg text-sm font-bold border-2 transition " +
                        (answers[String(q.id)] === v
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-brand/10 hover:border-accent/40")
                      }
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] uppercase font-bold text-brand/40 mt-1">
                  <span>Sangat tidak setuju</span><span>Sangat setuju</span>
                </div>
              </div>
            ))}
          </div>
          <button
            disabled={loading}
            onClick={submit}
            className="mt-6 w-full py-4 bg-brand text-brand-foreground rounded-2xl font-bold disabled:opacity-40 flex items-center justify-center gap-2"
          >
            <Sparkles className="size-5" />
            {loading ? "AI sedang menganalisis…" : "Analisis dengan AI"}
          </button>
        </div>
      )}
    </AppShell>
  );
}

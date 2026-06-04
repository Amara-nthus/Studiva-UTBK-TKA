import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { getNote, submitNoteQuiz, deleteNote } from "@/lib/notes.functions";
import { analyzeWeakness } from "@/lib/weakness.functions";
import { ArrowLeft, RotateCcw, Trash2, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/catatan/$id")({
  component: NoteDetail,
});

function NoteDetail() {
  const { id } = Route.useParams();
  const router = useRouter();
  const fn = useServerFn(getNote);
  const submit = useServerFn(submitNoteQuiz);
  const del = useServerFn(deleteNote);
  const weaknessFn = useServerFn(analyzeWeakness);
  const q = useQuery({ queryKey: ["note", id], queryFn: () => fn({ data: { id } }) });
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ correct: number; total: number } | null>(null);
  const [weakness, setWeakness] = useState<Awaited<ReturnType<typeof weaknessFn>> | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  async function handleSubmit() {
    if (!q.data?.quiz.length) return;
    const payload = q.data.quiz.map((qz) => ({ quizId: qz.id, chosen: answers[qz.id] ?? -1 }));
    try {
      const r = await submit({ data: { noteId: id, answers: payload } });
      setResult(r);
      toast.success(`${r.correct}/${r.total} benar · +${r.correct * 5} EXP`);
      // Build wrong-answer list for weakness analysis
      const wrong = q.data.quiz
        .filter((qz) => answers[qz.id] !== qz.answer_index)
        .map((qz) => ({
          question: qz.question,
          chosen: answers[qz.id] != null ? (qz.options as string[])[answers[qz.id]] : undefined,
          correct: (qz.options as string[])[qz.answer_index],
        }));
      setAnalyzing(true);
      try {
        const w = await weaknessFn({
          data: { kind: "note_quiz", label: q.data.note?.title ?? "Kuis Catatan", wrong, correctCount: r.correct, total: r.total },
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
      await del({ data: { id } });
      toast.success("Catatan dihapus");
      router.navigate({ to: "/catatan" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal hapus");
    }
  }

  if (q.isLoading) return <AppShell><p className="text-brand/40">Memuat…</p></AppShell>;
  if (!q.data?.note) return <AppShell><p>Catatan tidak ditemukan.</p></AppShell>;
  const { note, cards, quiz: quizzes, imageUrl, owner, isOwner } = q.data;

  return (
    <AppShell>
      <Link to="/catatan" className="inline-flex items-center gap-1 text-sm text-brand/60 hover:text-accent mb-4">
        <ArrowLeft className="size-4" /> Kembali ke pustaka
      </Link>
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-extrabold mb-3">{note.title}</h1>
          <div className="flex items-center gap-3 mb-4">
            {owner?.avatar_url ? (
              <img src={owner.avatar_url} alt="" className="size-9 rounded-full" />
            ) : (
              <div className="size-9 rounded-full bg-accent/20 grid place-items-center text-sm font-bold text-accent">
                {(owner?.display_name ?? "?").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="text-sm font-bold">{owner?.display_name ?? "Pelajar"} {isOwner && <span className="text-[10px] text-accent ml-1">· kamu</span>}</div>
              {owner?.school && <div className="text-xs text-brand/50">{owner.school}</div>}
            </div>
            {isOwner && (
              <button onClick={handleDelete} className="ml-auto text-xs font-bold text-destructive hover:underline inline-flex items-center gap-1">
                <Trash2 className="size-3.5" /> Hapus
              </button>
            )}
          </div>
          <p className="text-brand/70">{note.summary ?? "Belum diproses."}</p>
        </div>
        {imageUrl && (
          (note.mime_type ?? "").startsWith("image/") || /\.(jpe?g|png|webp|gif|bmp)$/i.test(note.image_path ?? "") ? (
            <img src={imageUrl} alt={note.title} className="w-full aspect-square object-cover rounded-2xl border border-brand/10" />
          ) : (
            <a href={imageUrl} target="_blank" rel="noreferrer" className="block aspect-square rounded-2xl border-2 border-dashed border-brand/15 grid place-items-center text-center p-6 hover:border-accent">
              <div>
                <div className="text-4xl mb-2">📄</div>
                <div className="text-xs font-bold text-brand/70">Buka berkas asli</div>
                <div className="text-[10px] text-brand/40 mt-1">{note.mime_type ?? "berkas"}</div>
              </div>
            </a>
          )
        )}
      </div>

      {note.status === "failed" && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-2xl p-4 mb-6">
          Analisis AI gagal pada catatan ini.
        </div>
      )}

      {cards.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-extrabold mb-4">Flashcard ({cards.length})</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((c) => (
              <button
                key={c.id}
                onClick={() => setFlipped((s) => ({ ...s, [c.id]: !s[c.id] }))}
                className="text-left min-h-[180px] p-5 rounded-2xl bg-card border border-brand/10 hover:border-accent transition flex flex-col justify-between"
              >
                <span className="text-[10px] font-bold uppercase text-accent">
                  {flipped[c.id] ? "Jawaban" : "Pertanyaan"}
                </span>
                <p className="font-semibold mt-2">{flipped[c.id] ? c.back : c.front}</p>
                <span className="text-xs text-brand/40 inline-flex items-center gap-1 mt-3">
                  <RotateCcw className="size-3" /> Klik untuk balik
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {quizzes.length > 0 && (
        <section>
          <h2 className="text-2xl font-extrabold mb-4">Kuis dari Catatan</h2>
          <div className="space-y-4">
            {quizzes.map((qz, i) => (
              <div key={qz.id} className="bg-card rounded-2xl border border-brand/10 p-5">
                <p className="font-semibold mb-3">
                  <span className="text-accent mr-2">{i + 1}.</span>
                  {qz.question}
                </p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {(qz.options as string[]).map((opt, oi) => {
                    const myChoice = answers[qz.id];
                    const showResult = !!result;
                    const isCorrect = oi === qz.answer_index;
                    const isMine = oi === myChoice;
                    return (
                      <button
                        key={oi}
                        disabled={!!result}
                        onClick={() => setAnswers((a) => ({ ...a, [qz.id]: oi }))}
                        className={
                          "text-left p-3 rounded-xl border-2 text-sm transition " +
                          (showResult && isCorrect
                            ? "border-green-500 bg-green-500/10"
                            : showResult && isMine
                              ? "border-destructive bg-destructive/10"
                              : isMine
                                ? "border-accent bg-accent/10 font-semibold"
                                : "border-brand/10 hover:border-accent/40")
                        }
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {result && (
                  <p className="mt-3 text-xs text-brand/60 italic">{qz.explanation}</p>
                )}
              </div>
            ))}
          </div>
          {!result ? (
            <button
              disabled={Object.keys(answers).length < quizzes.length}
              onClick={handleSubmit}
              className="mt-6 w-full py-4 bg-brand text-brand-foreground rounded-2xl font-bold disabled:opacity-40"
            >
              Selesai · cek skor
            </button>
          ) : (
            <>
              <div className="mt-6 p-6 bg-diva/10 rounded-2xl text-center">
                <div className="text-4xl font-black">{result.correct}/{result.total}</div>
                <p className="text-sm text-brand/60 mt-1">Mantap! +{result.correct * 5} EXP</p>
              </div>
              <div className="mt-6 bg-card border-2 border-accent/30 rounded-3xl p-6">
                <h3 className="font-extrabold mb-3 flex items-center gap-2">
                  <Sparkles className="size-5 text-accent" /> Analisis Kelemahan AI
                </h3>
                {analyzing ? (
                  <div className="flex items-center gap-2 text-brand/60"><Loader2 className="size-4 animate-spin" /> Menganalisis…</div>
                ) : weakness ? (
                  <div className="space-y-4">
                    <p className="text-brand/80 text-sm">{weakness.summary}</p>
                    {weakness.weak_topics.map((w, i) => (
                      <div key={i} className="p-3 bg-surface rounded-xl border border-brand/5">
                        <div className="font-bold text-accent text-sm">{w.topic}</div>
                        <p className="text-xs text-brand/70 mt-1">{w.why}</p>
                        <p className="text-xs font-semibold mt-1">💡 {w.recommendation}</p>
                      </div>
                    ))}
                    {weakness.suggested_drills.length > 0 && (
                      <ul className="list-disc list-inside text-xs space-y-1">
                        {weakness.suggested_drills.map((d, i) => (<li key={i}>{d}</li>))}
                      </ul>
                    )}
                  </div>
                ) : null}
              </div>
            </>
          )}
        </section>
      )}
    </AppShell>
  );
}

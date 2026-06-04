import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { getDashboard, getTodayQuiz, submitDailyQuiz, updateProfile } from "@/lib/studiva.functions";
import { Flame, Trophy, Sparkles, Target } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const fetchDash = useServerFn(getDashboard);
  const fetchQuiz = useServerFn(getTodayQuiz);
  const submitQuiz = useServerFn(submitDailyQuiz);
  const updateProf = useServerFn(updateProfile);

  const dash = useQuery({ queryKey: ["dashboard"], queryFn: () => fetchDash() });
  const quiz = useQuery({ queryKey: ["daily-quiz"], queryFn: () => fetchQuiz() });

  const [chosen, setChosen] = useState<number | null>(null);
  const [result, setResult] = useState<{ isCorrect: boolean; explanation: string; answerIndex: number } | null>(null);

  const profile = dash.data?.profile;
  const stats = dash.data?.stats;

  async function handleAnswer() {
    if (chosen == null || !quiz.data?.quiz) return;
    try {
      const r = await submitQuiz({ data: { quizId: quiz.data.quiz.id, chosenIndex: chosen } });
      setResult(r);
      toast.success(r.isCorrect ? `Benar! +10 EXP · Streak ${r.streak}🔥` : `Yuk lanjut besok! +2 EXP`);
      dash.refetch();
      quiz.refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal mengirim jawaban");
    }
  }

  return (
    <AppShell>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Hero greeting */}
        <div className="lg:col-span-3 bg-brand text-brand-foreground rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="text-diva text-xs font-bold uppercase tracking-widest mb-2">Selamat datang</div>
            <h1 className="text-3xl md:text-4xl font-extrabold">
              Halo, {profile?.display_name ?? "Pelajar"} 👋
            </h1>
            <p className="text-white/70 mt-2">Pelajar SMA · {profile?.school ?? "Atur sekolahmu di profil"}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4 md:mt-0">
            <Stat icon={<Flame className="text-diva" />} label="Streak" value={`${stats?.streak_current ?? 0}🔥`} />
            <Stat icon={<Sparkles className="text-diva" />} label="EXP" value={stats?.exp ?? 0} />
            <Stat icon={<Trophy className="text-diva" />} label="SNBT" value={stats?.snbt_best ?? 0} />
          </div>
        </div>

        {/* Daily quiz */}
        <div className="lg:col-span-2 bg-card rounded-3xl border border-brand/5 p-6 shadow-xl shadow-brand/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold flex items-center gap-2">
              <Target className="size-5 text-accent" /> Kuis Harian
            </h2>
            <span className="text-xs font-bold text-brand/40 uppercase">{quiz.data?.quiz?.subject}</span>
          </div>
          {quiz.isLoading ? (
            <p className="text-brand/40">Memuat…</p>
          ) : !quiz.data?.quiz ? (
            <p className="text-brand/60">Belum ada soal hari ini. Cek lagi besok!</p>
          ) : quiz.data.attempt || result ? (
            <div>
              <p className="font-semibold mb-4">{quiz.data.quiz.question}</p>
              <div className="space-y-2">
                {(quiz.data.quiz.options as string[]).map((opt, i) => {
                  const correctIdx = result?.answerIndex ?? -1;
                  const myChoice = result ? chosen : quiz.data?.attempt?.chosen_index;
                  const isCorrect = i === correctIdx;
                  const isMine = i === myChoice;
                  return (
                    <div
                      key={i}
                      className={
                        "p-3 rounded-xl border-2 text-sm " +
                        (isCorrect
                          ? "border-green-500 bg-green-500/10"
                          : isMine
                            ? "border-destructive bg-destructive/10"
                            : "border-brand/10")
                      }
                    >
                      {opt}
                    </div>
                  );
                })}
              </div>
              {(result?.explanation) && (
                <div className="mt-4 p-4 rounded-xl bg-accent/5 text-sm">{result.explanation}</div>
              )}
              <p className="text-xs text-brand/50 mt-4">Selesai untuk hari ini ✅ — kunjungi lagi besok untuk menjaga streak.</p>
            </div>
          ) : (
            <div>
              <p className="font-semibold mb-4">{quiz.data.quiz.question}</p>
              <div className="space-y-2 mb-4">
                {(quiz.data.quiz.options as string[]).map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setChosen(i)}
                    className={
                      "w-full text-left p-3 rounded-xl border-2 text-sm transition " +
                      (chosen === i ? "border-accent bg-accent/10 font-semibold" : "border-brand/10 hover:border-accent/40")
                    }
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <button
                disabled={chosen == null}
                onClick={handleAnswer}
                className="w-full py-3 bg-brand text-brand-foreground rounded-xl font-bold disabled:opacity-40"
              >
                Kirim jawaban
              </button>
            </div>
          )}
        </div>

        {/* Profile quick edit */}
        <div className="bg-card rounded-3xl border border-brand/5 p-6">
          <h2 className="text-lg font-extrabold mb-4">Target Kampus</h2>
          <form
            className="space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              try {
                await updateProf({
                  data: {
                    display_name: String(fd.get("display_name") ?? profile?.display_name ?? "Pelajar"),
                    school: String(fd.get("school") ?? ""),
                    target_university: String(fd.get("target_university") ?? ""),
                    target_major: String(fd.get("target_major") ?? ""),
                  },
                });
                toast.success("Profil tersimpan");
                dash.refetch();
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
              }
            }}
          >
            <Field name="display_name" label="Nama" defaultValue={profile?.display_name} />
            <Field name="school" label="Sekolah" defaultValue={profile?.school ?? ""} />
            <Field name="target_university" label="PTN Target" defaultValue={profile?.target_university ?? ""} />
            <Field name="target_major" label="Jurusan Target" defaultValue={profile?.target_major ?? ""} />
            <button className="w-full py-2.5 bg-accent text-accent-foreground rounded-xl font-bold text-sm">
              Simpan
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 text-2xl font-extrabold">
        {icon}
        <span>{value}</span>
      </div>
      <div className="text-[10px] uppercase font-bold tracking-widest text-white/50">{label}</div>
    </div>
  );
}

function Field({ name, label, defaultValue }: { name: string; label: string; defaultValue?: string | null }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase text-brand/50">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue ?? ""}
        className="mt-1 w-full px-3 py-2 rounded-lg border border-brand/15 bg-surface text-sm focus:outline-none focus:border-accent"
      />
    </label>
  );
}

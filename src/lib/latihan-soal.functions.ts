import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const SNBT_SECTIONS = [
  { key: "PU", label: "Penalaran Umum", count: 5 },
  { key: "PPU", label: "Pengetahuan & Pemahaman Umum", count: 4 },
  { key: "PBM", label: "Pemahaman Bacaan & Menulis", count: 4 },
  { key: "PK", label: "Pengetahuan Kuantitatif", count: 4 },
  { key: "LBI", label: "Literasi Bahasa Indonesia", count: 5 },
  { key: "LBE", label: "Literasi Bahasa Inggris", count: 4 },
  { key: "PM", label: "Penalaran Matematika", count: 4 },
] as const;

export const TKA_SECTIONS = [
  { key: "MAT", label: "Matematika", count: 6 },
  { key: "FIS", label: "Fisika", count: 6 },
  { key: "KIM", label: "Kimia", count: 6 },
  { key: "BIO", label: "Biologi", count: 6 },
  { key: "BIND", label: "Bahasa Indonesia", count: 6 },
] as const;

interface GenQuestion {
  question: string;
  options: string[];
  answer_index: number;
  explanation?: string;
}

async function generateSection(supabase: any, label: string, count: number, kind: "snbt" | "tka"): Promise<GenQuestion[]> {
  const { callLovableAI, extractJSON } = await import("./ai-gateway.server");

  const prompt = `Buat ${count} soal pilihan ganda ${kind === "snbt" ? "SNBT" : "TKA"} bagian "${label}" untuk siswa SMA Indonesia. Variasikan tingkat kesulitan.
Semua soal wajib memiliki 5 pilihan opsi jawaban (A, B, C, D, E).
Pembahasan (explanation) harus ditulis dengan jelas dan terstruktur.
Balas JSON valid:
{
  "questions": [
    {
      "question": "Pertanyaan soal...",
      "options": ["A...", "B...", "C...", "D...", "E..."],
      "answer_index": 2,
      "explanation": "Penjelasan cara menjawab secara rinci."
    }
  ]
}
Pastikan tepat ${count} soal, setiap soal 5 opsi, answer_index 0-4, gunakan bahasa Indonesia.`;

  const content = await callLovableAI({
    model: "google/gemini-3.5-flash",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });
  const parsed = extractJSON<{ questions: GenQuestion[] }>(content);
  return (parsed.questions ?? []).slice(0, count).filter(
    (q) => Array.isArray(q.options) && q.options.length >= 4 && q.answer_index >= 0 && q.answer_index < q.options.length,
  );
}
 
export const startSimulation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ type: z.enum(["snbt", "tka"]) }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    // Create simulations row with score 0 as placeholder
    const { data: sim, error } = await supabase
      .from("simulations")
      .insert({ user_id: userId, type: data.type, score: 0 })
      .select("id")
      .single();
    if (error || !sim) throw new Error(error?.message ?? "Gagal membuat latihan soal");
 
    const sections = data.type === "snbt" ? SNBT_SECTIONS : TKA_SECTIONS;
    const sectionResults = await Promise.all(
      sections.map(async (s) => {
        try {
          const qs = await generateSection(supabase, s.label, s.count, data.type);
          return { section: s.label, questions: qs };
        } catch (err) {
          console.error(`Gagal membuat soal untuk section ${s.label}:`, err);
          return { section: s.label, questions: [] };
        }
      }),
    );

    let pos = 0;
    const rows: Array<{
      simulation_id: string;
      user_id: string;
      section: string;
      position: number;
      question: string;
      options: string[];
      answer_index: number;
      explanation: string | null;
    }> = [];
    for (const sr of sectionResults) {
      for (const q of sr.questions) {
        rows.push({
          simulation_id: sim.id,
          user_id: userId,
          section: sr.section,
          position: pos++,
          question: q.question,
          options: q.options,
          answer_index: q.answer_index,
          explanation: q.explanation ?? null,
        });
      }
    }
    if (rows.length === 0) throw new Error("AI gagal membuat soal. Coba lagi.");
    const { error: insErr } = await supabase.from("simulation_questions").insert(rows);
    if (insErr) throw new Error(insErr.message);
    return { simulationId: sim.id, total: rows.length };
  });

export const getSimulationQuestions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ simulationId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: rows } = await supabase
      .from("simulation_questions")
      .select("id, section, position, question, options")
      .eq("simulation_id", data.simulationId)
      .eq("user_id", userId)
      .order("position");
    return { questions: rows ?? [] };
  });

export const submitSimulation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      simulationId: z.string().uuid(),
      type: z.enum(["snbt", "tka"]),
      answers: z.record(z.string().uuid(), z.number().int()),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: rows } = await supabase
      .from("simulation_questions")
      .select("id, section, question, options, answer_index")
      .eq("simulation_id", data.simulationId)
      .eq("user_id", userId);
    if (!rows || rows.length === 0) throw new Error("Soal tidak ditemukan");

    let correct = 0;
    const wrong: Array<{ question: string; chosen?: string; correct: string; section?: string }> = [];
    const perSection = new Map<string, { c: number; t: number }>();

    for (const r of rows) {
      const chosen = data.answers[r.id];
      const opts = r.options as string[];
      const s = perSection.get(r.section) ?? { c: 0, t: 0 };
      s.t++;
      if (chosen === r.answer_index) {
        correct++;
        s.c++;
      } else {
        wrong.push({
          question: r.question,
          chosen: chosen != null ? opts[chosen] : undefined,
          correct: opts[r.answer_index],
          section: r.section,
        });
      }
      perSection.set(r.section, s);
    }
    const score = Math.round((correct / rows.length) * 800);
    await supabase.from("simulations").update({ score }).eq("id", data.simulationId).eq("user_id", userId);

    const { data: stats } = await supabase
      .from("user_stats")
      .select("exp, snbt_best, tka_best")
      .eq("user_id", userId)
      .single();
    await supabase
      .from("user_stats")
      .update({
        exp: (stats?.exp ?? 0) + 50,
        snbt_best: data.type === "snbt" ? Math.max(stats?.snbt_best ?? 0, score) : stats?.snbt_best ?? 0,
        tka_best: data.type === "tka" ? Math.max(stats?.tka_best ?? 0, score) : stats?.tka_best ?? 0,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    return {
      correct,
      total: rows.length,
      score,
      wrong: wrong.slice(0, 30),
      perSection: Array.from(perSection, ([section, v]) => ({ section, correct: v.c, total: v.t })),
    };
  });

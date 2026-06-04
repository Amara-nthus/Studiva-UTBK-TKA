import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

interface WeaknessPayload {
  summary: string;
  weak_topics: Array<{ topic: string; why: string; recommendation: string }>;
  suggested_drills: string[];
}

export const analyzeWeakness = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      kind: z.enum(["note_quiz", "snbt", "tka"]),
      label: z.string().max(80),
      wrong: z.array(
        z.object({
          question: z.string().max(2000),
          chosen: z.string().max(500).optional(),
          correct: z.string().max(500),
          section: z.string().max(80).optional(),
        }),
      ).max(60),
      correctCount: z.number().int().min(0),
      total: z.number().int().min(1),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { callLovableAI, extractJSON } = await import("./ai-gateway.server");

    if (data.wrong.length === 0) {
      const payload: WeaknessPayload = {
        summary: `Luar biasa! Kamu menjawab ${data.correctCount}/${data.total} dengan benar. Pertahankan dan naikkan level ke soal yang lebih sulit.`,
        weak_topics: [],
        suggested_drills: ["Coba simulasi lebih sulit", "Ajarkan materi ke teman untuk memperkuat ingatan"],
      };
      await supabase.from("weakness_reports").insert({ user_id: userId, kind: data.kind, payload: payload as unknown as never });
      return payload;
    }

    const prompt = `Kamu adalah tutor SMA untuk persiapan SNBT/TKA. Analisis jawaban salah berikut dan identifikasi kelemahan konsep utama siswa.
Latar: ${data.label} · Benar ${data.correctCount}/${data.total}.
Jawaban salah:
${data.wrong.map((w, i) => `${i + 1}. [${w.section ?? "umum"}] ${w.question}\n   Jawaban siswa: ${w.chosen ?? "kosong"} · Jawaban benar: ${w.correct}`).join("\n")}

Balas JSON valid:
{
  "summary": "ringkasan 2 kalimat dalam bahasa Indonesia tentang pola kelemahan",
  "weak_topics": [{"topic":"...","why":"...","recommendation":"..."}],
  "suggested_drills": ["...", "..."]
}
Maks 4 weak_topics, maks 5 suggested_drills. Bahasa Indonesia, langsung & memotivasi.`;

    const content = await callLovableAI({
      model: "google/gemini-3.5-flash",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });
    const parsed = extractJSON<WeaknessPayload>(content);
    await supabase.from("weakness_reports").insert({ user_id: userId, kind: data.kind, payload: parsed as unknown as never });
    return parsed;
  });

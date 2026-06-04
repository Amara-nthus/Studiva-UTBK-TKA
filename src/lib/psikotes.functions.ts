import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const PSIKOTES_QUESTIONS = [
  { id: 1, text: "Saya senang menganalisis angka dan memecahkan soal matematika." },
  { id: 2, text: "Saya tertarik dengan eksperimen sains & laboratorium." },
  { id: 3, text: "Saya suka menggambar, mendesain, atau membuat sesuatu yang artistik." },
  { id: 4, text: "Saya nyaman berbicara di depan banyak orang." },
  { id: 5, text: "Saya senang membantu orang lain memahami sesuatu (mengajar)." },
  { id: 6, text: "Saya tertarik pada cara kerja komputer dan teknologi." },
  { id: 7, text: "Saya suka membaca buku non-fiksi, sejarah, atau filsafat." },
  { id: 8, text: "Saya tertarik pada bisnis, ekonomi, dan kewirausahaan." },
  { id: 9, text: "Saya peka terhadap isu sosial dan ingin memberi dampak." },
  { id: 10, text: "Saya senang merancang struktur, bangunan, atau sistem." },
  { id: 11, text: "Saya suka pekerjaan yang berhubungan dengan kesehatan & tubuh manusia." },
  { id: 12, text: "Saya nyaman bekerja sendiri dengan fokus mendalam." },
  { id: 13, text: "Saya senang bahasa asing dan komunikasi lintas budaya." },
  { id: 14, text: "Saya suka memimpin kelompok dan mengambil keputusan." },
  { id: 15, text: "Saya tertarik hukum, kebijakan publik, atau pemerintahan." },
];

export const runPsikotes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      answers: z.record(z.string(), z.number().int().min(1).max(5)),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { callLovableAI, extractJSON } = await import("./ai-gateway.server");

    const profile = PSIKOTES_QUESTIONS.map(
      (q) => `${q.id}. ${q.text} — skor: ${data.answers[String(q.id)] ?? 3}/5`,
    ).join("\n");

    const prompt = `Kamu adalah konselor pendidikan untuk siswa SMA Indonesia.
Berdasarkan jawaban likert (1=sangat tidak setuju, 5=sangat setuju) berikut:

${profile}

Hasilkan JSON valid:
{
  "summary": "deskripsi singkat kepribadian akademik (2-3 kalimat)",
  "recommendations": [
    { "major": "Nama Jurusan", "match": 92, "reason": "alasan kecocokan singkat", "sample_universities": ["UI","ITB","UGM"] }
  ]
}
Berikan 4 rekomendasi jurusan terbaik dengan persentase kecocokan 60-99. Jangan tambahkan teks di luar JSON.`;

    const content = await callLovableAI({
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });
    const parsed = extractJSON<{
      summary: string;
      recommendations: Array<{ major: string; match: number; reason: string; sample_universities: string[] }>;
    }>(content);

    await supabase.from("psikotes_results").insert({
      user_id: userId,
      answers: data.answers,
      recommendations: parsed,
    });

    return parsed;
  });

export const getLatestPsikotes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data } = await supabase
      .from("psikotes_results")
      .select("recommendations, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return { result: data };
  });

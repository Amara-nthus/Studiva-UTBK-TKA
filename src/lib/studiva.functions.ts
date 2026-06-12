import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// ----- Daily quiz -----
export const getTodayQuiz = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const today = new Date().toISOString().slice(0, 10);
    
    // 1. Cek apakah kuis hari ini sudah ada
    let { data: quiz } = await supabaseAdmin
      .from("daily_quiz")
      .select("id, quiz_date, subject, question, options")
      .eq("quiz_date", today)
      .maybeSingle();

    // 2. Jika belum ada, buat kuis baru menggunakan AI Gemini
    if (!quiz) {
      try {
        const { callLovableAI, extractJSON } = await import("./ai-gateway.server");
        
        const subjects = [
          "Penalaran Matematika",
          "Penalaran Umum",
          "Pemahaman Bacaan dan Menulis",
          "Pengetahuan Kuantitatif",
          "Literasi dalam Bahasa Indonesia",
          "Literasi dalam Bahasa Inggris",
          "Fisika",
          "Kimia",
          "Biologi",
          "Ekonomi",
          "Sejarah",
          "Geografi",
          "Sosiologi"
        ];
        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];

        const prompt = `Buatlah 1 soal latihan untuk seleksi masuk PTN Indonesia, disesuaikan dengan materi ujian UTBK / SNBT (untuk subtes Penalaran & Literasi) atau TKA (untuk subtes sains/soshum tingkat tinggi / HOTS).
Mata pelajaran/subtes spesifik: ${randomSubject}.

Format respon wajib dalam JSON dengan struktur berikut:
{
  "subject": "${randomSubject}",
  "question": "Pertanyaan lengkap soal...",
  "options": [
    "Pilihan A",
    "Pilihan B",
    "Pilihan C",
    "Pilihan D",
    "Pilihan E"
  ],
  "answer_index": 2, // Indeks jawaban benar (0 untuk pilihan pertama, 1 untuk kedua, dst)
  "explanation": "Penjelasan cara menyelesaikan soal dengan rinci."
}

Aturan pembuatan soal:
1. Soal harus memiliki tingkat kesulitan standar UTBK/SNBT asli dan relevan dengan materi TKA/SNBT terbaru.
2. Semua pilihan jawaban harus logis dan pengecoh harus berkualitas.
3. Penjelasan harus mendalam, langkah demi langkah, dan mudah dipahami oleh siswa SMA.
4. Respon harus murni JSON tanpa penjelasan tambahan di luar JSON.`;

        const responseText = await callLovableAI({
          model: "google/gemini-3.5-flash",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" }
        });

        const parsed = extractJSON<{
          subject: string;
          question: string;
          options: string[];
          answer_index: number;
          explanation: string;
        }>(responseText);

        const { data: insertedQuiz, error: insertError } = await supabaseAdmin
          .from("daily_quiz")
          .insert({
            quiz_date: today,
            subject: parsed.subject || randomSubject,
            question: parsed.question,
            options: parsed.options,
            answer_index: parsed.answer_index,
            explanation: parsed.explanation,
          })
          .select("id, quiz_date, subject, question, options")
          .maybeSingle();

        if (insertError) {
          // Jika terjadi error duplicate key (karena user lain sudah men-generate kuis hari ini pada saat bersamaan)
          const { data: existingQuiz } = await supabaseAdmin
            .from("daily_quiz")
            .select("id, quiz_date, subject, question, options")
            .eq("quiz_date", today)
            .maybeSingle();
          quiz = existingQuiz;
        } else {
          quiz = insertedQuiz;
        }
      } catch (err) {
        console.error("Gagal men-generate kuis harian dengan AI:", err);
      }
    }

    if (!quiz) return { quiz: null, attempt: null };

    // 3. Ambil riwayat pengerjaan user untuk kuis hari ini
    const { data: attempt } = await supabase
      .from("daily_quiz_attempts")
      .select("chosen_index, is_correct")
      .eq("quiz_id", quiz.id)
      .eq("user_id", userId)
      .maybeSingle();

    return { quiz, attempt };
  });

export const submitDailyQuiz = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ quizId: z.string().uuid(), chosenIndex: z.number().int().min(0).max(10) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: quiz, error: qErr } = await supabase
      .from("daily_quiz")
      .select("id, answer_index, explanation")
      .eq("id", data.quizId)
      .single();
    if (qErr || !quiz) throw new Error("Soal tidak ditemukan");

    const isCorrect = data.chosenIndex === quiz.answer_index;
    const { error: insErr } = await supabase.from("daily_quiz_attempts").insert({
      user_id: userId,
      quiz_id: quiz.id,
      chosen_index: data.chosenIndex,
      is_correct: isCorrect,
    });
    if (insErr && !insErr.message.includes("duplicate")) throw new Error(insErr.message);

    // Update stats + streak
    const { data: stats } = await supabase
      .from("user_stats")
      .select("exp, streak_current, streak_longest, last_quiz_date")
      .eq("user_id", userId)
      .single();
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    let streak = stats?.streak_current ?? 0;
    if (stats?.last_quiz_date === today) {
      // already counted today — keep streak
    } else if (stats?.last_quiz_date === yesterday) {
      streak += 1;
    } else {
      streak = 1;
    }
    const longest = Math.max(stats?.streak_longest ?? 0, streak);
    const exp = (stats?.exp ?? 0) + (isCorrect ? 10 : 2);
    await supabase
      .from("user_stats")
      .update({
        exp,
        streak_current: streak,
        streak_longest: longest,
        last_quiz_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    return { isCorrect, explanation: quiz.explanation, answerIndex: quiz.answer_index, streak, exp };
  });

// ----- Simulation -----
export const recordSimulation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      type: z.enum(["snbt", "tka"]),
      score: z.number().int().min(0).max(1000),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await supabase.from("simulations").insert({ user_id: userId, type: data.type, score: data.score });
    const { data: stats } = await supabase
      .from("user_stats")
      .select("exp, snbt_best, tka_best")
      .eq("user_id", userId)
      .single();
    const patch = {
      exp: (stats?.exp ?? 0) + 50,
      updated_at: new Date().toISOString(),
      snbt_best:
        data.type === "snbt" ? Math.max(stats?.snbt_best ?? 0, data.score) : stats?.snbt_best ?? 0,
      tka_best:
        data.type === "tka" ? Math.max(stats?.tka_best ?? 0, data.score) : stats?.tka_best ?? 0,
    };
    await supabase.from("user_stats").update(patch).eq("user_id", userId);
    return { ok: true };
  });

// ----- Leaderboards -----
export const getLeaderboards = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const [expRes, snbtRes, tkaRes] = await Promise.all([
      supabaseAdmin.from("user_stats").select("user_id, exp, snbt_best, tka_best").order("exp", { ascending: false }).limit(50),
      supabaseAdmin.from("user_stats").select("user_id, exp, snbt_best, tka_best").order("snbt_best", { ascending: false }).limit(50),
      supabaseAdmin.from("user_stats").select("user_id, exp, snbt_best, tka_best").order("tka_best", { ascending: false }).limit(50),
    ]);
    const allIds = Array.from(
      new Set([
        ...(expRes.data ?? []).map((r) => r.user_id),
        ...(snbtRes.data ?? []).map((r) => r.user_id),
        ...(tkaRes.data ?? []).map((r) => r.user_id),
      ]),
    );
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, display_name, avatar_url, school")
      .in("id", allIds.length ? allIds : ["00000000-0000-0000-0000-000000000000"]);
    const pmap = new Map((profiles ?? []).map((p) => [p.id, p]));
    const enrich = (rows: typeof expRes.data) =>
      (rows ?? []).map((r) => ({ ...r, profile: pmap.get(r.user_id) ?? null }));
    return {
      exp: enrich(expRes.data),
      snbt: enrich(snbtRes.data),
      tka: enrich(tkaRes.data),
    };
  });
// ----- Dashboard summary -----
export const getDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    let { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
    let { data: stats } = await supabase.from("user_stats").select("*").eq("user_id", userId).maybeSingle();

    if (!profile) {
      const { data: authData } = await supabase.auth.getUser();
      const defaultName = authData?.user?.user_metadata?.display_name || authData?.user?.email?.split("@")[0] || "Pelajar";
      const { data: newProfile } = await supabase
        .from("profiles")
        .upsert({ id: userId, display_name: defaultName })
        .select()
        .single();
      profile = newProfile;
    }

    if (!stats) {
      const { data: newStats } = await supabase
        .from("user_stats")
        .upsert({ user_id: userId })
        .select()
        .single();
      stats = newStats;
    }

    // Reset streak jika user melewatkan kuis kemarin
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (stats && stats.last_quiz_date !== today && stats.last_quiz_date !== yesterday && stats.streak_current > 0) {
      stats.streak_current = 0;
      await supabase
        .from("user_stats")
        .update({ streak_current: 0 })
        .eq("user_id", userId);
    }

    return { profile, stats };
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      display_name: z.string().min(1).max(80),
      school: z.string().max(120).optional().nullable(),
      target_university: z.string().max(120).optional().nullable(),
      target_major: z.string().max(120).optional().nullable(),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        display_name: data.display_name,
        school: data.school ?? null,
        target_university: data.target_university ?? null,
        target_major: data.target_major ?? null,
      });
    if (error) throw new Error(error.message);

    // Ensure user_stats row also exists
    await supabase
      .from("user_stats")
      .upsert({ user_id: userId });

    return { ok: true };
  });

export const createGuestUser = createServerFn({ method: "POST" })
  .handler(async () => {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase configuration. Silakan buat file .env dari .env.example terlebih dahulu.");
    }

    // Generate a unique dummy email
    const email = `guest_${Math.floor(100000 + Math.random() * 900000)}@studiva.com`;
    const password = "password123";

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: "Guest Pelajar" },
    });

    if (error) {
      console.error("Error creating guest user:", error);
      throw new Error(error.message || "Gagal membuat akun guest");
    }

    return { email, password };
  });


import { c as createServerRpc } from "./createServerRpc-Ejq-_fzx.mjs";
import { a as createServerFn } from "./server-DDQ41ls2.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CuXDYw0K.mjs";
import { s as supabaseAdmin } from "./client.server-U_pH-Evd.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, n as numberType, s as stringType, e as enumType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const getTodayQuiz_createServerFn_handler = createServerRpc({
  id: "803dbbc0ac60588fb768dfc7ff4ab2a233d61f823cd2bc6530a89c163a093b32",
  name: "getTodayQuiz",
  filename: "src/lib/studiva.functions.ts"
}, (opts) => getTodayQuiz.__executeServer(opts));
const getTodayQuiz = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getTodayQuiz_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  let {
    data: quiz
  } = await supabaseAdmin.from("daily_quiz").select("id, quiz_date, subject, question, options").eq("quiz_date", today).maybeSingle();
  if (!quiz) {
    try {
      const {
        callLovableAI,
        extractJSON
      } = await import("./ai-gateway.server-Ckn08mbV.mjs");
      const subjects = ["Penalaran Matematika", "Penalaran Umum", "Pemahaman Bacaan dan Menulis", "Pengetahuan Kuantitatif", "Literasi dalam Bahasa Indonesia", "Literasi dalam Bahasa Inggris", "Fisika", "Kimia", "Biologi", "Ekonomi", "Sejarah", "Geografi", "Sosiologi"];
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
        messages: [{
          role: "user",
          content: prompt
        }],
        response_format: {
          type: "json_object"
        }
      });
      const parsed = extractJSON(responseText);
      const {
        data: insertedQuiz,
        error: insertError
      } = await supabaseAdmin.from("daily_quiz").insert({
        quiz_date: today,
        subject: parsed.subject || randomSubject,
        question: parsed.question,
        options: parsed.options,
        answer_index: parsed.answer_index,
        explanation: parsed.explanation
      }).select("id, quiz_date, subject, question, options").maybeSingle();
      if (insertError) {
        const {
          data: existingQuiz
        } = await supabaseAdmin.from("daily_quiz").select("id, quiz_date, subject, question, options").eq("quiz_date", today).maybeSingle();
        quiz = existingQuiz;
      } else {
        quiz = insertedQuiz;
      }
    } catch (err) {
      console.error("Gagal men-generate kuis harian dengan AI:", err);
    }
  }
  if (!quiz) return {
    quiz: null,
    attempt: null
  };
  const {
    data: attempt
  } = await supabase.from("daily_quiz_attempts").select("chosen_index, is_correct").eq("quiz_id", quiz.id).eq("user_id", userId).maybeSingle();
  return {
    quiz,
    attempt
  };
});
const submitDailyQuiz_createServerFn_handler = createServerRpc({
  id: "a2fd7609d7d23350befeb957a49b80f8ae744e5139be505d13a1e779b33b5ed2",
  name: "submitDailyQuiz",
  filename: "src/lib/studiva.functions.ts"
}, (opts) => submitDailyQuiz.__executeServer(opts));
const submitDailyQuiz = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  quizId: stringType().uuid(),
  chosenIndex: numberType().int().min(0).max(10)
}).parse(input)).handler(submitDailyQuiz_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: quiz,
    error: qErr
  } = await supabase.from("daily_quiz").select("id, answer_index, explanation").eq("id", data.quizId).single();
  if (qErr || !quiz) throw new Error("Soal tidak ditemukan");
  const isCorrect = data.chosenIndex === quiz.answer_index;
  const {
    error: insErr
  } = await supabase.from("daily_quiz_attempts").insert({
    user_id: userId,
    quiz_id: quiz.id,
    chosen_index: data.chosenIndex,
    is_correct: isCorrect
  });
  if (insErr && !insErr.message.includes("duplicate")) throw new Error(insErr.message);
  const {
    data: stats
  } = await supabase.from("user_stats").select("exp, streak_current, streak_longest, last_quiz_date").eq("user_id", userId).single();
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  let streak = stats?.streak_current ?? 0;
  if (stats?.last_quiz_date === today) ;
  else if (stats?.last_quiz_date === yesterday) {
    streak += 1;
  } else {
    streak = 1;
  }
  const longest = Math.max(stats?.streak_longest ?? 0, streak);
  const exp = (stats?.exp ?? 0) + (isCorrect ? 10 : 2);
  await supabase.from("user_stats").update({
    exp,
    streak_current: streak,
    streak_longest: longest,
    last_quiz_date: today,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("user_id", userId);
  return {
    isCorrect,
    explanation: quiz.explanation,
    answerIndex: quiz.answer_index,
    streak,
    exp
  };
});
const recordSimulation_createServerFn_handler = createServerRpc({
  id: "c5ec2db284020eb155a03f69f395ba2fa915320877142f90abbff1569aa4bfc2",
  name: "recordSimulation",
  filename: "src/lib/studiva.functions.ts"
}, (opts) => recordSimulation.__executeServer(opts));
const recordSimulation = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  type: enumType(["snbt", "tka"]),
  score: numberType().int().min(0).max(1e3)
}).parse(input)).handler(recordSimulation_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  await supabase.from("simulations").insert({
    user_id: userId,
    type: data.type,
    score: data.score
  });
  const {
    data: stats
  } = await supabase.from("user_stats").select("exp, snbt_best, tka_best").eq("user_id", userId).single();
  const patch = {
    exp: (stats?.exp ?? 0) + 50,
    updated_at: (/* @__PURE__ */ new Date()).toISOString(),
    snbt_best: data.type === "snbt" ? Math.max(stats?.snbt_best ?? 0, data.score) : stats?.snbt_best ?? 0,
    tka_best: data.type === "tka" ? Math.max(stats?.tka_best ?? 0, data.score) : stats?.tka_best ?? 0
  };
  await supabase.from("user_stats").update(patch).eq("user_id", userId);
  return {
    ok: true
  };
});
const getLeaderboards_createServerFn_handler = createServerRpc({
  id: "dc858e535ac56978d012f65b1be0bb1a2569c859df366b08d446df8b693d808e",
  name: "getLeaderboards",
  filename: "src/lib/studiva.functions.ts"
}, (opts) => getLeaderboards.__executeServer(opts));
const getLeaderboards = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getLeaderboards_createServerFn_handler, async () => {
  const [expRes, snbtRes, tkaRes] = await Promise.all([supabaseAdmin.from("user_stats").select("user_id, exp, snbt_best, tka_best").order("exp", {
    ascending: false
  }).limit(50), supabaseAdmin.from("user_stats").select("user_id, exp, snbt_best, tka_best").order("snbt_best", {
    ascending: false
  }).limit(50), supabaseAdmin.from("user_stats").select("user_id, exp, snbt_best, tka_best").order("tka_best", {
    ascending: false
  }).limit(50)]);
  const allIds = Array.from(/* @__PURE__ */ new Set([...(expRes.data ?? []).map((r) => r.user_id), ...(snbtRes.data ?? []).map((r) => r.user_id), ...(tkaRes.data ?? []).map((r) => r.user_id)]));
  const {
    data: profiles
  } = await supabaseAdmin.from("profiles").select("id, display_name, avatar_url, school").in("id", allIds.length ? allIds : ["00000000-0000-0000-0000-000000000000"]);
  const pmap = new Map((profiles ?? []).map((p) => [p.id, p]));
  const enrich = (rows) => (rows ?? []).map((r) => ({
    ...r,
    profile: pmap.get(r.user_id) ?? null
  }));
  return {
    exp: enrich(expRes.data),
    snbt: enrich(snbtRes.data),
    tka: enrich(tkaRes.data)
  };
});
const getDashboard_createServerFn_handler = createServerRpc({
  id: "fcb53f430bdc8976a8b0d3e9f68c6a882963c2a5c4660d6c8c2bdacf8f8d4407",
  name: "getDashboard",
  filename: "src/lib/studiva.functions.ts"
}, (opts) => getDashboard.__executeServer(opts));
const getDashboard = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getDashboard_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  let {
    data: profile
  } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  let {
    data: stats
  } = await supabase.from("user_stats").select("*").eq("user_id", userId).maybeSingle();
  if (!profile) {
    const {
      data: authData
    } = await supabase.auth.getUser();
    const defaultName = authData?.user?.user_metadata?.display_name || authData?.user?.email?.split("@")[0] || "Pelajar";
    const {
      data: newProfile
    } = await supabase.from("profiles").upsert({
      id: userId,
      display_name: defaultName
    }).select().single();
    profile = newProfile;
  }
  if (!stats) {
    const {
      data: newStats
    } = await supabase.from("user_stats").upsert({
      user_id: userId
    }).select().single();
    stats = newStats;
  }
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  if (stats && stats.last_quiz_date !== today && stats.last_quiz_date !== yesterday && stats.streak_current > 0) {
    stats.streak_current = 0;
    await supabase.from("user_stats").update({
      streak_current: 0
    }).eq("user_id", userId);
  }
  return {
    profile,
    stats
  };
});
const updateProfile_createServerFn_handler = createServerRpc({
  id: "6c9e564dee4ff44d3266c92a668cc8c9341ca08440f59424aacee6955492946f",
  name: "updateProfile",
  filename: "src/lib/studiva.functions.ts"
}, (opts) => updateProfile.__executeServer(opts));
const updateProfile = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  display_name: stringType().min(1).max(80),
  school: stringType().max(120).optional().nullable(),
  target_university: stringType().max(120).optional().nullable(),
  target_major: stringType().max(120).optional().nullable()
}).parse(input)).handler(updateProfile_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    error
  } = await supabase.from("profiles").upsert({
    id: userId,
    display_name: data.display_name,
    school: data.school ?? null,
    target_university: data.target_university ?? null,
    target_major: data.target_major ?? null
  });
  if (error) throw new Error(error.message);
  await supabase.from("user_stats").upsert({
    user_id: userId
  });
  return {
    ok: true
  };
});
const createGuestUser_createServerFn_handler = createServerRpc({
  id: "e0aa0450a1c0bdbcf18dead153206bf1d4710c75fdb8ef6f5f0c4a7d3fb1148a",
  name: "createGuestUser",
  filename: "src/lib/studiva.functions.ts"
}, (opts) => createGuestUser.__executeServer(opts));
const createGuestUser = createServerFn({
  method: "POST"
}).handler(createGuestUser_createServerFn_handler, async () => {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase configuration. Silakan buat file .env dari .env.example terlebih dahulu.");
  }
  const email = `guest_${Math.floor(1e5 + Math.random() * 9e5)}@studiva.com`;
  const password = "password123";
  const {
    data,
    error
  } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      display_name: "Guest Pelajar"
    }
  });
  if (error) {
    console.error("Error creating guest user:", error);
    throw new Error(error.message || "Gagal membuat akun guest");
  }
  return {
    email,
    password
  };
});
export {
  createGuestUser_createServerFn_handler,
  getDashboard_createServerFn_handler,
  getLeaderboards_createServerFn_handler,
  getTodayQuiz_createServerFn_handler,
  recordSimulation_createServerFn_handler,
  submitDailyQuiz_createServerFn_handler,
  updateProfile_createServerFn_handler
};

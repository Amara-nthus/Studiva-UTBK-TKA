import { c as createServerRpc } from "./createServerRpc-Ejq-_fzx.mjs";
import { a as createServerFn } from "./server-DDQ41ls2.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CuXDYw0K.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, r as recordType, s as stringType, n as numberType } from "../_libs/zod.mjs";
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
const PSIKOTES_QUESTIONS = [{
  id: 1,
  text: "Saya senang menganalisis angka dan memecahkan soal matematika."
}, {
  id: 2,
  text: "Saya tertarik dengan eksperimen sains & laboratorium."
}, {
  id: 3,
  text: "Saya suka menggambar, mendesain, atau membuat sesuatu yang artistik."
}, {
  id: 4,
  text: "Saya nyaman berbicara di depan banyak orang."
}, {
  id: 5,
  text: "Saya senang membantu orang lain memahami sesuatu (mengajar)."
}, {
  id: 6,
  text: "Saya tertarik pada cara kerja komputer dan teknologi."
}, {
  id: 7,
  text: "Saya suka membaca buku non-fiksi, sejarah, atau filsafat."
}, {
  id: 8,
  text: "Saya tertarik pada bisnis, ekonomi, dan kewirausahaan."
}, {
  id: 9,
  text: "Saya peka terhadap isu sosial dan ingin memberi dampak."
}, {
  id: 10,
  text: "Saya senang merancang struktur, bangunan, atau sistem."
}, {
  id: 11,
  text: "Saya suka pekerjaan yang berhubungan dengan kesehatan & tubuh manusia."
}, {
  id: 12,
  text: "Saya nyaman bekerja sendiri dengan fokus mendalam."
}, {
  id: 13,
  text: "Saya senang bahasa asing dan komunikasi lintas budaya."
}, {
  id: 14,
  text: "Saya suka memimpin kelompok dan mengambil keputusan."
}, {
  id: 15,
  text: "Saya tertarik hukum, kebijakan publik, atau pemerintahan."
}];
const runPsikotes_createServerFn_handler = createServerRpc({
  id: "af6cc0034ba70c96f8ac12e947d15d1e5cd9ec4f0cf2c3278b0dbe1a20940b91",
  name: "runPsikotes",
  filename: "src/lib/psikotes.functions.ts"
}, (opts) => runPsikotes.__executeServer(opts));
const runPsikotes = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  answers: recordType(stringType(), numberType().int().min(1).max(5))
}).parse(input)).handler(runPsikotes_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    callLovableAI,
    extractJSON
  } = await import("./ai-gateway.server-Ckn08mbV.mjs");
  const profile = PSIKOTES_QUESTIONS.map((q) => `${q.id}. ${q.text} — skor: ${data.answers[String(q.id)] ?? 3}/5`).join("\n");
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
    messages: [{
      role: "user",
      content: prompt
    }],
    response_format: {
      type: "json_object"
    }
  });
  const parsed = extractJSON(content);
  await supabase.from("psikotes_results").insert({
    user_id: userId,
    answers: data.answers,
    recommendations: parsed
  });
  return parsed;
});
const getLatestPsikotes_createServerFn_handler = createServerRpc({
  id: "57282559122b77d8ed744ef6b56fff4c5a46f6d9722fa006ec68a92af61d8b7e",
  name: "getLatestPsikotes",
  filename: "src/lib/psikotes.functions.ts"
}, (opts) => getLatestPsikotes.__executeServer(opts));
const getLatestPsikotes = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getLatestPsikotes_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data
  } = await supabase.from("psikotes_results").select("recommendations, created_at").eq("user_id", userId).order("created_at", {
    ascending: false
  }).limit(1).maybeSingle();
  return {
    result: data
  };
});
export {
  getLatestPsikotes_createServerFn_handler,
  runPsikotes_createServerFn_handler
};

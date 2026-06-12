import { c as createServerRpc } from "./createServerRpc-Ejq-_fzx.mjs";
import { a as createServerFn } from "./server-DDQ41ls2.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CuXDYw0K.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, n as numberType, a as arrayType, s as stringType, e as enumType } from "../_libs/zod.mjs";
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
const analyzeWeakness_createServerFn_handler = createServerRpc({
  id: "14be741f39278dac42d2ae5e542be2065d6964298f3c1d7056caa6e5dacf0d6e",
  name: "analyzeWeakness",
  filename: "src/lib/weakness.functions.ts"
}, (opts) => analyzeWeakness.__executeServer(opts));
const analyzeWeakness = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  kind: enumType(["note_quiz", "snbt", "tka"]),
  label: stringType().max(80),
  wrong: arrayType(objectType({
    question: stringType().max(2e3),
    chosen: stringType().max(500).optional(),
    correct: stringType().max(500),
    section: stringType().max(80).optional()
  })).max(60),
  correctCount: numberType().int().min(0),
  total: numberType().int().min(1)
}).parse(input)).handler(analyzeWeakness_createServerFn_handler, async ({
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
  if (data.wrong.length === 0) {
    const payload = {
      summary: `Luar biasa! Kamu menjawab ${data.correctCount}/${data.total} dengan benar. Pertahankan dan naikkan level ke soal yang lebih sulit.`,
      weak_topics: [],
      suggested_drills: ["Coba latihan soal lebih sulit", "Ajarkan materi ke teman untuk memperkuat ingatan"]
    };
    await supabase.from("weakness_reports").insert({
      user_id: userId,
      kind: data.kind,
      payload
    });
    return payload;
  }
  const prompt = `Kamu adalah tutor SMA untuk persiapan SNBT/TKA. Analisis jawaban salah berikut dan identifikasi kelemahan konsep utama siswa.
Latar: ${data.label} · Benar ${data.correctCount}/${data.total}.
Jawaban salah:
${data.wrong.map((w, i) => `${i + 1}. [${w.section ?? "umum"}] ${w.question}
   Jawaban siswa: ${w.chosen ?? "kosong"} · Jawaban benar: ${w.correct}`).join("\n")}

Balas JSON valid:
{
  "summary": "ringkasan 2 kalimat dalam bahasa Indonesia tentang pola kelemahan",
  "weak_topics": [{"topic":"...","why":"...","recommendation":"..."}],
  "suggested_drills": ["...", "..."]
}
Maks 4 weak_topics, maks 5 suggested_drills. Bahasa Indonesia, langsung & memotivasi.`;
  const content = await callLovableAI({
    model: "google/gemini-3.5-flash",
    messages: [{
      role: "user",
      content: prompt
    }],
    response_format: {
      type: "json_object"
    }
  });
  const parsed = extractJSON(content);
  await supabase.from("weakness_reports").insert({
    user_id: userId,
    kind: data.kind,
    payload: parsed
  });
  return parsed;
});
export {
  analyzeWeakness_createServerFn_handler
};

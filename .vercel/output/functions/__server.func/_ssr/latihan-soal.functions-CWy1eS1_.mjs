import { c as createServerRpc } from "./createServerRpc-Ejq-_fzx.mjs";
import { a as createServerFn } from "./server-DDQ41ls2.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CuXDYw0K.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, e as enumType, s as stringType, r as recordType, n as numberType } from "../_libs/zod.mjs";
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
const SNBT_SECTIONS = [{
  key: "PU",
  label: "Penalaran Umum",
  count: 5
}, {
  key: "PPU",
  label: "Pengetahuan & Pemahaman Umum",
  count: 4
}, {
  key: "PBM",
  label: "Pemahaman Bacaan & Menulis",
  count: 4
}, {
  key: "PK",
  label: "Pengetahuan Kuantitatif",
  count: 4
}, {
  key: "LBI",
  label: "Literasi Bahasa Indonesia",
  count: 5
}, {
  key: "LBE",
  label: "Literasi Bahasa Inggris",
  count: 4
}, {
  key: "PM",
  label: "Penalaran Matematika",
  count: 4
}];
const TKA_SECTIONS = [{
  key: "MAT",
  label: "Matematika",
  count: 6
}, {
  key: "FIS",
  label: "Fisika",
  count: 6
}, {
  key: "KIM",
  label: "Kimia",
  count: 6
}, {
  key: "BIO",
  label: "Biologi",
  count: 6
}, {
  key: "BIND",
  label: "Bahasa Indonesia",
  count: 6
}];
async function generateSection(supabase, label, count, kind) {
  const {
    callLovableAI,
    extractJSON
  } = await import("./ai-gateway.server-Ckn08mbV.mjs");
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
    messages: [{
      role: "user",
      content: prompt
    }],
    response_format: {
      type: "json_object"
    }
  });
  const parsed = extractJSON(content);
  return (parsed.questions ?? []).slice(0, count).filter((q) => Array.isArray(q.options) && q.options.length >= 4 && q.answer_index >= 0 && q.answer_index < q.options.length);
}
const startSimulation_createServerFn_handler = createServerRpc({
  id: "bb4a5542eab2054f80c94c705f47d6cd0beb888bd4421dde36bc2e6848b706b2",
  name: "startSimulation",
  filename: "src/lib/latihan-soal.functions.ts"
}, (opts) => startSimulation.__executeServer(opts));
const startSimulation = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  type: enumType(["snbt", "tka"])
}).parse(input)).handler(startSimulation_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: sim,
    error
  } = await supabase.from("simulations").insert({
    user_id: userId,
    type: data.type,
    score: 0
  }).select("id").single();
  if (error || !sim) throw new Error(error?.message ?? "Gagal membuat latihan soal");
  const sections = data.type === "snbt" ? SNBT_SECTIONS : TKA_SECTIONS;
  const sectionResults = await Promise.all(sections.map(async (s) => {
    try {
      const qs = await generateSection(supabase, s.label, s.count, data.type);
      return {
        section: s.label,
        questions: qs
      };
    } catch (err) {
      console.error(`Gagal membuat soal untuk section ${s.label}:`, err);
      return {
        section: s.label,
        questions: []
      };
    }
  }));
  let pos = 0;
  const rows = [];
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
        explanation: q.explanation ?? null
      });
    }
  }
  if (rows.length === 0) throw new Error("AI gagal membuat soal. Coba lagi.");
  const {
    error: insErr
  } = await supabase.from("simulation_questions").insert(rows);
  if (insErr) throw new Error(insErr.message);
  return {
    simulationId: sim.id,
    total: rows.length
  };
});
const getSimulationQuestions_createServerFn_handler = createServerRpc({
  id: "0391a6e08109195a884035fd0ef091988b2e00c70ecbecd06c24e3d7725ca9f8",
  name: "getSimulationQuestions",
  filename: "src/lib/latihan-soal.functions.ts"
}, (opts) => getSimulationQuestions.__executeServer(opts));
const getSimulationQuestions = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  simulationId: stringType().uuid()
}).parse(input)).handler(getSimulationQuestions_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: rows
  } = await supabase.from("simulation_questions").select("id, section, position, question, options").eq("simulation_id", data.simulationId).eq("user_id", userId).order("position");
  return {
    questions: rows ?? []
  };
});
const submitSimulation_createServerFn_handler = createServerRpc({
  id: "b6d142b0dd0594be4e97ed924c2cdc536937ce69d58dd56b11a0b82caf0b66a1",
  name: "submitSimulation",
  filename: "src/lib/latihan-soal.functions.ts"
}, (opts) => submitSimulation.__executeServer(opts));
const submitSimulation = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  simulationId: stringType().uuid(),
  type: enumType(["snbt", "tka"]),
  answers: recordType(stringType().uuid(), numberType().int())
}).parse(input)).handler(submitSimulation_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: rows
  } = await supabase.from("simulation_questions").select("id, section, question, options, answer_index").eq("simulation_id", data.simulationId).eq("user_id", userId);
  if (!rows || rows.length === 0) throw new Error("Soal tidak ditemukan");
  let correct = 0;
  const wrong = [];
  const perSection = /* @__PURE__ */ new Map();
  for (const r of rows) {
    const chosen = data.answers[r.id];
    const opts = r.options;
    const s = perSection.get(r.section) ?? {
      c: 0,
      t: 0
    };
    s.t++;
    if (chosen === r.answer_index) {
      correct++;
      s.c++;
    } else {
      wrong.push({
        question: r.question,
        chosen: chosen != null ? opts[chosen] : void 0,
        correct: opts[r.answer_index],
        section: r.section
      });
    }
    perSection.set(r.section, s);
  }
  const score = Math.round(correct / rows.length * 800);
  await supabase.from("simulations").update({
    score
  }).eq("id", data.simulationId).eq("user_id", userId);
  const {
    data: stats
  } = await supabase.from("user_stats").select("exp, snbt_best, tka_best").eq("user_id", userId).single();
  await supabase.from("user_stats").update({
    exp: (stats?.exp ?? 0) + 50,
    snbt_best: data.type === "snbt" ? Math.max(stats?.snbt_best ?? 0, score) : stats?.snbt_best ?? 0,
    tka_best: data.type === "tka" ? Math.max(stats?.tka_best ?? 0, score) : stats?.tka_best ?? 0,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("user_id", userId);
  return {
    correct,
    total: rows.length,
    score,
    wrong: wrong.slice(0, 30),
    perSection: Array.from(perSection, ([section, v]) => ({
      section,
      correct: v.c,
      total: v.t
    }))
  };
});
export {
  getSimulationQuestions_createServerFn_handler,
  startSimulation_createServerFn_handler,
  submitSimulation_createServerFn_handler
};

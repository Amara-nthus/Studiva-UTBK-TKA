import { c as createServerRpc } from "./createServerRpc-Ejq-_fzx.mjs";
import { a as createServerFn } from "./server-DDQ41ls2.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CuXDYw0K.mjs";
import { s as supabaseAdmin } from "./client.server-U_pH-Evd.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, b as booleanType, s as stringType, a as arrayType, n as numberType } from "../_libs/zod.mjs";
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
const listNotes_createServerFn_handler = createServerRpc({
  id: "8c6016df94df755859f504c92677f7275e4d40af73762d0905338113191d1474",
  name: "listNotes",
  filename: "src/lib/notes.functions.ts"
}, (opts) => listNotes.__executeServer(opts));
const listNotes = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  search: stringType().max(120).optional(),
  mineOnly: booleanType().optional().default(false)
}).parse(input ?? {})).handler(listNotes_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    userId
  } = context;
  let q = supabaseAdmin.from("notes").select("id, user_id, title, status, summary, created_at").order("created_at", {
    ascending: false
  }).limit(100);
  if (data.mineOnly) q = q.eq("user_id", userId);
  if (data.search && data.search.trim()) {
    const term = data.search.trim().replace(/[%,]/g, " ");
    q = q.or(`title.ilike.%${term}%,summary.ilike.%${term}%`);
  }
  const {
    data: notes
  } = await q;
  const ids = Array.from(new Set((notes ?? []).map((n) => n.user_id)));
  const {
    data: profiles
  } = await supabaseAdmin.from("profiles").select("id, display_name, avatar_url, school").in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
  const pmap = new Map((profiles ?? []).map((p) => [p.id, p]));
  return {
    notes: (notes ?? []).map((n) => ({
      ...n,
      owner: pmap.get(n.user_id) ?? null
    }))
  };
});
const getNote_createServerFn_handler = createServerRpc({
  id: "97031b97c3b00aa95e7c2afc09de32de3e01610b2da73c3f7036f9e8c1dd8c6f",
  name: "getNote",
  filename: "src/lib/notes.functions.ts"
}, (opts) => getNote.__executeServer(opts));
const getNote = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(getNote_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    userId
  } = context;
  const [{
    data: note
  }, {
    data: cards
  }, {
    data: quiz
  }] = await Promise.all([supabaseAdmin.from("notes").select("*").eq("id", data.id).single(), supabaseAdmin.from("flashcards").select("*").eq("note_id", data.id).order("position"), supabaseAdmin.from("note_quiz").select("*").eq("note_id", data.id).order("position")]);
  const {
    data: owner
  } = note ? await supabaseAdmin.from("profiles").select("id, display_name, avatar_url, school").eq("id", note.user_id).single() : {
    data: null
  };
  const {
    data: signed
  } = note?.image_path ? await supabaseAdmin.storage.from("notes").createSignedUrl(note.image_path, 3600) : {
    data: null
  };
  return {
    note,
    owner,
    isOwner: note?.user_id === userId,
    cards: cards ?? [],
    quiz: quiz ?? [],
    imageUrl: signed?.signedUrl ?? null
  };
});
const deleteNote_createServerFn_handler = createServerRpc({
  id: "a5208b3e264091f6aa64b115bd63613e1b53f409fd60c01f55e8eb3a55fd9577",
  name: "deleteNote",
  filename: "src/lib/notes.functions.ts"
}, (opts) => deleteNote.__executeServer(opts));
const deleteNote = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(deleteNote_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    userId
  } = context;
  const {
    data: note
  } = await supabaseAdmin.from("notes").select("image_path, user_id").eq("id", data.id).single();
  if (!note || note.user_id !== userId) throw new Error("Tidak diizinkan");
  await supabaseAdmin.from("flashcards").delete().eq("note_id", data.id);
  await supabaseAdmin.from("note_quiz").delete().eq("note_id", data.id);
  if (note.image_path) await supabaseAdmin.storage.from("notes").remove([note.image_path]);
  await supabaseAdmin.from("notes").delete().eq("id", data.id);
  return {
    ok: true
  };
});
const analyzeNote_createServerFn_handler = createServerRpc({
  id: "9e635b4f7a75c53efbd09b6a22c6e5a75dcf97e10706dba12740c211401f8e20",
  name: "analyzeNote",
  filename: "src/lib/notes.functions.ts"
}, (opts) => analyzeNote.__executeServer(opts));
const analyzeNote = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  title: stringType().min(1).max(120),
  imagePath: stringType().min(3),
  mimeType: stringType().max(120).optional()
}).parse(input)).handler(analyzeNote_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    userId
  } = context;
  const {
    callLovableAI,
    extractJSON
  } = await import("./ai-gateway.server-Ckn08mbV.mjs");
  const mime = data.mimeType ?? "";
  const isImage = mime.startsWith("image/") || /\.(jpe?g|png|webp|gif|bmp)$/i.test(data.imagePath);
  const isPdf = mime === "application/pdf" || /\.pdf$/i.test(data.imagePath);
  const isText = mime.startsWith("text/") || /\.(txt|md|markdown|csv)$/i.test(data.imagePath);
  const isDoc = /\.(docx?|odt|rtf)$/i.test(data.imagePath) || mime.includes("word");
  const {
    data: created,
    error
  } = await supabaseAdmin.from("notes").insert({
    user_id: userId,
    title: data.title,
    image_path: data.imagePath,
    status: "processing",
    mime_type: mime || null
  }).select("id").single();
  if (error || !created) throw new Error(error?.message ?? "Gagal membuat catatan");
  const noteId = created.id;
  if (isDoc) {
    await supabaseAdmin.from("notes").update({
      status: "failed",
      summary: "Format DOC/DOCX belum didukung. Mohon konversi ke PDF atau teks."
    }).eq("id", noteId);
    throw new Error("Format DOC/DOCX belum didukung. Mohon upload PDF atau teks.");
  }
  try {
    const promptBase = `Kamu adalah tutor SMA berpengalaman. Analisis materi catatan pelajaran berikut.
Hasilkan JSON valid dengan skema:
{
  "summary": "ringkasan 2-3 kalimat dalam bahasa Indonesia",
  "flashcards": [{"front": "...", "back": "..."}],
  "quiz": [{"question": "...", "options": ["A","B","C","D"], "answer_index": 0, "explanation": "..."}]
}
Buat tepat 6 flashcards dan 5 soal pilihan ganda. Jangan tambahkan teks lain di luar JSON.`;
    let messageContent;
    if (isImage || isPdf) {
      const {
        data: signed,
        error: sErr
      } = await supabaseAdmin.storage.from("notes").createSignedUrl(data.imagePath, 600);
      if (sErr || !signed) throw new Error("Gagal membuat signed URL");
      messageContent = [{
        type: "text",
        text: promptBase
      }, {
        type: "image_url",
        image_url: {
          url: signed.signedUrl
        }
      }];
    } else if (isText) {
      const {
        data: blob,
        error: dErr
      } = await supabaseAdmin.storage.from("notes").download(data.imagePath);
      if (dErr || !blob) throw new Error("Gagal membaca berkas teks");
      const text = await blob.text();
      messageContent = `${promptBase}

Isi catatan:
${text.slice(0, 12e3)}`;
    } else {
      throw new Error("Format file tidak dikenali. Gunakan gambar, PDF, atau teks.");
    }
    const content = await callLovableAI({
      model: "google/gemini-3.5-flash",
      messages: [{
        role: "user",
        content: messageContent
      }],
      response_format: {
        type: "json_object"
      }
    });
    const parsed = extractJSON(content);
    if (parsed.flashcards?.length) {
      await supabaseAdmin.from("flashcards").insert(parsed.flashcards.slice(0, 8).map((c, i) => ({
        note_id: noteId,
        user_id: userId,
        front: c.front,
        back: c.back,
        position: i
      })));
    }
    if (parsed.quiz?.length) {
      await supabaseAdmin.from("note_quiz").insert(parsed.quiz.slice(0, 6).map((q, i) => ({
        note_id: noteId,
        user_id: userId,
        question: q.question,
        options: q.options,
        answer_index: q.answer_index,
        explanation: q.explanation,
        position: i
      })));
    }
    await supabaseAdmin.from("notes").update({
      status: "ready",
      summary: parsed.summary ?? null
    }).eq("id", noteId);
    return {
      noteId,
      ok: true
    };
  } catch (e) {
    await supabaseAdmin.from("notes").update({
      status: "failed"
    }).eq("id", noteId);
    throw e instanceof Error ? e : new Error("Analisis gagal");
  }
});
const submitNoteQuiz_createServerFn_handler = createServerRpc({
  id: "f2a931f0183c680d8c1812d37fc4b22fb873c02ac9f021972915af61a8715608",
  name: "submitNoteQuiz",
  filename: "src/lib/notes.functions.ts"
}, (opts) => submitNoteQuiz.__executeServer(opts));
const submitNoteQuiz = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  noteId: stringType().uuid(),
  answers: arrayType(objectType({
    quizId: stringType().uuid(),
    chosen: numberType().int()
  }))
}).parse(input)).handler(submitNoteQuiz_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    userId
  } = context;
  const {
    data: quiz
  } = await supabaseAdmin.from("note_quiz").select("id, answer_index").eq("note_id", data.noteId);
  const map = new Map((quiz ?? []).map((q) => [q.id, q.answer_index]));
  let correct = 0;
  for (const a of data.answers) if (map.get(a.quizId) === a.chosen) correct++;
  const {
    data: stats
  } = await supabaseAdmin.from("user_stats").select("exp").eq("user_id", userId).single();
  await supabaseAdmin.from("user_stats").update({
    exp: (stats?.exp ?? 0) + correct * 5,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("user_id", userId);
  return {
    correct,
    total: data.answers.length
  };
});
export {
  analyzeNote_createServerFn_handler,
  deleteNote_createServerFn_handler,
  getNote_createServerFn_handler,
  listNotes_createServerFn_handler,
  submitNoteQuiz_createServerFn_handler
};

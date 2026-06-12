import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Global list with optional search query (any authenticated user sees all notes)
export const listNotes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      search: z.string().max(120).optional(),
      mineOnly: z.boolean().optional().default(false),
    }).parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context;
    let q = supabaseAdmin
      .from("notes")
      .select("id, user_id, title, status, summary, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (data.mineOnly) q = q.eq("user_id", userId);
    if (data.search && data.search.trim()) {
      const term = data.search.trim().replace(/[%,]/g, " ");
      q = q.or(`title.ilike.%${term}%,summary.ilike.%${term}%`);
    }
    const { data: notes } = await q;
    const ids = Array.from(new Set((notes ?? []).map((n) => n.user_id)));
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, display_name, avatar_url, school")
      .in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
    const pmap = new Map((profiles ?? []).map((p) => [p.id, p]));
    return {
      notes: (notes ?? []).map((n) => ({ ...n, owner: pmap.get(n.user_id) ?? null })),
    };
  });

export const getNote = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const [{ data: note }, { data: cards }, { data: quiz }] = await Promise.all([
      supabaseAdmin.from("notes").select("*").eq("id", data.id).single(),
      supabaseAdmin.from("flashcards").select("*").eq("note_id", data.id).order("position"),
      supabaseAdmin.from("note_quiz").select("*").eq("note_id", data.id).order("position"),
    ]);
    const { data: owner } = note
      ? await supabaseAdmin.from("profiles").select("id, display_name, avatar_url, school").eq("id", note.user_id).single()
      : { data: null };
    const { data: signed } = note?.image_path
      ? await supabaseAdmin.storage.from("notes").createSignedUrl(note.image_path, 3600)
      : { data: null };
    return {
      note,
      owner,
      isOwner: note?.user_id === userId,
      cards: cards ?? [],
      quiz: quiz ?? [],
      imageUrl: signed?.signedUrl ?? null,
    };
  });

export const deleteNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { data: note } = await supabaseAdmin.from("notes").select("image_path, user_id").eq("id", data.id).single();
    if (!note || note.user_id !== userId) throw new Error("Tidak diizinkan");
    await supabaseAdmin.from("flashcards").delete().eq("note_id", data.id);
    await supabaseAdmin.from("note_quiz").delete().eq("note_id", data.id);
    if (note.image_path) await supabaseAdmin.storage.from("notes").remove([note.image_path]);
    await supabaseAdmin.from("notes").delete().eq("id", data.id);
    return { ok: true };
  });

export const analyzeNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      title: z.string().min(1).max(120),
      imagePath: z.string().min(3),
      mimeType: z.string().max(120).optional(),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { callLovableAI, extractJSON } = await import("./ai-gateway.server");

    const mime = data.mimeType ?? "";
    const isImage = mime.startsWith("image/") || /\.(jpe?g|png|webp|gif|bmp)$/i.test(data.imagePath);
    const isPdf = mime === "application/pdf" || /\.pdf$/i.test(data.imagePath);
    const isText = mime.startsWith("text/") || /\.(txt|md|markdown|csv)$/i.test(data.imagePath);
    const isDoc = /\.(docx?|odt|rtf)$/i.test(data.imagePath) || mime.includes("word");

    const { data: created, error } = await supabaseAdmin
      .from("notes")
      .insert({ user_id: userId, title: data.title, image_path: data.imagePath, status: "processing", mime_type: mime || null })
      .select("id")
      .single();
    if (error || !created) throw new Error(error?.message ?? "Gagal membuat catatan");
    const noteId = created.id;

    if (isDoc) {
      await supabaseAdmin.from("notes").update({ status: "failed", summary: "Format DOC/DOCX belum didukung. Mohon konversi ke PDF atau teks." }).eq("id", noteId);
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

      let messageContent: import("./ai-gateway.server").ChatMessage["content"];

      if (isImage || isPdf) {
        const { data: signed, error: sErr } = await supabaseAdmin.storage
          .from("notes")
          .createSignedUrl(data.imagePath, 600);
        if (sErr || !signed) throw new Error("Gagal membuat signed URL");
        messageContent = [
          { type: "text", text: promptBase },
          { type: "image_url", image_url: { url: signed.signedUrl } },
        ];
      } else if (isText) {
        const { data: blob, error: dErr } = await supabaseAdmin.storage.from("notes").download(data.imagePath);
        if (dErr || !blob) throw new Error("Gagal membaca berkas teks");
        const text = await blob.text();
        messageContent = `${promptBase}\n\nIsi catatan:\n${text.slice(0, 12000)}`;
      } else {
        throw new Error("Format file tidak dikenali. Gunakan gambar, PDF, atau teks.");
      }

      const content = await callLovableAI({
        model: "google/gemini-3.5-flash",
        messages: [{ role: "user", content: messageContent }],
        response_format: { type: "json_object" },
      });

      const parsed = extractJSON<{
        summary: string;
        flashcards: Array<{ front: string; back: string }>;
        quiz: Array<{ question: string; options: string[]; answer_index: number; explanation: string }>;
      }>(content);

      if (parsed.flashcards?.length) {
        await supabaseAdmin.from("flashcards").insert(
          parsed.flashcards.slice(0, 8).map((c, i) => ({
            note_id: noteId,
            user_id: userId,
            front: c.front,
            back: c.back,
            position: i,
          })),
        );
      }
      if (parsed.quiz?.length) {
        await supabaseAdmin.from("note_quiz").insert(
          parsed.quiz.slice(0, 6).map((q, i) => ({
            note_id: noteId,
            user_id: userId,
            question: q.question,
            options: q.options,
            answer_index: q.answer_index,
            explanation: q.explanation,
            position: i,
          })),
        );
      }

      await supabaseAdmin
        .from("notes")
        .update({ status: "ready", summary: parsed.summary ?? null })
        .eq("id", noteId);

      return { noteId, ok: true };
    } catch (e) {
      await supabaseAdmin.from("notes").update({ status: "failed" }).eq("id", noteId);
      throw e instanceof Error ? e : new Error("Analisis gagal");
    }
  });

export const submitNoteQuiz = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      noteId: z.string().uuid(),
      answers: z.array(z.object({ quizId: z.string().uuid(), chosen: z.number().int() })),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context;
    // Quiz rows are readable by any authenticated user now (we no longer scope by user_id)
    const { data: quiz } = await supabaseAdmin
      .from("note_quiz")
      .select("id, answer_index")
      .eq("note_id", data.noteId);
    const map = new Map((quiz ?? []).map((q) => [q.id, q.answer_index]));
    let correct = 0;
    for (const a of data.answers) if (map.get(a.quizId) === a.chosen) correct++;
    const { data: stats } = await supabaseAdmin
      .from("user_stats")
      .select("exp")
      .eq("user_id", userId)
      .single();
    await supabaseAdmin
      .from("user_stats")
      .update({
        exp: (stats?.exp ?? 0) + correct * 5,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);
    return { correct, total: data.answers.length };
  });

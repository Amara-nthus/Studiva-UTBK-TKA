## Scope

Five features on top of the existing Studiva app.

### 1. Forum komunitas
- New tables: `forum_posts` (user_id, title, body, created_at), `forum_comments` (post_id, user_id, body), `forum_likes` (post_id, user_id, unique).
- RLS: all authenticated users can SELECT; INSERT/UPDATE/DELETE only own rows.
- Server fns in `src/lib/forum.functions.ts`: listPosts (with like count + comment count + liked-by-me), getPost (with comments), createPost, createComment, toggleLike, deletePost/Comment (owner only).
- Route `/forum` (feed + composer) and `/forum/$id` (post detail + comments).
- Add nav link in AppShell.

### 2. Persistent study timer
- Currently the timer state lives in the `/timer` route. Move it to a global React context (`StudyTimerProvider`) mounted inside `_authenticated/route.tsx`, so it keeps ticking while the user navigates anywhere in the app.
- Persist `sessionId`, `startedAt`, and mode in `localStorage` so it survives refresh (resyncs elapsed seconds from `startedAt`).
- Show a floating compact pill in the AppShell header when a session is active and the user is not on `/timer`.
- The `/timer` page reads from the same context instead of holding its own state.

### 3. Larger SNBT/TKA simulations
- Update `src/routes/_authenticated/simulasi.tsx` to generate 180 questions per SNBT session (split across the standard SNBT subtests: Penalaran Umum, Pengetahuan & Pemahaman Umum, Kemampuan Memahami Bacaan & Menulis, Pengetahuan Kuantitatif, Literasi Bahasa Indonesia, Literasi Bahasa Inggris, Penalaran Matematika — roughly 20–30 each to total 180).
- TKA stays simpler but bumped to ~60 questions per session for depth.
- Generation: use Lovable AI (`google/gemini-2.5-flash`) in a new server fn `generateSimulationQuestions` that returns 180 MCQs in batches (call AI multiple times by subtest to avoid token blowups). Cache the generated set in the `simulations` table or a new `simulation_questions` table keyed by attempt id.
- Add timer + section navigator UI; submit calculates score on the server.

### 4. Note uploads accept any file type
- Storage `notes` bucket: already accepts any MIME; only the client `<input>` restricts to images.
- Update `catatan.index.tsx` to allow PDF/DOC/DOCX/TXT/MD plus images.
- In `analyzeNote` server fn: branch on file extension. For images → existing vision pipeline. For PDFs → fetch the signed URL and pass `{ type: "file", file: { url } }` to Gemini (Gemini supports PDF input). For plain text (txt/md) → read text from storage and send as text content. For DOC/DOCX → reject with a friendly error message asking user to upload PDF (DOCX parsing isn't available in the Worker runtime).
- Update `notes` table to store `mime_type` for proper preview rendering.

### 5. AI weakness analysis after quiz/simulation
- New server fn `analyzeWeakness({ kind: "note_quiz" | "snbt" | "tka", attemptId })` that pulls the wrong-answer questions, sends them to Lovable AI, and returns: `{ summary, weak_topics: [{ topic, why, recommendation }], suggested_drills: string[] }`.
- Persist results in a new `weakness_reports` table (user_id, kind, attempt_id, payload jsonb).
- Show the analysis automatically on the quiz result screen and on the simulation result screen with a "Analisis Kelemahan AI" card.

## Technical notes

- All new server fns use `requireSupabaseAuth`; cross-user reads in forum (post author profile) use `supabaseAdmin` like the existing leaderboards.
- Schema changes ship in one migration (forum tables + `weakness_reports` + `simulation_questions` + `notes.mime_type` column) with GRANTs and RLS.
- StudyTimerContext lives in `src/components/StudyTimerProvider.tsx`, wraps the authenticated outlet, exposes `{ session, elapsed, start, stop, mode }`. Tick interval runs once globally.

## Files

**New**
- `src/lib/forum.functions.ts`
- `src/lib/weakness.functions.ts`
- `src/components/StudyTimerProvider.tsx`
- `src/components/StudyTimerPill.tsx`
- `src/routes/_authenticated/forum.index.tsx`
- `src/routes/_authenticated/forum.$id.tsx`
- One Supabase migration

**Edited**
- `src/lib/notes.functions.ts` (multi-format ingestion)
- `src/lib/studiva.functions.ts` or new `src/lib/simulasi.functions.ts` (180-question generator + scoring)
- `src/routes/_authenticated/simulasi.tsx` (long-form UI with section nav)
- `src/routes/_authenticated/timer.tsx` (consume context)
- `src/routes/_authenticated/route.tsx` (mount provider)
- `src/routes/_authenticated/catatan.index.tsx` (accept all files)
- `src/routes/_authenticated/catatan.$id.tsx` (show weakness analysis after quiz)
- `src/components/AppShell.tsx` (forum nav + timer pill)

## Risks / caveats

- Generating 180 SNBT questions in one AI call exceeds context; we'll fan out per subtest (7 calls ~25 questions each). First-time generation may take ~30–60s; we'll show a loading state and persist the set so re-takes are instant.
- DOC/DOCX won't be parsed (no Worker-compatible library); we'll surface a clear "please upload PDF" message.
- The persistent timer can't actually keep counting when the browser tab is closed — it counts wall-clock elapsed time on resume using `started_at`, which matches user expectation ("selama user membuka website").

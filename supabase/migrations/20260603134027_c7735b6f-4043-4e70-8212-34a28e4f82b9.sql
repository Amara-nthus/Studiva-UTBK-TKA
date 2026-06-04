-- 1. Make handle_new_user idempotent (avoid signup 500s when profile already exists)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_stats (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Never block signup because of a profile insert failure
  RETURN NEW;
END;
$$;

-- Ensure user_stats has a unique constraint on user_id for ON CONFLICT to work
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_stats_user_id_key'
  ) THEN
    ALTER TABLE public.user_stats ADD CONSTRAINT user_stats_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- 2. (Re)attach the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Notes: allow all authenticated users to view all notes (public catatan library)
DROP POLICY IF EXISTS notes_own_all ON public.notes;
CREATE POLICY notes_select_all_auth ON public.notes
  FOR SELECT TO authenticated USING (true);
CREATE POLICY notes_insert_own ON public.notes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY notes_update_own ON public.notes
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY notes_delete_own ON public.notes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS flashcards_own_all ON public.flashcards;
CREATE POLICY flashcards_select_all_auth ON public.flashcards
  FOR SELECT TO authenticated USING (true);
CREATE POLICY flashcards_write_own ON public.flashcards
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS note_quiz_own_all ON public.note_quiz;
CREATE POLICY note_quiz_select_all_auth ON public.note_quiz
  FOR SELECT TO authenticated USING (true);
CREATE POLICY note_quiz_write_own ON public.note_quiz
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Allow all authenticated to read the note images
CREATE POLICY "Notes images readable by authenticated"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'notes');

CREATE POLICY "Users can upload their own note image"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'notes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 4. Study sessions table (YPT-style timer)
CREATE TABLE public.study_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  session_date DATE NOT NULL DEFAULT (now() AT TIME ZONE 'Asia/Jakarta')::date,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.study_sessions TO authenticated;
GRANT ALL ON public.study_sessions TO service_role;

ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY study_select_all_auth ON public.study_sessions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY study_insert_own ON public.study_sessions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY study_update_own ON public.study_sessions
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_study_sessions_user_date ON public.study_sessions(user_id, session_date);
CREATE INDEX idx_study_sessions_date ON public.study_sessions(session_date);

-- Backfill profile + stats for any existing auth user that's missing them
INSERT INTO public.profiles (id, display_name)
SELECT u.id, COALESCE(u.raw_user_meta_data->>'display_name', u.raw_user_meta_data->>'full_name', SPLIT_PART(u.email,'@',1), 'Pelajar')
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_stats (user_id)
SELECT u.id FROM auth.users u
LEFT JOIN public.user_stats s ON s.user_id = u.id
WHERE s.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;
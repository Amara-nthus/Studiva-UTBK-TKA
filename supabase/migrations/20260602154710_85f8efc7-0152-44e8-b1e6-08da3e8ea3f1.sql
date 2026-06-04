
-- ENUMS
CREATE TYPE public.simulation_type AS ENUM ('snbt','tka');
CREATE TYPE public.note_status AS ENUM ('processing','ready','failed');

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Pelajar',
  avatar_url TEXT,
  school TEXT,
  target_university TEXT,
  target_major TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_all_auth" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert_own"     ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own"     ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- USER STATS
CREATE TABLE public.user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  exp INTEGER NOT NULL DEFAULT 0,
  snbt_best INTEGER NOT NULL DEFAULT 0,
  tka_best INTEGER NOT NULL DEFAULT 0,
  streak_current INTEGER NOT NULL DEFAULT 0,
  streak_longest INTEGER NOT NULL DEFAULT 0,
  last_quiz_date DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_stats TO authenticated;
GRANT ALL ON public.user_stats TO service_role;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stats_select_all_auth" ON public.user_stats FOR SELECT TO authenticated USING (true);
CREATE POLICY "stats_insert_own"      ON public.user_stats FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "stats_update_own"      ON public.user_stats FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- TRIGGER: auto-create profile + stats on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.user_stats (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- DAILY QUIZ (curated questions)
CREATE TABLE public.daily_quiz (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_date DATE NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  answer_index INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.daily_quiz TO authenticated;
GRANT ALL ON public.daily_quiz TO service_role;
ALTER TABLE public.daily_quiz ENABLE ROW LEVEL SECURITY;
CREATE POLICY "daily_quiz_read_auth" ON public.daily_quiz FOR SELECT TO authenticated USING (true);

-- DAILY QUIZ ATTEMPTS
CREATE TABLE public.daily_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES public.daily_quiz(id) ON DELETE CASCADE,
  chosen_index INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, quiz_id)
);
GRANT SELECT, INSERT ON public.daily_quiz_attempts TO authenticated;
GRANT ALL ON public.daily_quiz_attempts TO service_role;
ALTER TABLE public.daily_quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "attempts_select_own" ON public.daily_quiz_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "attempts_insert_own" ON public.daily_quiz_attempts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- SIMULATIONS
CREATE TABLE public.simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type public.simulation_type NOT NULL,
  score INTEGER NOT NULL,
  taken_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.simulations TO authenticated;
GRANT ALL ON public.simulations TO service_role;
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sim_select_own" ON public.simulations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "sim_insert_own" ON public.simulations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- NOTES (photo)
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  image_path TEXT NOT NULL,
  summary TEXT,
  status public.note_status NOT NULL DEFAULT 'processing',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notes TO authenticated;
GRANT ALL ON public.notes TO service_role;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notes_own_all" ON public.notes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- FLASHCARDS
CREATE TABLE public.flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.flashcards TO authenticated;
GRANT ALL ON public.flashcards TO service_role;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "flashcards_own_all" ON public.flashcards FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- NOTE QUIZ
CREATE TABLE public.note_quiz (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  answer_index INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.note_quiz TO authenticated;
GRANT ALL ON public.note_quiz TO service_role;
ALTER TABLE public.note_quiz ENABLE ROW LEVEL SECURITY;
CREATE POLICY "note_quiz_own_all" ON public.note_quiz FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- PSIKOTES
CREATE TABLE public.psikotes_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.psikotes_results TO authenticated;
GRANT ALL ON public.psikotes_results TO service_role;
ALTER TABLE public.psikotes_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "psikotes_own_select" ON public.psikotes_results FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "psikotes_own_insert" ON public.psikotes_results FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- STORAGE policies for 'notes' bucket
CREATE POLICY "notes_storage_select_own" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'notes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "notes_storage_insert_own" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'notes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "notes_storage_delete_own" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'notes' AND auth.uid()::text = (storage.foldername(name))[1]);


-- 1. Forum posts
CREATE TABLE public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.forum_posts TO authenticated;
GRANT ALL ON public.forum_posts TO service_role;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "forum_posts_select_all" ON public.forum_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "forum_posts_insert_own" ON public.forum_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "forum_posts_update_own" ON public.forum_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "forum_posts_delete_own" ON public.forum_posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 2. Forum comments
CREATE TABLE public.forum_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.forum_comments TO authenticated;
GRANT ALL ON public.forum_comments TO service_role;
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "forum_comments_select_all" ON public.forum_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "forum_comments_insert_own" ON public.forum_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "forum_comments_delete_own" ON public.forum_comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 3. Forum likes
CREATE TABLE public.forum_likes (
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.forum_likes TO authenticated;
GRANT ALL ON public.forum_likes TO service_role;
ALTER TABLE public.forum_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "forum_likes_select_all" ON public.forum_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "forum_likes_insert_own" ON public.forum_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "forum_likes_delete_own" ON public.forum_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 4. Weakness reports
CREATE TABLE public.weakness_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  kind TEXT NOT NULL,
  attempt_id UUID,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.weakness_reports TO authenticated;
GRANT ALL ON public.weakness_reports TO service_role;
ALTER TABLE public.weakness_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "weakness_select_own" ON public.weakness_reports FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "weakness_insert_own" ON public.weakness_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "weakness_delete_own" ON public.weakness_reports FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 5. Simulation questions cache
CREATE TABLE public.simulation_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  simulation_id UUID NOT NULL REFERENCES public.simulations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  section TEXT NOT NULL,
  position INT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  answer_index INT NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.simulation_questions TO authenticated;
GRANT ALL ON public.simulation_questions TO service_role;
ALTER TABLE public.simulation_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sim_q_select_own" ON public.simulation_questions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "sim_q_insert_own" ON public.simulation_questions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sim_q_delete_own" ON public.simulation_questions FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX simulation_questions_sim_idx ON public.simulation_questions(simulation_id, position);

-- 6. notes.mime_type
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS mime_type TEXT;

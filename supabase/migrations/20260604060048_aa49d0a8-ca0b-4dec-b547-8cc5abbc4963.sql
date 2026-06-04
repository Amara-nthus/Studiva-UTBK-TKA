
-- profiles: owner-only SELECT
DROP POLICY IF EXISTS "profiles_select_all_auth" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by authenticated" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

-- user_stats: owner-only SELECT
DROP POLICY IF EXISTS "user_stats_select_all_auth" ON public.user_stats;
DROP POLICY IF EXISTS "User stats viewable by authenticated" ON public.user_stats;
CREATE POLICY "user_stats_select_own" ON public.user_stats
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- study_sessions: owner-only SELECT
DROP POLICY IF EXISTS "study_select_all_auth" ON public.study_sessions;
CREATE POLICY "study_select_own" ON public.study_sessions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- storage: drop the duplicate INSERT policy
DROP POLICY IF EXISTS "Users can upload their own note image" ON storage.objects;

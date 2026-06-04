import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Start a new study session — returns the session id
export const startStudySession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { data, error } = await supabaseAdmin
      .from("study_sessions")
      .insert({ user_id: userId, duration_seconds: 0 })
      .select("id, started_at")
      .single();
    if (error || !data) throw new Error(error?.message ?? "Gagal memulai sesi");
    return data;
  });

// End / update a session with the recorded duration in seconds
export const endStudySession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      sessionId: z.string().uuid(),
      durationSeconds: z.number().int().min(0).max(60 * 60 * 12),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { error } = await supabaseAdmin
      .from("study_sessions")
      .update({
        duration_seconds: data.durationSeconds,
        ended_at: new Date().toISOString(),
      })
      .eq("id", data.sessionId)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    // Award EXP: 1 EXP per minute studied
    const expGain = Math.floor(data.durationSeconds / 60);
    if (expGain > 0) {
      const { data: stats } = await supabaseAdmin
        .from("user_stats")
        .select("exp")
        .eq("user_id", userId)
        .single();
      await supabaseAdmin
        .from("user_stats")
        .update({ exp: (stats?.exp ?? 0) + expGain, updated_at: new Date().toISOString() })
        .eq("user_id", userId);
    }
    return { ok: true, expGain };
  });

// Leaderboard: total seconds per user, today + this week + all time
export const getStudyLeaderboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { data: sessions } = await supabaseAdmin
      .from("study_sessions")
      .select("user_id, duration_seconds, session_date")
      .order("session_date", { ascending: false })
      .limit(2000);

    const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Jakarta" });
    const weekAgo = new Date(Date.now() - 7 * 86400000).toLocaleDateString("sv-SE", { timeZone: "Asia/Jakarta" });

    const sum = (filterFn: (s: { session_date: string }) => boolean) => {
      const acc = new Map<string, number>();
      for (const s of sessions ?? []) {
        if (!filterFn(s)) continue;
        acc.set(s.user_id, (acc.get(s.user_id) ?? 0) + (s.duration_seconds ?? 0));
      }
      return Array.from(acc, ([user_id, seconds]) => ({ user_id, seconds }))
        .sort((a, b) => b.seconds - a.seconds)
        .slice(0, 50);
    };

    const todayBoard = sum((s) => s.session_date === today);
    const weekBoard = sum((s) => s.session_date >= weekAgo);
    const allBoard = sum(() => true);

    const ids = Array.from(
      new Set([...todayBoard, ...weekBoard, ...allBoard].map((r) => r.user_id)),
    );
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, display_name, avatar_url, school")
      .in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
    const pmap = new Map((profiles ?? []).map((p) => [p.id, p]));
    const enrich = (rows: typeof todayBoard) =>
      rows.map((r) => ({ ...r, profile: pmap.get(r.user_id) ?? null }));

    const myToday = todayBoard.find((r) => r.user_id === userId)?.seconds ?? 0;
    const myWeek = weekBoard.find((r) => r.user_id === userId)?.seconds ?? 0;
    const myAll = allBoard.find((r) => r.user_id === userId)?.seconds ?? 0;

    return {
      today: enrich(todayBoard),
      week: enrich(weekBoard),
      all: enrich(allBoard),
      mine: { today: myToday, week: myWeek, all: myAll },
    };
  });

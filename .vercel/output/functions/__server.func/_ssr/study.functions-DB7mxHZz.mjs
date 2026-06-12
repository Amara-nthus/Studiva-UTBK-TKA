import { c as createServerRpc } from "./createServerRpc-Ejq-_fzx.mjs";
import { a as createServerFn } from "./server-DDQ41ls2.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CuXDYw0K.mjs";
import { s as supabaseAdmin } from "./client.server-U_pH-Evd.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, n as numberType, s as stringType } from "../_libs/zod.mjs";
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
const startStudySession_createServerFn_handler = createServerRpc({
  id: "d41a2e15d5dbe629bb11de842cee00c990b842ab69d01b2dbecbb04e76589f3c",
  name: "startStudySession",
  filename: "src/lib/study.functions.ts"
}, (opts) => startStudySession.__executeServer(opts));
const startStudySession = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(startStudySession_createServerFn_handler, async ({
  context
}) => {
  const {
    userId
  } = context;
  const {
    data,
    error
  } = await supabaseAdmin.from("study_sessions").insert({
    user_id: userId,
    duration_seconds: 0
  }).select("id, started_at").single();
  if (error || !data) throw new Error(error?.message ?? "Gagal memulai sesi");
  return data;
});
const endStudySession_createServerFn_handler = createServerRpc({
  id: "06a20202dcb256a8f7052ce7cd92cbfefccf21496c3bc3fc4ff50b29ec0055a9",
  name: "endStudySession",
  filename: "src/lib/study.functions.ts"
}, (opts) => endStudySession.__executeServer(opts));
const endStudySession = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  sessionId: stringType().uuid(),
  durationSeconds: numberType().int().min(0).max(60 * 60 * 12)
}).parse(input)).handler(endStudySession_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    userId
  } = context;
  const {
    error
  } = await supabaseAdmin.from("study_sessions").update({
    duration_seconds: data.durationSeconds,
    ended_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", data.sessionId).eq("user_id", userId);
  if (error) throw new Error(error.message);
  const expGain = Math.floor(data.durationSeconds / 60);
  if (expGain > 0) {
    const {
      data: stats
    } = await supabaseAdmin.from("user_stats").select("exp").eq("user_id", userId).single();
    await supabaseAdmin.from("user_stats").update({
      exp: (stats?.exp ?? 0) + expGain,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("user_id", userId);
  }
  return {
    ok: true,
    expGain
  };
});
const getStudyLeaderboard_createServerFn_handler = createServerRpc({
  id: "dd75182359418cf683043cc726054a6153b67fe1167893f5821521d4cd904410",
  name: "getStudyLeaderboard",
  filename: "src/lib/study.functions.ts"
}, (opts) => getStudyLeaderboard.__executeServer(opts));
const getStudyLeaderboard = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getStudyLeaderboard_createServerFn_handler, async ({
  context
}) => {
  const {
    userId
  } = context;
  const {
    data: sessions
  } = await supabaseAdmin.from("study_sessions").select("user_id, duration_seconds, session_date").order("session_date", {
    ascending: false
  }).limit(2e3);
  const today = (/* @__PURE__ */ new Date()).toLocaleDateString("sv-SE", {
    timeZone: "Asia/Jakarta"
  });
  const weekAgo = new Date(Date.now() - 7 * 864e5).toLocaleDateString("sv-SE", {
    timeZone: "Asia/Jakarta"
  });
  const sum = (filterFn) => {
    const acc = /* @__PURE__ */ new Map();
    for (const s of sessions ?? []) {
      if (!filterFn(s)) continue;
      acc.set(s.user_id, (acc.get(s.user_id) ?? 0) + (s.duration_seconds ?? 0));
    }
    return Array.from(acc, ([user_id, seconds]) => ({
      user_id,
      seconds
    })).sort((a, b) => b.seconds - a.seconds).slice(0, 50);
  };
  const todayBoard = sum((s) => s.session_date === today);
  const weekBoard = sum((s) => s.session_date >= weekAgo);
  const allBoard = sum(() => true);
  const ids = Array.from(new Set([...todayBoard, ...weekBoard, ...allBoard].map((r) => r.user_id)));
  const {
    data: profiles
  } = await supabaseAdmin.from("profiles").select("id, display_name, avatar_url, school").in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
  const pmap = new Map((profiles ?? []).map((p) => [p.id, p]));
  const enrich = (rows) => rows.map((r) => ({
    ...r,
    profile: pmap.get(r.user_id) ?? null
  }));
  const myToday = todayBoard.find((r) => r.user_id === userId)?.seconds ?? 0;
  const myWeek = weekBoard.find((r) => r.user_id === userId)?.seconds ?? 0;
  const myAll = allBoard.find((r) => r.user_id === userId)?.seconds ?? 0;
  return {
    today: enrich(todayBoard),
    week: enrich(weekBoard),
    all: enrich(allBoard),
    mine: {
      today: myToday,
      week: myWeek,
      all: myAll
    }
  };
});
export {
  endStudySession_createServerFn_handler,
  getStudyLeaderboard_createServerFn_handler,
  startStudySession_createServerFn_handler
};

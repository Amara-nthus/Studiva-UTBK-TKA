import { c as createServerRpc } from "./createServerRpc-Ejq-_fzx.mjs";
import { a as createServerFn } from "./server-DDQ41ls2.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CuXDYw0K.mjs";
import { s as supabaseAdmin } from "./client.server-U_pH-Evd.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
const listForumPosts_createServerFn_handler = createServerRpc({
  id: "f49cecec9b71328a768e68893551c4da00cf336eab2402382e2f3ef406b06f27",
  name: "listForumPosts",
  filename: "src/lib/forum.functions.ts"
}, (opts) => listForumPosts.__executeServer(opts));
const listForumPosts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listForumPosts_createServerFn_handler, async ({
  context
}) => {
  const {
    userId
  } = context;
  const {
    data: posts
  } = await supabaseAdmin.from("forum_posts").select("id, user_id, title, body, created_at").order("created_at", {
    ascending: false
  }).limit(100);
  const ids = (posts ?? []).map((p) => p.id);
  const [{
    data: likes
  }, {
    data: comments
  }, {
    data: profiles
  }] = await Promise.all([supabaseAdmin.from("forum_likes").select("post_id, user_id").in("post_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]), supabaseAdmin.from("forum_comments").select("post_id").in("post_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]), supabaseAdmin.from("profiles").select("id, display_name, avatar_url, school").in("id", Array.from(new Set((posts ?? []).map((p) => p.user_id))).length ? Array.from(new Set((posts ?? []).map((p) => p.user_id))) : ["00000000-0000-0000-0000-000000000000"])]);
  const likeMap = /* @__PURE__ */ new Map();
  for (const l of likes ?? []) {
    const cur = likeMap.get(l.post_id) ?? {
      count: 0,
      mine: false
    };
    cur.count++;
    if (l.user_id === userId) cur.mine = true;
    likeMap.set(l.post_id, cur);
  }
  const commentMap = /* @__PURE__ */ new Map();
  for (const c of comments ?? []) commentMap.set(c.post_id, (commentMap.get(c.post_id) ?? 0) + 1);
  const pmap = new Map((profiles ?? []).map((p) => [p.id, p]));
  return {
    posts: (posts ?? []).map((p) => ({
      ...p,
      owner: pmap.get(p.user_id) ?? null,
      likes: likeMap.get(p.id)?.count ?? 0,
      liked: likeMap.get(p.id)?.mine ?? false,
      comments: commentMap.get(p.id) ?? 0
    }))
  };
});
const getForumPost_createServerFn_handler = createServerRpc({
  id: "5aa53f35defb59d3cb1a0fade1db3841d72a4a5cc85779e77a807b368d931e5f",
  name: "getForumPost",
  filename: "src/lib/forum.functions.ts"
}, (opts) => getForumPost.__executeServer(opts));
const getForumPost = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(getForumPost_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    userId
  } = context;
  const {
    data: post
  } = await supabaseAdmin.from("forum_posts").select("*").eq("id", data.id).single();
  if (!post) throw new Error("Tidak ditemukan");
  const [{
    data: comments
  }, {
    data: likes
  }] = await Promise.all([supabaseAdmin.from("forum_comments").select("*").eq("post_id", data.id).order("created_at"), supabaseAdmin.from("forum_likes").select("user_id").eq("post_id", data.id)]);
  const userIds = Array.from(/* @__PURE__ */ new Set([post.user_id, ...(comments ?? []).map((c) => c.user_id)]));
  const {
    data: profiles
  } = await supabaseAdmin.from("profiles").select("id, display_name, avatar_url, school").in("id", userIds);
  const pmap = new Map((profiles ?? []).map((p) => [p.id, p]));
  return {
    post: {
      ...post,
      owner: pmap.get(post.user_id) ?? null
    },
    comments: (comments ?? []).map((c) => ({
      ...c,
      owner: pmap.get(c.user_id) ?? null
    })),
    likes: likes?.length ?? 0,
    liked: (likes ?? []).some((l) => l.user_id === userId),
    isOwner: post.user_id === userId
  };
});
const createForumPost_createServerFn_handler = createServerRpc({
  id: "42c10c44ec44c8a564c32660aa78d420b665c7e2c54436c77a58b17bf2cf5269",
  name: "createForumPost",
  filename: "src/lib/forum.functions.ts"
}, (opts) => createForumPost.__executeServer(opts));
const createForumPost = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  title: stringType().min(3).max(200),
  body: stringType().min(3).max(5e3)
}).parse(input)).handler(createForumPost_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: created,
    error
  } = await supabase.from("forum_posts").insert({
    user_id: userId,
    title: data.title,
    body: data.body
  }).select("id").single();
  if (error || !created) throw new Error(error?.message ?? "Gagal post");
  return created;
});
const createForumComment_createServerFn_handler = createServerRpc({
  id: "da71abdc6ae6431af69235c4d91e6fa9853c1b504b4d02e1a7ec6564b464ae15",
  name: "createForumComment",
  filename: "src/lib/forum.functions.ts"
}, (opts) => createForumComment.__executeServer(opts));
const createForumComment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  postId: stringType().uuid(),
  body: stringType().min(1).max(2e3)
}).parse(input)).handler(createForumComment_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    error
  } = await supabase.from("forum_comments").insert({
    post_id: data.postId,
    user_id: userId,
    body: data.body
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const toggleForumLike_createServerFn_handler = createServerRpc({
  id: "1b1aba401a87d4ea8433b2641302d5c984df03ea2ec336621dae8aafd3444b2e",
  name: "toggleForumLike",
  filename: "src/lib/forum.functions.ts"
}, (opts) => toggleForumLike.__executeServer(opts));
const toggleForumLike = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  postId: stringType().uuid()
}).parse(input)).handler(toggleForumLike_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: existing
  } = await supabase.from("forum_likes").select("post_id").eq("post_id", data.postId).eq("user_id", userId).maybeSingle();
  if (existing) {
    await supabase.from("forum_likes").delete().eq("post_id", data.postId).eq("user_id", userId);
    return {
      liked: false
    };
  }
  await supabase.from("forum_likes").insert({
    post_id: data.postId,
    user_id: userId
  });
  return {
    liked: true
  };
});
const deleteForumPost_createServerFn_handler = createServerRpc({
  id: "b6ae636ddb2f2b82ccd2eb0561b70aa2fc692e9536dda0011b6b73d4630be16a",
  name: "deleteForumPost",
  filename: "src/lib/forum.functions.ts"
}, (opts) => deleteForumPost.__executeServer(opts));
const deleteForumPost = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(deleteForumPost_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    error
  } = await supabase.from("forum_posts").delete().eq("id", data.id).eq("user_id", userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  createForumComment_createServerFn_handler,
  createForumPost_createServerFn_handler,
  deleteForumPost_createServerFn_handler,
  getForumPost_createServerFn_handler,
  listForumPosts_createServerFn_handler,
  toggleForumLike_createServerFn_handler
};

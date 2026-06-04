import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const listForumPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { data: posts } = await supabaseAdmin
      .from("forum_posts")
      .select("id, user_id, title, body, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    const ids = (posts ?? []).map((p) => p.id);
    const [{ data: likes }, { data: comments }, { data: profiles }] = await Promise.all([
      supabaseAdmin.from("forum_likes").select("post_id, user_id").in("post_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]),
      supabaseAdmin.from("forum_comments").select("post_id").in("post_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]),
      supabaseAdmin.from("profiles").select("id, display_name, avatar_url, school").in(
        "id",
        Array.from(new Set((posts ?? []).map((p) => p.user_id))).length
          ? Array.from(new Set((posts ?? []).map((p) => p.user_id)))
          : ["00000000-0000-0000-0000-000000000000"],
      ),
    ]);
    const likeMap = new Map<string, { count: number; mine: boolean }>();
    for (const l of likes ?? []) {
      const cur = likeMap.get(l.post_id) ?? { count: 0, mine: false };
      cur.count++;
      if (l.user_id === userId) cur.mine = true;
      likeMap.set(l.post_id, cur);
    }
    const commentMap = new Map<string, number>();
    for (const c of comments ?? []) commentMap.set(c.post_id, (commentMap.get(c.post_id) ?? 0) + 1);
    const pmap = new Map((profiles ?? []).map((p) => [p.id, p]));
    return {
      posts: (posts ?? []).map((p) => ({
        ...p,
        owner: pmap.get(p.user_id) ?? null,
        likes: likeMap.get(p.id)?.count ?? 0,
        liked: likeMap.get(p.id)?.mine ?? false,
        comments: commentMap.get(p.id) ?? 0,
      })),
    };
  });

export const getForumPost = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { data: post } = await supabaseAdmin.from("forum_posts").select("*").eq("id", data.id).single();
    if (!post) throw new Error("Tidak ditemukan");
    const [{ data: comments }, { data: likes }] = await Promise.all([
      supabaseAdmin.from("forum_comments").select("*").eq("post_id", data.id).order("created_at"),
      supabaseAdmin.from("forum_likes").select("user_id").eq("post_id", data.id),
    ]);
    const userIds = Array.from(new Set([post.user_id, ...(comments ?? []).map((c) => c.user_id)]));
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, display_name, avatar_url, school")
      .in("id", userIds);
    const pmap = new Map((profiles ?? []).map((p) => [p.id, p]));
    return {
      post: { ...post, owner: pmap.get(post.user_id) ?? null },
      comments: (comments ?? []).map((c) => ({ ...c, owner: pmap.get(c.user_id) ?? null })),
      likes: likes?.length ?? 0,
      liked: (likes ?? []).some((l) => l.user_id === userId),
      isOwner: post.user_id === userId,
    };
  });

export const createForumPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ title: z.string().min(3).max(200), body: z.string().min(3).max(5000) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: created, error } = await supabase
      .from("forum_posts")
      .insert({ user_id: userId, title: data.title, body: data.body })
      .select("id")
      .single();
    if (error || !created) throw new Error(error?.message ?? "Gagal post");
    return created;
  });

export const createForumComment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ postId: z.string().uuid(), body: z.string().min(1).max(2000) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("forum_comments")
      .insert({ post_id: data.postId, user_id: userId, body: data.body });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const toggleForumLike = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ postId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: existing } = await supabase
      .from("forum_likes")
      .select("post_id")
      .eq("post_id", data.postId)
      .eq("user_id", userId)
      .maybeSingle();
    if (existing) {
      await supabase.from("forum_likes").delete().eq("post_id", data.postId).eq("user_id", userId);
      return { liked: false };
    }
    await supabase.from("forum_likes").insert({ post_id: data.postId, user_id: userId });
    return { liked: true };
  });

export const deleteForumPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("forum_posts").delete().eq("id", data.id).eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { getForumPost, createForumComment, toggleForumLike, deleteForumPost } from "@/lib/forum.functions";
import { ArrowLeft, Heart, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/forum/$id")({
  component: ForumDetail,
});

function ForumDetail() {
  const { id } = Route.useParams();
  const router = useRouter();
  const qc = useQueryClient();
  const getFn = useServerFn(getForumPost);
  const commentFn = useServerFn(createForumComment);
  const likeFn = useServerFn(toggleForumLike);
  const delFn = useServerFn(deleteForumPost);
  const q = useQuery({ queryKey: ["forum", id], queryFn: () => getFn({ data: { id } }) });
  const [body, setBody] = useState("");

  async function comment() {
    if (body.trim().length < 1) return;
    try {
      await commentFn({ data: { postId: id, body: body.trim() } });
      setBody("");
      qc.invalidateQueries({ queryKey: ["forum", id] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal");
    }
  }

  async function like() {
    try {
      await likeFn({ data: { postId: id } });
      qc.invalidateQueries({ queryKey: ["forum", id] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal");
    }
  }

  async function del() {
    if (!confirm("Hapus post ini permanen?")) return;
    try {
      await delFn({ data: { id } });
      router.navigate({ to: "/forum" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal");
    }
  }

  if (q.isLoading) return <AppShell><p className="text-brand/40">Memuat…</p></AppShell>;
  if (!q.data?.post) return <AppShell><p>Post tidak ditemukan.</p></AppShell>;
  const { post, comments, likes, liked, isOwner } = q.data;

  return (
    <AppShell>
      <Link to="/forum" className="inline-flex items-center gap-1 text-sm text-brand/60 hover:text-accent mb-4">
        <ArrowLeft className="size-4" /> Kembali ke forum
      </Link>

      <article className="bg-card rounded-3xl border border-brand/10 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          {post.owner?.avatar_url ? (
            <img src={post.owner.avatar_url} alt="" className="size-10 rounded-full" />
          ) : (
            <div className="size-10 rounded-full bg-accent/20 grid place-items-center text-sm font-bold text-accent">
              {(post.owner?.display_name ?? "?").charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <div className="font-bold text-sm">{post.owner?.display_name ?? "Pelajar"} {isOwner && <span className="text-[10px] text-accent ml-1">· kamu</span>}</div>
            <div className="text-xs text-brand/40">{new Date(post.created_at).toLocaleString("id-ID")}</div>
          </div>
          {isOwner && (
            <button onClick={del} className="text-xs font-bold text-destructive hover:underline inline-flex items-center gap-1">
              <Trash2 className="size-3.5" /> Hapus
            </button>
          )}
        </div>
        <h1 className="text-3xl font-extrabold mb-3">{post.title}</h1>
        <p className="text-brand/80 whitespace-pre-wrap">{post.body}</p>
        <div className="flex items-center gap-4 pt-4 mt-4 border-t border-brand/5">
          <button
            onClick={like}
            className={"inline-flex items-center gap-1.5 font-bold " + (liked ? "text-destructive" : "text-brand/60 hover:text-destructive")}
          >
            <Heart className={"size-4 " + (liked ? "fill-current" : "")} /> {likes}
          </button>
        </div>
      </article>

      <section>
        <h2 className="font-extrabold mb-3">Komentar ({comments.length})</h2>
        <div className="flex gap-2 mb-4">
          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && comment()}
            placeholder="Tulis komentar…"
            maxLength={2000}
            className="flex-1 px-4 py-3 rounded-xl border border-brand/15 bg-card focus:outline-none focus:border-accent"
          />
          <button onClick={comment} className="px-4 bg-brand text-brand-foreground rounded-xl font-bold inline-flex items-center gap-2">
            <Send className="size-4" />
          </button>
        </div>
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="bg-card rounded-2xl border border-brand/5 p-4">
              <div className="flex items-center gap-2 mb-1">
                {c.owner?.avatar_url ? (
                  <img src={c.owner.avatar_url} alt="" className="size-6 rounded-full" />
                ) : (
                  <div className="size-6 rounded-full bg-accent/20 grid place-items-center text-[10px] font-bold text-accent">
                    {(c.owner?.display_name ?? "?").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-xs font-bold">{c.owner?.display_name ?? "Pelajar"}</div>
                <div className="text-[10px] text-brand/40">{new Date(c.created_at).toLocaleString("id-ID")}</div>
              </div>
              <p className="text-sm whitespace-pre-wrap pl-8">{c.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}

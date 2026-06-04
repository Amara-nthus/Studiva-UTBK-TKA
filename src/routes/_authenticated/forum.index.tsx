import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { listForumPosts, createForumPost, toggleForumLike } from "@/lib/forum.functions";
import { Users, Heart, MessageSquare, Send, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/forum/")({
  component: ForumIndex,
});

function ForumIndex() {
  const listFn = useServerFn(listForumPosts);
  const createFn = useServerFn(createForumPost);
  const likeFn = useServerFn(toggleForumLike);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["forum"], queryFn: () => listFn() });
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (title.trim().length < 3 || body.trim().length < 3) {
      toast.error("Judul & isi minimal 3 karakter");
      return;
    }
    setSubmitting(true);
    try {
      await createFn({ data: { title: title.trim(), body: body.trim() } });
      setTitle("");
      setBody("");
      setComposing(false);
      qc.invalidateQueries({ queryKey: ["forum"] });
      toast.success("Postingan terbit!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal");
    } finally {
      setSubmitting(false);
    }
  }

  async function like(id: string) {
    try {
      await likeFn({ data: { postId: id } });
      qc.invalidateQueries({ queryKey: ["forum"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal");
    }
  }

  return (
    <AppShell>
      <div className="mb-8 flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-4xl font-extrabold flex items-center gap-3">
            <Users className="size-9 text-accent" /> Forum Komunitas
          </h1>
          <p className="text-brand/60 mt-2">Berbagi catatan, tanya soal, atau cerita persiapan SNBT-mu.</p>
        </div>
        <button
          onClick={() => setComposing((s) => !s)}
          className="px-5 py-3 bg-brand text-brand-foreground rounded-2xl font-bold inline-flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition"
        >
          <Plus className="size-4" /> Buat Post
        </button>
      </div>

      {composing && (
        <div className="bg-card rounded-3xl border border-brand/10 p-6 mb-6 shadow-xl shadow-brand/5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul singkat"
            className="w-full px-4 py-3 rounded-xl border border-brand/15 bg-surface mb-3 focus:outline-none focus:border-accent font-bold"
            maxLength={200}
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Ceritakan, tanya, atau berbagi sesuatu…"
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-brand/15 bg-surface focus:outline-none focus:border-accent"
            maxLength={5000}
          />
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => setComposing(false)} className="px-4 py-2 text-sm font-bold text-brand/60 hover:text-brand">
              Batal
            </button>
            <button
              onClick={submit}
              disabled={submitting}
              className="px-5 py-2 bg-brand text-brand-foreground rounded-xl font-bold inline-flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="size-4" /> Posting
            </button>
          </div>
        </div>
      )}

      {q.isLoading ? (
        <p className="text-brand/40">Memuat…</p>
      ) : !q.data?.posts.length ? (
        <p className="text-brand/40">Belum ada post. Jadilah yang pertama!</p>
      ) : (
        <div className="space-y-4">
          {q.data.posts.map((p) => (
            <article key={p.id} className="bg-card rounded-2xl border border-brand/10 p-5 hover:border-accent/30 transition">
              <Link to="/forum/$id" params={{ id: p.id }} className="block mb-3">
                <div className="flex items-center gap-2 mb-2">
                  {p.owner?.avatar_url ? (
                    <img src={p.owner.avatar_url} alt="" className="size-8 rounded-full" />
                  ) : (
                    <div className="size-8 rounded-full bg-accent/20 grid place-items-center text-xs font-bold text-accent">
                      {(p.owner?.display_name ?? "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="text-xs">
                    <div className="font-bold">{p.owner?.display_name ?? "Pelajar"}</div>
                    <div className="text-brand/40">{new Date(p.created_at).toLocaleString("id-ID")}</div>
                  </div>
                </div>
                <h2 className="text-xl font-extrabold mb-1">{p.title}</h2>
                <p className="text-sm text-brand/70 line-clamp-3 whitespace-pre-wrap">{p.body}</p>
              </Link>
              <div className="flex items-center gap-4 text-sm pt-3 border-t border-brand/5">
                <button
                  onClick={() => like(p.id)}
                  className={"inline-flex items-center gap-1.5 font-bold transition " + (p.liked ? "text-destructive" : "text-brand/60 hover:text-destructive")}
                >
                  <Heart className={"size-4 " + (p.liked ? "fill-current" : "")} /> {p.likes}
                </button>
                <Link to="/forum/$id" params={{ id: p.id }} className="inline-flex items-center gap-1.5 font-bold text-brand/60 hover:text-accent">
                  <MessageSquare className="size-4" /> {p.comments}
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </AppShell>
  );
}

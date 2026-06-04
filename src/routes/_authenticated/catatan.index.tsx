import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { listNotes, analyzeNote } from "@/lib/notes.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NotebookText, Upload, CheckCircle2, Loader2, XCircle, Search, Users, User as UserIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/catatan/")({
  component: NotesPage,
});

function NotesPage() {
  const fn = useServerFn(listNotes);
  const analyze = useServerFn(analyzeNote);
  const [search, setSearch] = useState("");
  const [mineOnly, setMineOnly] = useState(false);
  const q = useQuery({
    queryKey: ["notes", search, mineOnly],
    queryFn: () => fn({ data: { search, mineOnly } }),
  });
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");

  async function handleUpload(file: File) {
    if (!title.trim()) {
      toast.error("Beri judul catatan dulu");
      return;
    }
    const isImage = file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg";
    if (!isImage) {
      toast.error("Hanya menerima berkas gambar berbentuk PNG atau JPEG!");
      return;
    }
    setUploading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Tidak login");
      const path = `${userData.user.id}/${Date.now()}-${file.name.replace(/[^a-z0-9.]+/gi, "_")}`;
      const { error: upErr } = await supabase.storage.from("notes").upload(path, file, { contentType: file.type || undefined });
      if (upErr) throw upErr;
      toast.info("Berkas terupload, AI sedang menganalisis…");
      await analyze({ data: { title, imagePath: path, mimeType: file.type || undefined } });
      toast.success("Flashcard & kuis siap!");
      setTitle("");
      q.refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold flex items-center gap-3">
          <NotebookText className="size-9 text-accent" /> Pustaka Catatan
        </h1>
        <p className="text-brand/60 mt-2">Foto catatanmu, dibedah AI menjadi flashcard & kuis — bisa diakses semua pelajar Studiva.</p>
      </div>

      <div className="bg-card border border-brand/5 rounded-3xl p-6 mb-8 shadow-xl shadow-brand/5">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul catatan, mis. 'Hukum Newton Bab 2'"
          className="w-full px-4 py-3 rounded-xl border border-brand/15 bg-surface mb-3 focus:outline-none focus:border-accent"
        />
        <label
          className={
            "flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed rounded-2xl cursor-pointer transition " +
            (uploading ? "border-brand/10 bg-brand/5 cursor-wait" : "border-accent/30 hover:border-accent hover:bg-accent/5")
          }
        >
          {uploading ? <Loader2 className="size-10 text-accent animate-spin" /> : <Upload className="size-10 text-accent" />}
          <span className="font-bold">{uploading ? "Memproses dengan AI…" : "Upload catatan berbentuk png/jpeg 1 foto saja"}</span>
          <span className="text-xs text-brand/50 text-center max-w-md">AI akan membaca, meringkas, lalu membuat 6 flashcard + 5 soal kuis. Tuliskan dulu judul materi baru upload materi. Catatanmu akan tampil di pustaka publik.</span>
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            disabled={uploading}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
            }}
          />
        </label>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-brand/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul atau ringkasan catatan…"
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-brand/15 bg-card focus:outline-none focus:border-accent"
          />
        </div>
        <div className="inline-flex rounded-2xl border border-brand/15 bg-card overflow-hidden">
          <button
            onClick={() => setMineOnly(false)}
            className={"px-4 py-3 text-sm font-bold flex items-center gap-2 " + (!mineOnly ? "bg-brand text-brand-foreground" : "text-brand/60 hover:text-accent")}
          >
            <Users className="size-4" /> Semua
          </button>
          <button
            onClick={() => setMineOnly(true)}
            className={"px-4 py-3 text-sm font-bold flex items-center gap-2 " + (mineOnly ? "bg-brand text-brand-foreground" : "text-brand/60 hover:text-accent")}
          >
            <UserIcon className="size-4" /> Punyaku
          </button>
        </div>
      </div>

      {q.isLoading ? (
        <p className="text-brand/40">Memuat…</p>
      ) : !q.data?.notes.length ? (
        <p className="text-brand/40">
          {search ? `Tidak ada catatan cocok untuk "${search}".` : "Belum ada catatan. Jadi yang pertama!"}
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {q.data.notes.map((n) => (
            <Link
              key={n.id}
              to="/catatan/$id"
              params={{ id: n.id }}
              className="block bg-card border border-brand/5 rounded-2xl p-5 hover:shadow-xl shadow-brand/5 hover:border-accent/30 transition"
            >
              <div className="flex items-center justify-between mb-3">
                <StatusBadge status={n.status} />
                <span className="text-[10px] text-brand/40">
                  {new Date(n.created_at).toLocaleDateString("id-ID")}
                </span>
              </div>
              <div className="font-extrabold mb-1 truncate">{n.title}</div>
              <p className="text-sm text-brand/60 line-clamp-3 mb-3">{n.summary ?? "Belum ada ringkasan."}</p>
              <div className="flex items-center gap-2 pt-3 border-t border-brand/5">
                {n.owner?.avatar_url ? (
                  <img src={n.owner.avatar_url} alt="" className="size-6 rounded-full" />
                ) : (
                  <div className="size-6 rounded-full bg-accent/20 grid place-items-center text-[10px] font-bold text-accent">
                    {(n.owner?.display_name ?? "?").charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs text-brand/70 truncate">{n.owner?.display_name ?? "Pelajar"}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "ready")
    return <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full"><CheckCircle2 className="size-3" /> Siap</span>;
  if (status === "failed")
    return <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-destructive bg-destructive/10 px-2 py-0.5 rounded-full"><XCircle className="size-3" /> Gagal</span>;
  return <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-accent bg-accent/10 px-2 py-0.5 rounded-full"><Loader2 className="size-3 animate-spin" /> Proses</span>;
}

import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn } from "./createSsrRpc-QeTLlYSS.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-D8QFwA2R.mjs";
import { a as analyzeNote, l as listNotes } from "./notes.functions-CPys7pPB.mjs";
import { s as supabase } from "./client-D5O_ac7f.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { N as NotebookText, L as LoaderCircle, g as Upload, h as Search, U as Users, i as User, C as CircleCheck, j as CircleX } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "./server-DDQ41ls2.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./auth-middleware-CuXDYw0K.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
function NotesPage() {
  const fn = useServerFn(listNotes);
  const analyze = useServerFn(analyzeNote);
  const [search, setSearch] = reactExports.useState("");
  const [mineOnly, setMineOnly] = reactExports.useState(false);
  const q = useQuery({
    queryKey: ["notes", search, mineOnly],
    queryFn: () => fn({
      data: {
        search,
        mineOnly
      }
    })
  });
  const [uploading, setUploading] = reactExports.useState(false);
  const [title, setTitle] = reactExports.useState("");
  async function handleUpload(file) {
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
      const {
        data: userData
      } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Tidak login");
      const path = `${userData.user.id}/${Date.now()}-${file.name.replace(/[^a-z0-9.]+/gi, "_")}`;
      const {
        error: upErr
      } = await supabase.storage.from("notes").upload(path, file, {
        contentType: file.type || void 0
      });
      if (upErr) throw upErr;
      toast.info("Berkas terupload, AI sedang menganalisis…");
      await analyze({
        data: {
          title,
          imagePath: path,
          mimeType: file.type || void 0
        }
      });
      toast.success("Flashcard & kuis siap!");
      setTitle("");
      q.refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal upload");
    } finally {
      setUploading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl font-extrabold flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(NotebookText, { className: "size-9 text-accent" }),
        " Pustaka Catatan"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/60 mt-2", children: "Foto catatanmu, dibedah AI menjadi flashcard & kuis — bisa diakses semua pelajar Studiva." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-brand/5 rounded-3xl p-6 mb-8 shadow-xl shadow-brand/5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Judul catatan, mis. 'Hukum Newton Bab 2'", className: "w-full px-4 py-3 rounded-xl border border-brand/15 bg-surface mb-3 focus:outline-none focus:border-accent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed rounded-2xl cursor-pointer transition " + (uploading ? "border-brand/10 bg-brand/5 cursor-wait" : "border-accent/30 hover:border-accent hover:bg-accent/5"), children: [
        uploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-10 text-accent animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-10 text-accent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: uploading ? "Memproses dengan AI…" : "Upload catatan berbentuk png/jpeg 1 foto saja" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-brand/50 text-center max-w-md", children: "AI akan membaca, meringkas, lalu membuat 6 flashcard + 5 soal kuis. Tuliskan dulu judul materi baru upload materi. Catatanmu akan tampil di pustaka publik." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/png, image/jpeg, image/jpg", disabled: uploading, className: "hidden", onChange: (e) => {
          const f = e.target.files?.[0];
          if (f) handleUpload(f);
        } })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute left-4 top-1/2 -translate-y-1/2 text-brand/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Cari judul atau ringkasan catatan…", className: "w-full pl-11 pr-4 py-3 rounded-2xl border border-brand/15 bg-card focus:outline-none focus:border-accent" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex rounded-2xl border border-brand/15 bg-card overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setMineOnly(false), className: "px-4 py-3 text-sm font-bold flex items-center gap-2 " + (!mineOnly ? "bg-brand text-brand-foreground" : "text-brand/60 hover:text-accent"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-4" }),
          " Semua"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setMineOnly(true), className: "px-4 py-3 text-sm font-bold flex items-center gap-2 " + (mineOnly ? "bg-brand text-brand-foreground" : "text-brand/60 hover:text-accent"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-4" }),
          " Punyaku"
        ] })
      ] })
    ] }),
    q.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/40", children: "Memuat…" }) : !q.data?.notes.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/40", children: search ? `Tidak ada catatan cocok untuk "${search}".` : "Belum ada catatan. Jadi yang pertama!" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: q.data.notes.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/catatan/$id", params: {
      id: n.id
    }, className: "block bg-card border border-brand/5 rounded-2xl p-5 hover:shadow-xl shadow-brand/5 hover:border-accent/30 transition", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: n.status }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-brand/40", children: new Date(n.created_at).toLocaleDateString("id-ID") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-extrabold mb-1 truncate", children: n.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-brand/60 line-clamp-3 mb-3", children: n.summary ?? "Belum ada ringkasan." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-3 border-t border-brand/5", children: [
        n.owner?.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: n.owner.avatar_url, alt: "", className: "size-6 rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-6 rounded-full bg-accent/20 grid place-items-center text-[10px] font-bold text-accent", children: (n.owner?.display_name ?? "?").charAt(0).toUpperCase() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-brand/70 truncate", children: n.owner?.display_name ?? "Pelajar" })
      ] })
    ] }, n.id)) })
  ] });
}
function StatusBadge({
  status
}) {
  if (status === "ready") return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] font-bold uppercase text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3" }),
    " Siap"
  ] });
  if (status === "failed") return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] font-bold uppercase text-destructive bg-destructive/10 px-2 py-0.5 rounded-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-3" }),
    " Gagal"
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] font-bold uppercase text-accent bg-accent/10 px-2 py-0.5 rounded-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3 animate-spin" }),
    " Proses"
  ] });
}
export {
  NotesPage as component
};

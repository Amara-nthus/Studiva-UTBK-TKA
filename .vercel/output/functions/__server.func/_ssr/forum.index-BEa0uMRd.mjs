import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn } from "./createSsrRpc-QeTLlYSS.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-D8QFwA2R.mjs";
import { c as createForumPost, t as toggleForumLike, l as listForumPosts } from "./forum.functions-DMmi-GcH.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { U as Users, e as Plus, d as Send, H as Heart, f as MessageSquare } from "../_libs/lucide-react.mjs";
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
import "./client-D5O_ac7f.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./auth-middleware-CuXDYw0K.mjs";
import "../_libs/zod.mjs";
function ForumIndex() {
  const listFn = useServerFn(listForumPosts);
  const createFn = useServerFn(createForumPost);
  const likeFn = useServerFn(toggleForumLike);
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["forum"],
    queryFn: () => listFn()
  });
  const [composing, setComposing] = reactExports.useState(false);
  const [title, setTitle] = reactExports.useState("");
  const [body, setBody] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  async function submit() {
    if (title.trim().length < 3 || body.trim().length < 3) {
      toast.error("Judul & isi minimal 3 karakter");
      return;
    }
    setSubmitting(true);
    try {
      await createFn({
        data: {
          title: title.trim(),
          body: body.trim()
        }
      });
      setTitle("");
      setBody("");
      setComposing(false);
      qc.invalidateQueries({
        queryKey: ["forum"]
      });
      toast.success("Postingan terbit!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal");
    } finally {
      setSubmitting(false);
    }
  }
  async function like(id) {
    try {
      await likeFn({
        data: {
          postId: id
        }
      });
      qc.invalidateQueries({
        queryKey: ["forum"]
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex items-end justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl font-extrabold flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-9 text-accent" }),
          " Forum Komunitas"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/60 mt-2", children: "Berbagi catatan, tanya soal, atau cerita persiapan SNBT-mu." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setComposing((s) => !s), className: "px-5 py-3 bg-brand text-brand-foreground rounded-2xl font-bold inline-flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
        " Buat Post"
      ] })
    ] }),
    composing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-3xl border border-brand/10 p-6 mb-6 shadow-xl shadow-brand/5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Judul singkat", className: "w-full px-4 py-3 rounded-xl border border-brand/15 bg-surface mb-3 focus:outline-none focus:border-accent font-bold", maxLength: 200 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: body, onChange: (e) => setBody(e.target.value), placeholder: "Ceritakan, tanya, atau berbagi sesuatu…", rows: 5, className: "w-full px-4 py-3 rounded-xl border border-brand/15 bg-surface focus:outline-none focus:border-accent", maxLength: 5e3 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 mt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setComposing(false), className: "px-4 py-2 text-sm font-bold text-brand/60 hover:text-brand", children: "Batal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: submit, disabled: submitting, className: "px-5 py-2 bg-brand text-brand-foreground rounded-xl font-bold inline-flex items-center gap-2 disabled:opacity-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-4" }),
          " Posting"
        ] })
      ] })
    ] }),
    q.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/40", children: "Memuat…" }) : !q.data?.posts.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/40", children: "Belum ada post. Jadilah yang pertama!" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: q.data.posts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "bg-card rounded-2xl border border-brand/10 p-5 hover:border-accent/30 transition", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/forum/$id", params: {
        id: p.id
      }, className: "block mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          p.owner?.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.owner.avatar_url, alt: "", className: "size-8 rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-full bg-accent/20 grid place-items-center text-xs font-bold text-accent", children: (p.owner?.display_name ?? "?").charAt(0).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", children: p.owner?.display_name ?? "Pelajar" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-brand/40", children: new Date(p.created_at).toLocaleString("id-ID") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-extrabold mb-1", children: p.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-brand/70 line-clamp-3 whitespace-pre-wrap", children: p.body })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-sm pt-3 border-t border-brand/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => like(p.id), className: "inline-flex items-center gap-1.5 font-bold transition " + (p.liked ? "text-destructive" : "text-brand/60 hover:text-destructive"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "size-4 " + (p.liked ? "fill-current" : "") }),
          " ",
          p.likes
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/forum/$id", params: {
          id: p.id
        }, className: "inline-flex items-center gap-1.5 font-bold text-brand/60 hover:text-accent", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "size-4" }),
          " ",
          p.comments
        ] })
      ] })
    ] }, p.id)) })
  ] });
}
export {
  ForumIndex as component
};

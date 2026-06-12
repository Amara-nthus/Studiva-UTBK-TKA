import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn } from "./createSsrRpc-QeTLlYSS.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-D8QFwA2R.mjs";
import { d as deleteForumPost, t as toggleForumLike, a as createForumComment, g as getForumPost } from "./forum.functions-DMmi-GcH.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { R as Route$1 } from "./router-CnvdVWMk.mjs";
import "../_libs/seroval.mjs";
import { k as ArrowLeft, l as Trash2, H as Heart, d as Send } from "../_libs/lucide-react.mjs";
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
function ForumDetail() {
  const {
    id
  } = Route$1.useParams();
  const router = useRouter();
  const qc = useQueryClient();
  const getFn = useServerFn(getForumPost);
  const commentFn = useServerFn(createForumComment);
  const likeFn = useServerFn(toggleForumLike);
  const delFn = useServerFn(deleteForumPost);
  const q = useQuery({
    queryKey: ["forum", id],
    queryFn: () => getFn({
      data: {
        id
      }
    })
  });
  const [body, setBody] = reactExports.useState("");
  async function comment() {
    if (body.trim().length < 1) return;
    try {
      await commentFn({
        data: {
          postId: id,
          body: body.trim()
        }
      });
      setBody("");
      qc.invalidateQueries({
        queryKey: ["forum", id]
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal");
    }
  }
  async function like() {
    try {
      await likeFn({
        data: {
          postId: id
        }
      });
      qc.invalidateQueries({
        queryKey: ["forum", id]
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal");
    }
  }
  async function del() {
    if (!confirm("Hapus post ini permanen?")) return;
    try {
      await delFn({
        data: {
          id
        }
      });
      router.navigate({
        to: "/forum"
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal");
    }
  }
  if (q.isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/40", children: "Memuat…" }) });
  if (!q.data?.post) return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Post tidak ditemukan." }) });
  const {
    post,
    comments,
    likes,
    liked,
    isOwner
  } = q.data;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/forum", className: "inline-flex items-center gap-1 text-sm text-brand/60 hover:text-accent mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
      " Kembali ke forum"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "bg-card rounded-3xl border border-brand/10 p-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        post.owner?.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: post.owner.avatar_url, alt: "", className: "size-10 rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-full bg-accent/20 grid place-items-center text-sm font-bold text-accent", children: (post.owner?.display_name ?? "?").charAt(0).toUpperCase() }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold text-sm", children: [
            post.owner?.display_name ?? "Pelajar",
            " ",
            isOwner && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-accent ml-1", children: "· kamu" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-brand/40", children: new Date(post.created_at).toLocaleString("id-ID") })
        ] }),
        isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: del, className: "text-xs font-bold text-destructive hover:underline inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }),
          " Hapus"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-extrabold mb-3", children: post.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/80 whitespace-pre-wrap", children: post.body }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4 pt-4 mt-4 border-t border-brand/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: like, className: "inline-flex items-center gap-1.5 font-bold " + (liked ? "text-destructive" : "text-brand/60 hover:text-destructive"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "size-4 " + (liked ? "fill-current" : "") }),
        " ",
        likes
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-extrabold mb-3", children: [
        "Komentar (",
        comments.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: body, onChange: (e) => setBody(e.target.value), onKeyDown: (e) => e.key === "Enter" && comment(), placeholder: "Tulis komentar…", maxLength: 2e3, className: "flex-1 px-4 py-3 rounded-xl border border-brand/15 bg-card focus:outline-none focus:border-accent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: comment, className: "px-4 bg-brand text-brand-foreground rounded-xl font-bold inline-flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: comments.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "bg-card rounded-2xl border border-brand/5 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          c.owner?.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.owner.avatar_url, alt: "", className: "size-6 rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-6 rounded-full bg-accent/20 grid place-items-center text-[10px] font-bold text-accent", children: (c.owner?.display_name ?? "?").charAt(0).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: c.owner?.display_name ?? "Pelajar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-brand/40", children: new Date(c.created_at).toLocaleString("id-ID") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm whitespace-pre-wrap pl-8", children: c.body })
      ] }, c.id)) })
    ] })
  ] });
}
export {
  ForumDetail as component
};

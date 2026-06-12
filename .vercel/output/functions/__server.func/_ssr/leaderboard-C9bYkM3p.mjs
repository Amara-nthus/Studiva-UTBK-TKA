import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useServerFn } from "./createSsrRpc-QeTLlYSS.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./AppShell-D8QFwA2R.mjs";
import { g as getLeaderboards } from "./studiva.functions-DrlDFqdk.mjs";
import "../_libs/seroval.mjs";
import { S as Sparkles, a as Trophy, F as Flame } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
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
const tabs = [{
  id: "exp",
  label: "EXP Total",
  icon: Sparkles,
  field: "exp"
}, {
  id: "snbt",
  label: "Skor SNBT",
  icon: Trophy,
  field: "snbt_best"
}, {
  id: "tka",
  label: "Skor TKA",
  icon: Flame,
  field: "tka_best"
}];
function LeaderboardPage() {
  const fn = useServerFn(getLeaderboards);
  const q = useQuery({
    queryKey: ["leaderboards"],
    queryFn: () => fn()
  });
  const [tab, setTab] = reactExports.useState("exp");
  const cur = tabs.find((t) => t.id === tab);
  const rows = q.data?.[tab] ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-extrabold", children: "Leaderboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/60 mt-2", children: "Saling pacu menuju kampus impian. Update real-time." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mb-6 bg-card border border-brand/5 rounded-2xl p-1.5 max-w-md", children: tabs.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab(t.id), className: "flex-1 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition " + (tab === t.id ? "bg-brand text-brand-foreground" : "text-brand/60 hover:bg-brand/5"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: "size-4" }),
      " ",
      t.label
    ] }, t.id)) }),
    q.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/40", children: "Memuat…" }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/40", children: "Belum ada data." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-3xl border border-brand/5 overflow-hidden", children: rows.map((r, i) => {
      const score = r[cur.field] ?? 0;
      const isPodium = i < 3;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-4 border-b border-brand/5 last:border-0 " + (isPodium ? "bg-diva/5" : ""), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 grid place-items-center rounded-full font-extrabold " + (i === 0 ? "bg-diva text-brand" : i === 1 ? "bg-brand/10 text-brand" : i === 2 ? "bg-accent/20 text-accent" : "bg-surface text-brand/50"), children: i + 1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-full bg-accent/10 grid place-items-center font-bold text-accent shrink-0", children: r.profile?.display_name?.[0]?.toUpperCase() ?? "?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold truncate", children: r.profile?.display_name ?? "Pelajar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-brand/50 truncate", children: r.profile?.school ?? "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-extrabold", children: score }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase font-bold text-brand/40", children: cur.label })
        ] })
      ] }, r.user_id);
    }) })
  ] });
}
export {
  LeaderboardPage as component
};

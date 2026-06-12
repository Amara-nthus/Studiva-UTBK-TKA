import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { O as Outlet, d as useRouterState, L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as StudyTimerProvider, u as useStudyTimer, f as formatHMS } from "./StudyTimerProvider-BqscofFv.mjs";
import "../_libs/seroval.mjs";
import { T as Timer } from "../_libs/lucide-react.mjs";
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
import "./createSsrRpc-QeTLlYSS.mjs";
import "./server-DDQ41ls2.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
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
function StudyTimerPill() {
  const t = useStudyTimer();
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (t.phase === "idle" || path === "/timer" || path.startsWith("/timer/")) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/timer",
      className: "fixed bottom-6 right-6 z-[9999] inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand text-brand-foreground shadow-2xl shadow-brand/30 font-bold tabular-nums hover:scale-105 transition",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "size-4 " + (t.running ? "animate-pulse text-diva" : "text-brand-foreground/60") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wider opacity-70", children: t.phase === "focus" ? "Fokus" : "Istirahat" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: formatHMS(Math.max(0, t.targetSec - t.elapsed)) })
      ]
    }
  );
}
function AuthenticatedLayout() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(StudyTimerProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StudyTimerPill, {})
  ] });
}
export {
  AuthenticatedLayout as component
};

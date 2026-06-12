import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter, L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-D5O_ac7f.mjs";
import { F as Flame, m as LayoutDashboard, S as Sparkles, U as Users, a as Trophy, N as NotebookText, M as MessageCircle, T as Timer, B as Brain, n as LogOut } from "../_libs/lucide-react.mjs";
const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/latihan-soal", label: "Latihan Soal", icon: Sparkles },
  { to: "/forum", label: "Forum", icon: Users },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/catatan", label: "Catatan AI", icon: NotebookText },
  { to: "/chatbot", label: "Konsultasi AI", icon: MessageCircle },
  { to: "/timer", label: "Timer", icon: Timer },
  { to: "/psikotes", label: "Psikotes", icon: Brain }
];
function AppShell({ children }) {
  const router = useRouter();
  async function logout() {
    await supabase.auth.signOut();
    router.navigate({ to: "/" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-surface text-brand", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "sticky top-0 z-30 backdrop-blur bg-surface/80 border-b border-brand/5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard", className: "flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 bg-brand rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-4 text-diva" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-extrabold tracking-tight", children: "STUDIVA" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:flex items-center gap-1 flex-1 justify-center", children: navItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: item.to,
            className: "px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2",
            activeProps: {
              className: "bg-[#1E1B4B] text-white hover:bg-[#1E1B4B]/90 hover:text-white"
            },
            inactiveProps: {
              className: "text-[#1E1B4B] hover:text-accent hover:bg-accent/10"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "size-4" }),
              item.label
            ]
          },
          item.to
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: logout,
            className: "text-sm font-semibold text-brand/60 hover:text-destructive flex items-center gap-2 shrink-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-4" }),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Keluar" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden flex overflow-x-auto gap-1 px-4 pb-3", children: navItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: item.to,
          className: "shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition",
          activeProps: {
            className: "bg-[#1E1B4B] text-white"
          },
          inactiveProps: {
            className: "text-[#1E1B4B] bg-[#1E1B4B]/5 hover:bg-accent/10 hover:text-accent"
          },
          children: item.label
        },
        item.to
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "max-w-7xl mx-auto px-4 md:px-6 py-8", children })
  ] });
}
export {
  AppShell as A
};

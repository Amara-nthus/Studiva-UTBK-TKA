import { Link, useRouter } from "@tanstack/react-router";
import { Flame, LayoutDashboard, Trophy, Sparkles, NotebookText, Brain, LogOut, MessageCircle, Timer, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { type ReactNode } from "react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/latihan-soal", label: "Latihan Soal", icon: Sparkles },
  { to: "/forum", label: "Forum", icon: Users },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/catatan", label: "Catatan AI", icon: NotebookText },
  { to: "/chatbot", label: "Konsultasi AI", icon: MessageCircle },
  { to: "/timer", label: "Timer", icon: Timer },
  { to: "/psikotes", label: "Psikotes", icon: Brain },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  async function logout() {
    await supabase.auth.signOut();
    router.navigate({ to: "/" });
  }
  return (
    <div className="min-h-screen bg-surface text-brand">
      <nav className="sticky top-0 z-30 backdrop-blur bg-surface/80 border-b border-brand/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3 gap-3">
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="size-8 bg-brand rounded-lg flex items-center justify-center">
              <Flame className="size-4 text-diva" />
            </div>
            <span className="text-lg font-extrabold tracking-tight">STUDIVA</span>
          </Link>
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2"
                activeProps={{
                  className: "bg-[#1E1B4B] text-white hover:bg-[#1E1B4B]/90 hover:text-white",
                }}
                inactiveProps={{
                  className: "text-[#1E1B4B] hover:text-accent hover:bg-accent/10",
                }}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </div>
          <button
            onClick={logout}
            className="text-sm font-semibold text-brand/60 hover:text-destructive flex items-center gap-2 shrink-0"
          >
            <LogOut className="size-4" /> <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
        {/* mobile nav */}
        <div className="md:hidden flex overflow-x-auto gap-1 px-4 pb-3">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition"
              activeProps={{
                className: "bg-[#1E1B4B] text-white",
              }}
              inactiveProps={{
                className: "text-[#1E1B4B] bg-[#1E1B4B]/5 hover:bg-accent/10 hover:text-accent",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">{children}</main>
    </div>
  );
}

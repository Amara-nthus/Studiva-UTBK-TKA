import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Flame } from "lucide-react";
import { toast } from "sonner";
import { createGuestUser } from "@/lib/studiva.functions";


export const Route = createFileRoute("/auth")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) throw redirect({ to: "/dashboard" });
  },
  component: AuthPage,
});

function AuthPage() {
  const router = useRouter();
  const guestLogin = useServerFn(createGuestUser);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGuestLogin() {
    setLoading(true);
    try {
      const credentials = await guestLogin();
      const { error } = await supabase.auth.signInWithPassword(credentials);
      if (error) throw error;
      await router.invalidate();
      router.navigate({ to: "/dashboard" });
      toast.success("Masuk sebagai Guest Pelajar!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal masuk sebagai guest");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/dashboard",
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Akun berhasil dibuat!");
          await router.invalidate();
          router.navigate({ to: "/dashboard" });
        } else {
          // Try sign-in immediately (works when email confirmation is off)
          const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
          if (signInErr) {
            toast.success("Akun dibuat! Silakan cek email untuk verifikasi.");
            setMode("signin");
          } else {
            await router.invalidate();
            router.navigate({ to: "/dashboard" });
          }
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await router.invalidate();
        router.navigate({ to: "/dashboard" });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Gagal masuk";
      if (msg.toLowerCase().includes("email not confirmed") || msg.toLowerCase().includes("confirmation")) {
        toast.error("Email belum dikonfirmasi! Silakan cek inbox Anda atau matikan 'Confirm email' di Dashboard Supabase Auth.");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  async function googleSignIn() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });
    if (error) {
      toast.error(error.message ?? "Gagal masuk dengan Google");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface text-brand flex flex-col">
      <Link to="/" className="flex items-center gap-2 p-6">
        <div className="size-9 bg-brand rounded-lg grid place-items-center">
          <Flame className="size-4 text-diva" />
        </div>
        <span className="text-xl font-extrabold">STUDIVA</span>
      </Link>
      <div className="flex-1 grid place-items-center px-4">
        <div className="w-full max-w-md bg-card rounded-3xl shadow-xl shadow-brand/10 border border-brand/5 p-8">
          <h1 className="text-3xl font-extrabold mb-2">
            {mode === "signin" ? "Selamat datang kembali" : "Daftar ke Studiva"}
          </h1>
          <p className="text-sm text-brand/60 mb-8">
            {mode === "signin"
              ? "Masuk untuk lanjut perjalanan kampusmu."
              : "Mulai gratis. Bangun streak, naikkan EXP."}
          </p>
          <button
            onClick={googleSignIn}
            disabled={loading}
            className="w-full mb-4 py-3 border border-brand/15 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-brand/5 transition disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="size-5"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.19 3.32v2.77h3.55c2.08-1.92 3.28-4.74 3.28-8.1Z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.55-2.77c-.98.66-2.24 1.05-3.73 1.05-2.87 0-5.3-1.94-6.17-4.54H2.18v2.86A11 11 0 0 0 12 23Z" /><path fill="#FBBC05" d="M5.83 14.08A6.62 6.62 0 0 1 5.46 12c0-.72.13-1.42.36-2.08V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.94l3.65-2.86Z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.65l3.15-3.15C17.45 2.09 14.96 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.65 2.86C6.7 7.32 9.13 5.38 12 5.38Z" /></svg>
            Lanjutkan dengan Google
          </button>
          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={loading}
            className="w-full mb-4 py-3 bg-accent/10 border border-accent/30 hover:bg-accent/20 text-accent rounded-xl font-bold transition disabled:opacity-50"
          >
            Masuk sebagai Guest
          </button>
          <div className="flex items-center gap-3 my-4 text-xs text-brand/40">
            <div className="flex-1 h-px bg-brand/10" /> atau email <div className="flex-1 h-px bg-brand/10" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Nama tampilan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand/15 bg-surface focus:outline-none focus:border-accent"
              />
            )}
            <input
              type="email"
              required
              placeholder="kamu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-brand/15 bg-surface focus:outline-none focus:border-accent"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Password (min 6 karakter)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-brand/15 bg-surface focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand text-brand-foreground rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Memproses…" : mode === "signin" ? "Masuk" : "Daftar"}
            </button>
          </form>
          <p className="text-center text-sm text-brand/60 mt-6">
            {mode === "signin" ? "Belum punya akun? " : "Sudah punya akun? "}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-bold text-accent hover:underline"
            >
              {mode === "signin" ? "Daftar gratis" : "Masuk"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

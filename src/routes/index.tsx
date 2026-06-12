import { createFileRoute, Link } from "@tanstack/react-router";
import heroStudent from "@/assets/hero-student.jpg";
import { Flame, Sparkles, Trophy, NotebookText, Brain, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Studiva — Tembus Kampus Impianmu dengan Percaya Diri" },
      {
        name: "description",
        content:
          "Platform persiapan UTBK-SNBT & TKA untuk pelajar SMA. Latihan soal & skor, streak harian, catatan AI, dan rekomendasi jurusan berbasis data.",
      },
      { property: "og:title", content: "Studiva — Tembus Kampus Impianmu" },
      {
        property: "og:description",
        content:
          "Latihan soal SNBT & TKA, kuis harian, catatan AI, dan psikotes jurusan untuk pelajar SMA Indonesia.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-surface text-brand">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 md:px-8 py-6 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-10 bg-brand rounded-xl flex items-center justify-center">
            <Flame className="size-5 text-diva" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight">STUDIVA</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold opacity-80">
          <a href="#fitur" className="hover:opacity-100 transition">Fitur</a>
          <a href="#kampus" className="hover:opacity-100 transition">Kampus</a>
          <a href="#psikotes" className="hover:opacity-100 transition">Psikotes</a>
        </div>
        <Link
          to="/auth"
          className="px-6 py-2.5 bg-brand text-brand-foreground rounded-full text-sm font-bold hover:opacity-90 transition shadow-lg shadow-brand/10"
        >
          Masuk
        </Link>
      </nav>

      {/* Hero */}
      <header className="max-w-7xl mx-auto px-6 md:px-8 pt-8 md:pt-12 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-diva/10 border border-diva/30 text-[oklch(0.55_0.16_75)] text-xs font-bold uppercase tracking-wider mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-diva opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-diva" />
            </span>
            Khusus pelajar SMA · Be a Diva
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.05] mb-6 tracking-tight">
            Tembus kampus impianmu dengan{" "}
            <span className="text-accent italic">percaya diri.</span>
          </h1>
          <p className="text-lg text-brand/60 mb-10 max-w-lg">
            Latihan soal SNBT & TKA, kuis harian dengan streak, catatan AI yang otomatis jadi flashcard,
            plus rekomendasi jurusan dari psikotes. Semua dalam satu app.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand text-brand-foreground rounded-2xl font-bold shadow-xl shadow-brand/20 hover:scale-[1.02] transition"
            >
              Mulai gratis sebagai pelajar SMA <ArrowRight className="size-5" />
            </Link>
            <a
              href="#fitur"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-brand/15 rounded-2xl font-bold hover:bg-brand/5 transition"
            >
              Lihat fitur
            </a>
          </div>
        </div>

        <div className="relative">
          <img
            src={heroStudent}
            alt="Pelajar Studiva sedang belajar dengan percaya diri"
            className="w-full aspect-square object-cover rounded-[40px] shadow-2xl rotate-3 outline outline-1 -outline-offset-1 outline-black/5"
          />
          <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-3xl shadow-xl border border-brand/5 max-w-xs">
            <div className="flex items-center gap-4 mb-4">
              <div className="size-12 rounded-full bg-accent/10 grid place-items-center text-accent font-bold">
                82%
              </div>
              <div>
                <div className="text-sm font-bold">Peluang Diterima</div>
                <div className="text-xs text-brand/40">Universitas Indonesia</div>
              </div>
            </div>
            <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
              <div className="h-full bg-accent w-[82%]" />
            </div>
          </div>
          <div className="absolute -top-4 -right-4 bg-diva text-diva-foreground p-4 rounded-2xl shadow-xl flex items-center gap-2 font-extrabold">
            <Flame className="size-5" /> 12 hari streak
          </div>
        </div>
      </header>

      {/* Features */}
      <section id="fitur" className="max-w-7xl mx-auto px-6 md:px-8 py-20 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Sparkles, title: "Kuis Harian", desc: "1 soal/hari · bangun streak dan kumpulkan EXP." },
          { icon: Trophy, title: "3 Leaderboard", desc: "EXP · Skor SNBT · Skor TKA. Pacu dirimu." },
          { icon: NotebookText, title: "Catatan AI", desc: "Foto catatan tulisan tangan → flashcard & kuis." },
          { icon: Brain, title: "Psikotes Jurusan", desc: "15 pernyataan, AI rekomendasikan jurusan paling cocok." },
        ].map((f) => (
          <div key={f.title} className="bg-card border border-brand/5 rounded-3xl p-6 shadow-xl shadow-brand/5">
            <div className="size-12 grid place-items-center bg-accent/10 rounded-2xl mb-4">
              <f.icon className="size-6 text-accent" />
            </div>
            <h3 className="text-lg font-extrabold mb-2">{f.title}</h3>
            <p className="text-sm text-brand/60">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Recommendation Engine */}
      <section id="kampus" className="bg-brand text-brand-foreground py-24 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="text-4xl font-extrabold mb-4">Diva Recommendation Engine</h2>
              <p className="text-white/60 max-w-xl">
                Setelah latihan soal, kami berikan cetak biru kesuksesan akademikmu — kampus favorit
                plus dua alternatif terbaik (jurusan sama beda kampus, kampus sama beda jurusan).
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-diva italic">745</div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-white/40">
                Skor Rata-rata Studiva
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <RecCard tag="Pilihan Utama" tagClass="bg-accent/20 text-accent" title="Universitas Indonesia" sub="Ilmu Komputer" score="68%" hint="Peluang Masuk" primary />
            <RecCard tag="Jurusan Sama" tagClass="bg-diva/20 text-diva" title="ITB Bandung" sub="Informatika · Kampus Berbeda" score="84%" hint="Peluang Tinggi" />
            <RecCard tag="Kampus Sama" tagClass="bg-white/10 text-white/60" title="Universitas Indonesia" sub="Sistem Informasi · Jurusan Berbeda" score="92%" hint="Sangat Mungkin" />
          </div>
        </div>
      </section>

      {/* Psikotes teaser */}
      <section id="psikotes" className="max-w-7xl mx-auto px-6 md:px-8 py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="text-xs font-bold uppercase text-accent mb-3">Psikotes & Minat Bakat</div>
          <h2 className="text-4xl font-extrabold mb-4">Tidak yakin pilih jurusan apa?</h2>
          <p className="text-brand/60 mb-6">
            Isi 15 pernyataan minat & gaya belajar. AI Studiva menganalisis pola jawabanmu dan
            menampilkan 4 rekomendasi jurusan dengan persentase kecocokan dan alasannya.
          </p>
          <Link to="/auth" className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-brand-foreground rounded-xl font-bold">
            Coba Psikotes Sekarang <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="bg-card border border-brand/5 rounded-3xl p-6 shadow-xl shadow-brand/5 space-y-3">
          {[
            { major: "Teknik Informatika", match: 94 },
            { major: "Statistika", match: 87 },
            { major: "Sistem Informasi", match: 81 },
            { major: "Matematika", match: 76 },
          ].map((m) => (
            <div key={m.major} className="flex items-center justify-between p-3 rounded-xl bg-surface">
              <span className="font-semibold">{m.major}</span>
              <span className="font-extrabold text-accent">{m.match}%</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 md:px-8 py-12 border-t border-brand/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="size-8 bg-brand rounded-lg flex items-center justify-center">
            <Flame className="size-4 text-diva" />
          </div>
          <span className="text-lg font-extrabold">STUDIVA</span>
        </div>
        <p className="text-brand/40 text-sm italic text-center">
          "Membantu setiap pelajar SMA menjadi Diva dari perjalanan akademiknya."
        </p>
        <p className="text-brand/40 text-xs">© 2026 Studiva</p>
      </footer>
    </div>
  );
}

function RecCard({ tag, tagClass, title, sub, score, hint, primary }: { tag: string; tagClass: string; title: string; sub: string; score: string; hint: string; primary?: boolean }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${tagClass} text-[10px] font-bold uppercase mb-6`}>{tag}</div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-white/60 text-sm mb-6">{sub}</p>
      <div className="flex items-baseline gap-2">
        <span className={`text-5xl font-black ${primary ? "text-diva" : "text-white"}`}>{score}</span>
        <span className="text-sm text-white/40">{hint}</span>
      </div>
    </div>
  );
}

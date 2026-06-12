import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { F as Flame, A as ArrowRight, S as Sparkles, a as Trophy, N as NotebookText, B as Brain } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const heroStudent = "/assets/hero-student-CbWqcHvT.jpg";
function Landing() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-surface text-brand", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex items-center justify-between px-6 md:px-8 py-6 max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 bg-brand rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-5 text-diva" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-extrabold tracking-tight", children: "STUDIVA" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-8 text-sm font-semibold opacity-80", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#fitur", className: "hover:opacity-100 transition", children: "Fitur" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#kampus", className: "hover:opacity-100 transition", children: "Kampus" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#psikotes", className: "hover:opacity-100 transition", children: "Psikotes" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", className: "px-6 py-2.5 bg-brand text-brand-foreground rounded-full text-sm font-bold hover:opacity-90 transition shadow-lg shadow-brand/10", children: "Masuk" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "max-w-7xl mx-auto px-6 md:px-8 pt-8 md:pt-12 pb-20 grid lg:grid-cols-2 gap-12 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-diva/10 border border-diva/30 text-[oklch(0.55_0.16_75)] text-xs font-bold uppercase tracking-wider mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-2 w-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-diva opacity-75" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-diva" })
          ] }),
          "Khusus pelajar SMA · Be a Diva"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-5xl md:text-6xl font-extrabold leading-[1.05] mb-6 tracking-tight", children: [
          "Tembus kampus impianmu dengan",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent italic", children: "percaya diri." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-brand/60 mb-10 max-w-lg", children: "Latihan soal SNBT & TKA, kuis harian dengan streak, catatan AI yang otomatis jadi flashcard, plus rekomendasi jurusan dari psikotes. Semua dalam satu app." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/auth", className: "inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand text-brand-foreground rounded-2xl font-bold shadow-xl shadow-brand/20 hover:scale-[1.02] transition", children: [
            "Mulai gratis sebagai pelajar SMA ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-5" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#fitur", className: "inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-brand/15 rounded-2xl font-bold hover:bg-brand/5 transition", children: "Lihat fitur" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: heroStudent, alt: "Pelajar Studiva sedang belajar dengan percaya diri", className: "w-full aspect-square object-cover rounded-[40px] shadow-2xl rotate-3 outline outline-1 -outline-offset-1 outline-black/5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -bottom-6 -left-6 bg-card p-6 rounded-3xl shadow-xl border border-brand/5 max-w-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-full bg-accent/10 grid place-items-center text-accent font-bold", children: "82%" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold", children: "Peluang Diterima" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-brand/40", children: "Universitas Indonesia" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-full bg-surface rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-accent w-[82%]" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -top-4 -right-4 bg-diva text-diva-foreground p-4 rounded-2xl shadow-xl flex items-center gap-2 font-extrabold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-5" }),
          " 12 hari streak"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "fitur", className: "max-w-7xl mx-auto px-6 md:px-8 py-20 grid md:grid-cols-2 lg:grid-cols-4 gap-6", children: [{
      icon: Sparkles,
      title: "Kuis Harian",
      desc: "1 soal/hari · bangun streak dan kumpulkan EXP."
    }, {
      icon: Trophy,
      title: "3 Leaderboard",
      desc: "EXP · Skor SNBT · Skor TKA. Pacu dirimu."
    }, {
      icon: NotebookText,
      title: "Catatan AI",
      desc: "Foto catatan tulisan tangan → flashcard & kuis."
    }, {
      icon: Brain,
      title: "Psikotes Jurusan",
      desc: "15 pernyataan, AI rekomendasikan jurusan paling cocok."
    }].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-brand/5 rounded-3xl p-6 shadow-xl shadow-brand/5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 grid place-items-center bg-accent/10 rounded-2xl mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "size-6 text-accent" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-extrabold mb-2", children: f.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-brand/60", children: f.desc })
    ] }, f.title)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "kampus", className: "bg-brand text-brand-foreground py-24 px-6 md:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl font-extrabold mb-4", children: "Diva Recommendation Engine" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 max-w-xl", children: "Setelah latihan soal, kami berikan cetak biru kesuksesan akademikmu — kampus favorit plus dua alternatif terbaik (jurusan sama beda kampus, kampus sama beda jurusan)." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-diva italic", children: "745" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase font-bold tracking-widest text-white/40", children: "Skor Rata-rata Studiva" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-6 md:gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RecCard, { tag: "Pilihan Utama", tagClass: "bg-accent/20 text-accent", title: "Universitas Indonesia", sub: "Ilmu Komputer", score: "68%", hint: "Peluang Masuk", primary: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RecCard, { tag: "Jurusan Sama", tagClass: "bg-diva/20 text-diva", title: "ITB Bandung", sub: "Informatika · Kampus Berbeda", score: "84%", hint: "Peluang Tinggi" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RecCard, { tag: "Kampus Sama", tagClass: "bg-white/10 text-white/60", title: "Universitas Indonesia", sub: "Sistem Informasi · Jurusan Berbeda", score: "92%", hint: "Sangat Mungkin" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "psikotes", className: "max-w-7xl mx-auto px-6 md:px-8 py-24 grid lg:grid-cols-2 gap-12 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold uppercase text-accent mb-3", children: "Psikotes & Minat Bakat" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl font-extrabold mb-4", children: "Tidak yakin pilih jurusan apa?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/60 mb-6", children: "Isi 15 pernyataan minat & gaya belajar. AI Studiva menganalisis pola jawabanmu dan menampilkan 4 rekomendasi jurusan dengan persentase kecocokan dan alasannya." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/auth", className: "inline-flex items-center gap-2 px-6 py-3 bg-brand text-brand-foreground rounded-xl font-bold", children: [
          "Coba Psikotes Sekarang ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-brand/5 rounded-3xl p-6 shadow-xl shadow-brand/5 space-y-3", children: [{
        major: "Teknik Informatika",
        match: 94
      }, {
        major: "Statistika",
        match: 87
      }, {
        major: "Sistem Informasi",
        match: 81
      }, {
        major: "Matematika",
        match: 76
      }].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-xl bg-surface", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: m.major }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-extrabold text-accent", children: [
          m.match,
          "%"
        ] })
      ] }, m.major)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "max-w-7xl mx-auto px-6 md:px-8 py-12 border-t border-brand/5 flex flex-col md:flex-row justify-between items-center gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 bg-brand rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-4 text-diva" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-extrabold", children: "STUDIVA" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/40 text-sm italic text-center", children: '"Membantu setiap pelajar SMA menjadi Diva dari perjalanan akademiknya."' }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-brand/40 text-xs", children: "© 2026 Studiva" })
    ] })
  ] });
}
function RecCard({
  tag,
  tagClass,
  title,
  sub,
  score,
  hint,
  primary
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `inline-flex items-center gap-2 px-3 py-1 rounded-full ${tagClass} text-[10px] font-bold uppercase mb-6`, children: tag }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold mb-2", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 text-sm mb-6", children: sub }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-5xl font-black ${primary ? "text-diva" : "text-white"}`, children: score }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-white/40", children: hint })
    ] })
  ] });
}
export {
  Landing as component
};

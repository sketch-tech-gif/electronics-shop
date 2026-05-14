// FILE: src/pages/HomePage.jsx
// Jumia-inspired layout: top promo bar, navbar (NO search bar), category sidebar + hero banner,
// quick-category icon row (3D rotating cubes), flash sale, featured products — Vantix indigo palette

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { products, flashSaleProducts, CATEGORIES } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useApp } from "../context/AppContext";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  indigo:      "#3730a3",
  indigoDark:  "#1e1b4b",
  indigoMid:   "#4f46e5",
  indigoLight: "#e0e7ff",
  amber:       "#f59e0b",
  amberDark:   "#d97706",
  red:         "#dc2626",
  white:       "#ffffff",
  gray50:      "#f9fafb",
  gray100:     "#f3f4f6",
  gray200:     "#e5e7eb",
  gray400:     "#9ca3af",
  gray600:     "#4b5563",
  gray900:     "#111827",
};

// ─── Global styles ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; }
  html, body { overflow-x: hidden; width: 100%; }

  .vx-page { width: 100%; max-width: 100%; overflow-x: hidden; background: #f3f4f6; }

  @keyframes vxTicker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .vx-ticker-wrap { overflow: hidden; white-space: nowrap; }
  .vx-ticker      { display: inline-block; animation: vxTicker 22s linear infinite; }

  @keyframes vxFlip {
    0%   { transform: rotateX(0deg);  }
    50%  { transform: rotateX(90deg); }
    100% { transform: rotateX(0deg);  }
  }
  .vx-flip { animation: vxFlip 1s ease; }

  @keyframes vxHeroIn {
    from { opacity: 0; transform: translateX(24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .vx-hero-slide { animation: vxHeroIn 0.42s ease; }

  .vx-pcard { transition: box-shadow 0.18s, transform 0.18s; }
  .vx-pcard:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(55,48,163,0.13); }

  .vx-pad { padding-left: 12px; padding-right: 12px; }
  @media (min-width: 640px)  { .vx-pad { padding-left: 20px; padding-right: 20px; } }
  @media (min-width: 1024px) { .vx-pad { padding-left: 32px; padding-right: 32px; } }
  @media (min-width: 1280px) { .vx-pad { padding-left: 48px; padding-right: 48px; } }

  .vx-flash-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0,1fr));
    gap: 8px;
  }
  @media (min-width: 480px) { .vx-flash-grid { grid-template-columns: repeat(3, minmax(0,1fr)); } }
  @media (min-width: 768px) { .vx-flash-grid { grid-template-columns: repeat(5, minmax(0,1fr)); gap:12px; } }

  .vx-feat-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0,1fr));
    gap: 8px;
  }
  @media (min-width: 480px) { .vx-feat-grid { grid-template-columns: repeat(3, minmax(0,1fr)); } }
  @media (min-width: 768px) { .vx-feat-grid { grid-template-columns: repeat(4, minmax(0,1fr)); gap:12px; } }
  @media (min-width: 1024px){ .vx-feat-grid { grid-template-columns: repeat(5, minmax(0,1fr)); } }
  @media (min-width: 1280px){ .vx-feat-grid { grid-template-columns: repeat(6, minmax(0,1fr)); } }

  /* ── Quick cats: centered ── */
  .vx-qcat {
    display: flex;
    gap: 24px;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  @keyframes neonPulse {
    0%,100% { box-shadow: 0 0 4px #00f5ff,0 0 10px #00f5ff,0 0 20px #00f5ff; }
    50%      { box-shadow: 0 0 6px #00f5ff,0 0 18px #00f5ff,0 0 36px #00f5ff; }
  }
  .vx-neon-av { animation: neonPulse 2s ease-in-out infinite; border: 2px solid #00f5ff; }

  /* ── Trust strip: slim glowing pills ── */
  .vx-trust { display: grid; grid-template-columns: repeat(2,1fr); gap: 8px; }
  @media (min-width:640px) { .vx-trust { grid-template-columns: repeat(4,1fr); gap: 10px; } }

  @keyframes trustGlow1 {
    0%,100% { box-shadow: 0 0 6px rgba(99,102,241,0.5), 0 0 18px rgba(99,102,241,0.3); }
    50%     { box-shadow: 0 0 10px rgba(99,102,241,0.8), 0 0 28px rgba(99,102,241,0.5); }
  }
  @keyframes trustGlow2 {
    0%,100% { box-shadow: 0 0 6px rgba(16,185,129,0.5), 0 0 18px rgba(16,185,129,0.3); }
    50%     { box-shadow: 0 0 10px rgba(16,185,129,0.8), 0 0 28px rgba(16,185,129,0.5); }
  }
  @keyframes trustGlow3 {
    0%,100% { box-shadow: 0 0 6px rgba(245,158,11,0.5), 0 0 18px rgba(245,158,11,0.3); }
    50%     { box-shadow: 0 0 10px rgba(245,158,11,0.8), 0 0 28px rgba(245,158,11,0.5); }
  }
  @keyframes trustGlow4 {
    0%,100% { box-shadow: 0 0 6px rgba(220,38,38,0.5), 0 0 18px rgba(220,38,38,0.3); }
    50%     { box-shadow: 0 0 10px rgba(220,38,38,0.8), 0 0 28px rgba(220,38,38,0.5); }
  }
  .trust-glow-1 { animation: trustGlow1 2.4s ease-in-out infinite; border: 1px solid rgba(99,102,241,0.45) !important; }
  .trust-glow-2 { animation: trustGlow2 2.4s ease-in-out infinite 0.3s; border: 1px solid rgba(16,185,129,0.45) !important; }
  .trust-glow-3 { animation: trustGlow3 2.4s ease-in-out infinite 0.6s; border: 1px solid rgba(245,158,11,0.45) !important; }
  .trust-glow-4 { animation: trustGlow4 2.4s ease-in-out infinite 0.9s; border: 1px solid rgba(220,38,38,0.45) !important; }

  .vx-sidebar { display: none; }
  @media (min-width: 900px) { .vx-sidebar { display: block; } }

  .vx-hero-layout { display: grid; grid-template-columns: 1fr; }
  @media (min-width: 900px) { .vx-hero-layout { grid-template-columns: 210px 1fr 200px; gap: 0; } }

  .vx-subbanner { display: none; }
  @media (min-width: 900px) { .vx-subbanner { display: flex; } }

  /* ══ 3D Cube — 48px ══ */
  .cube-scene {
    width: 48px;
    height: 48px;
    perspective: 110px;
  }
  .cube {
    width: 48px;
    height: 48px;
    position: relative;
    transform-style: preserve-3d;
    animation: cubeRotate 7s linear infinite;
  }
  .cube-scene:hover .cube {
    animation-play-state: paused;
    filter: brightness(1.1);
  }
  @keyframes cubeRotate {
    0%   { transform: rotateX(-18deg) rotateY(0deg); }
    100% { transform: rotateX(-18deg) rotateY(360deg); }
  }
  .cube-face {
    position: absolute;
    width: 48px;
    height: 48px;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid rgba(255,255,255,0.35);
    box-shadow: inset 0 0 8px rgba(0,0,0,0.2);
  }
  .cube-face img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  /* half of 48px = 24px */
  .face-front  { transform: rotateY(  0deg) translateZ(24px); }
  .face-back   { transform: rotateY(180deg) translateZ(24px); }
  .face-right  { transform: rotateY( 90deg) translateZ(24px); }
  .face-left   { transform: rotateY(-90deg) translateZ(24px); }
  .face-top    { transform: rotateX( 90deg) translateZ(24px); }
  .face-bottom { transform: rotateX(-90deg) translateZ(24px); }

  .vx-cat-label {
    font-size: 10.5px;
    font-weight: 700;
    color: #374151;
    text-align: center;
    line-height: 1.2;
    white-space: nowrap;
    margin-top: 2px;
  }
`;

// ─── Countdown ────────────────────────────────────────────────────────────────
function Countdown() {
  const [t, setT] = useState({ h: 5, m: 43, s: 22 });
  useEffect(() => {
    const id = setInterval(() => setT(({ h, m, s }) => {
      if (--s < 0) { s = 59; if (--m < 0) { m = 59; if (--h < 0) h = 23; } }
      return { h, m, s };
    }), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = n => String(n).padStart(2, "0");
  const Seg = ({ v }) => (
    <span style={{
      background: "#2d2a6e", color: C.white, fontWeight: 800,
      fontSize: 15, padding: "3px 7px", borderRadius: 5, minWidth: 30,
      textAlign: "center", fontFamily: "monospace",
    }}>{v}</span>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <Seg v={pad(t.h)} />
      <span style={{ color: C.white, fontWeight: 800, fontSize: 16 }}>:</span>
      <Seg v={pad(t.m)} />
      <span style={{ color: C.white, fontWeight: 800, fontSize: 16 }}>:</span>
      <Seg v={pad(t.s)} />
    </div>
  );
}

// ─── Hero slides ──────────────────────────────────────────────────────────────
const SLIDES = [
  {
    tag: "🔥 Trending Now",
    title: "Smartphones & Accessories",
    sub: "Starting from",
    price: "KES 5,000",
    cta: "Shop Now",
    ctaLink: "/products?category=phones",
    bg: `linear-gradient(135deg, ${C.indigoDark} 0%, ${C.indigo} 55%, #6366f1 100%)`,
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=480&q=85",
    accent: C.amber,
  },
  {
    tag: "💻 New Arrivals",
    title: "MacBooks & Laptops",
    sub: "Up to",
    price: "20% Off",
    cta: "View Deals",
    ctaLink: "/products?category=laptops",
    bg: `linear-gradient(135deg, #111827 0%, #1e3a5f 55%, #1a3a8f 100%)`,
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=480&q=85",
    accent: "#38bdf8",
  },
  {
    tag: "🎧 Audio Week",
    title: "Premium Headphones & Earbuds",
    sub: "Deals from",
    price: "KES 2,500",
    cta: "Shop Audio",
    ctaLink: "/products?category=audio",
    bg: `linear-gradient(135deg, #1e1b4b 0%, #4c1d95 55%, #7c3aed 100%)`,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=480&q=85",
    accent: "#a78bfa",
  },
];

function HeroBanner() {
  const [cur, setCur] = useState(0);
  const [key, setKey] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCur(c => (c + 1) % SLIDES.length);
      setKey(k => k + 1);
    }, 4500);
    return () => clearInterval(id);
  }, []);
  const s = SLIDES[cur];
  return (
    <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", height: 280 }}>
      <div key={key} className="vx-hero-slide" style={{
        background: s.bg, height: "100%", display: "flex",
        alignItems: "center", padding: "20px 24px", position: "relative",
      }}>
        <div style={{ flex: 1, zIndex: 2, position: "relative" }}>
          <span style={{
            background: "rgba(255,255,255,0.15)", color: C.white,
            fontSize: 11, fontWeight: 700, padding: "3px 10px",
            borderRadius: 20, display: "inline-block", marginBottom: 10,
          }}>{s.tag}</span>
          <h2 style={{
            color: C.white, fontWeight: 900, fontSize: "clamp(18px,3.5vw,28px)",
            lineHeight: 1.15, marginBottom: 10, maxWidth: 280,
            fontFamily: "'Segoe UI', system-ui, sans-serif",
          }}>{s.title}</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 4 }}>{s.sub}</p>
          <p style={{ color: s.accent, fontWeight: 900, fontSize: 26, marginBottom: 18 }}>{s.price}</p>
          <Link to={s.ctaLink} style={{
            background: C.white, color: C.indigo,
            fontWeight: 800, fontSize: 13, padding: "9px 22px",
            borderRadius: 8, textDecoration: "none",
            display: "inline-block", boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
          }}>{s.cta} →</Link>
        </div>
        <img src={s.img} alt="" style={{
          position: "absolute", right: 0, top: 0, height: "100%",
          width: "45%", objectFit: "cover", objectPosition: "center",
          opacity: 0.45, borderRadius: "0 10px 10px 0",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(0,0,0,0.2) 45%, transparent 100%)",
          borderRadius: 10,
        }} />
        <div style={{ position: "absolute", bottom: 12, left: 24, display: "flex", gap: 6, zIndex: 3 }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => { setCur(i); setKey(k => k + 1); }} style={{
              width: cur === i ? 22 : 7, height: 7, borderRadius: 4,
              background: cur === i ? C.white : "rgba(255,255,255,0.4)",
              border: "none", cursor: "pointer", padding: 0,
              transition: "width 0.3s, background 0.3s",
            }} />
          ))}
        </div>
        {[{ dir: -1 }, { dir: 1 }].map(({ dir }) => (
          <button key={dir} onClick={() => { setCur(c => (c + dir + SLIDES.length) % SLIDES.length); setKey(k => k + 1); }}
            style={{
              position: "absolute", [dir < 0 ? "left" : "right"]: 8,
              top: "50%", transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.2)", border: "none",
              borderRadius: "50%", width: 32, height: 32,
              color: C.white, fontSize: 16, cursor: "pointer", zIndex: 4,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{dir < 0 ? "‹" : "›"}</button>
        ))}
      </div>
    </div>
  );
}

// ─── Left Ad Column ───────────────────────────────────────────────────────────
const LEFT_ADS = [
  {
    label: "Latest Phones",
    sub: "Starting KES 8,999",
    bg: `linear-gradient(135deg,${C.indigoDark},#3730a3)`,
    img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=320&q=85",
    link: "/products?category=phones",
  },
  {
    label: "Tablet Deals",
    sub: "Up to 20% off",
    bg: `linear-gradient(135deg,#0f172a,#1e3a5f)`,
    img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=320&q=85",
    link: "/products?category=tablets",
  },
  {
    label: "Camera Gear",
    sub: "Pro shots, big savings",
    bg: `linear-gradient(135deg,#1c1917,#44403c)`,
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=320&q=85",
    link: "/products?category=cameras",
  },
];

function LeftAdColumn() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, height: 280 }}>
      {LEFT_ADS.map(b => (
        <Link key={b.label} to={b.link} style={{
          flex: 1, background: b.bg, borderRadius: 10,
          textDecoration: "none", overflow: "hidden", position: "relative",
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
          padding: "10px 12px",
        }}>
          <img src={b.img} alt={b.label} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72) 40%, rgba(0,0,0,0.1) 100%)", borderRadius: 10 }} />
          <div style={{ position: "relative", zIndex: 2 }}>
            <p style={{ color: C.white, fontWeight: 800, fontSize: 12.5, marginBottom: 1, lineHeight: 1.2 }}>{b.label}</p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, marginBottom: 6 }}>{b.sub}</p>
            <span style={{ background: "rgba(255,255,255,0.2)", color: C.white, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>Shop →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ─── Sub-banners ──────────────────────────────────────────────────────────────
const SUB_BANNERS = [
  {
    label: "Gaming Week",
    sub: "Up to 30% off",
    bg: `linear-gradient(135deg,#111827,#1a2744)`,
    img: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=260&q=85",
    link: "/products?category=gaming",
  },
  {
    label: "Audio Deals",
    sub: "Premium sound",
    bg: `linear-gradient(135deg,${C.indigo},#6366f1)`,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=260&q=85",
    link: "/products?category=audio",
  },
];

function SubBanners() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, height: 280 }}>
      {SUB_BANNERS.map(b => (
        <Link key={b.label} to={b.link} style={{
          flex: 1, background: b.bg, borderRadius: 10, padding: "14px 16px",
          textDecoration: "none", display: "flex", flexDirection: "column",
          justifyContent: "space-between", overflow: "hidden", position: "relative",
        }}>
          <div style={{ position: "relative", zIndex: 2 }}>
            <p style={{ color: C.white, fontWeight: 800, fontSize: 14, marginBottom: 2 }}>{b.label}</p>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11 }}>{b.sub}</p>
          </div>
          <span style={{ background: "rgba(255,255,255,0.18)", color: C.white, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, alignSelf: "flex-start", position: "relative", zIndex: 2 }}>Shop Now →</span>
          <img src={b.img} alt={b.label} style={{ position: "absolute", right: 0, top: 0, height: "100%", width: "55%", objectFit: "cover", objectPosition: "center", borderRadius: "0 10px 10px 0" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.55) 40%, transparent 100%)", borderRadius: 10 }} />
        </Link>
      ))}
    </div>
  );
}

// ─── 3D Cube ──────────────────────────────────────────────────────────────────
function Cube3D({ img, bgColor }) {
  const faces = ["face-front","face-back","face-right","face-left","face-top","face-bottom"];
  return (
    <div className="cube-scene">
      <div className="cube">
        {faces.map(cls => (
          <div key={cls} className={`cube-face ${cls}`} style={{ background: bgColor }}>
            <img src={img} alt="" draggable={false} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Quick category strip ─────────────────────────────────────────────────────
const QUICK_CATS = [
  { label: "Top Sellers",  cat: "all",         bg: "#f59e0b", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&q=80" },
  { label: "New Arrivals", cat: "all",         bg: "#10b981", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&q=80" },
  { label: "Clearance",   cat: "all",         bg: "#dc2626", img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=120&q=80" },
  { label: "Phones",      cat: "phones",      bg: "#3730a3", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=120&q=80" },
  { label: "Laptops",     cat: "laptops",     bg: "#1e1b4b", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=120&q=80" },
  { label: "Audio",       cat: "audio",       bg: "#7c3aed", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&q=80" },
  { label: "Gaming",      cat: "gaming",      bg: "#059669", img: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=120&q=80" },
  { label: "Cameras",     cat: "cameras",     bg: "#0369a1", img: "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=120&q=80" },
  { label: "Tablets",     cat: "tablets",     bg: "#b45309", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=120&q=80" },
  { label: "Accessories", cat: "accessories", bg: "#9d174d", img: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=120&q=80" },
];

function QuickCats({ dispatch }) {
  return (
    <div className="vx-qcat">
      {QUICK_CATS.map(q => (
        <Link
          key={q.label}
          to={`/products?category=${q.cat}`}
          onClick={() => dispatch({ type: "SET_FILTER", filter: { category: q.cat } })}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textDecoration: "none", width: 68 }}
        >
          <Cube3D img={q.img} bgColor={q.bg} />
          <span className="vx-cat-label">{q.label}</span>
        </Link>
      ))}
    </div>
  );
}

// ─── Promo bar ────────────────────────────────────────────────────────────────
function PromoBar() {
  const items = [
    "🚚 Fast delivery countrywide",
    "🔒 100% secure payments",
    "🔄 30-day easy returns",
    "⚡ Flash deals every day — don't miss out!",
  ];
  const text = items.join("   ·   ") + "   ·   " + items.join("   ·   ");
  return (
    <div style={{
      background: "#2d2a6e", color: C.white,
      fontSize: 12, fontWeight: 500, padding: "8px 0",
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 210,
      height: 36, display: "flex", alignItems: "center",
    }}>
      <div className="vx-ticker-wrap" style={{ width: "100%" }}>
        <span className="vx-ticker">{text}</span>
      </div>
    </div>
  );
}

// ─── Main Navbar — logo + categories only (NO category pills row, NO action icons) ──
function MainNav({ dispatch }) {
  return (
    <nav style={{
      background: "linear-gradient(90deg, #1e1b4b 0%, #3730a3 35%, #4f46e5 65%, #818cf8 100%)",
      boxShadow: "0 3px 20px rgba(55,48,163,0.35)",
      position: "fixed",
      top: 36,
      left: 0, right: 0,
      zIndex: 200,
      height: 58,
      display: "flex",
      alignItems: "center",
    }}>
      <div className="vx-pad" style={{ display:"flex", alignItems:"center", gap:18, maxWidth:1400, margin:"0 auto", width:"100%" }}>

        {/* Logo */}
        <Link to="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none", flexShrink:0 }}>
          <div style={{
            width: 42, height: 42,
            background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #f97316 100%)",
            borderRadius: 11,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 0 2.5px rgba(255,255,255,0.3), 0 4px 14px rgba(245,158,11,0.5)",
            flexShrink: 0,
          }}>
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L18 7V13L10 18L2 13V7L10 2Z"
                stroke="#fff" strokeWidth="1.4" fill="rgba(255,255,255,0.18)" />
              <circle cx="10" cy="10" r="3.2" fill="#fff" />
            </svg>
          </div>
          <div style={{ lineHeight:1.1 }}>
            <div style={{ fontWeight:900, fontSize:20, color:"#fff", letterSpacing:"-0.5px", lineHeight:1, textShadow:"0 1px 6px rgba(0,0,0,0.25)" }}>
              VANTIX<span style={{ color:"#fbbf24" }}>.</span>
            </div>
            <div style={{ fontSize:8.5, fontWeight:700, color:"rgba(255,255,255,0.65)", letterSpacing:"2.5px", textTransform:"uppercase", marginTop:2 }}>
              SHOP254
            </div>
          </div>
        </Link>

        {/* Divider */}
        <div style={{ width:1, height:30, background:"rgba(255,255,255,0.22)", flexShrink:0 }} />

        {/* Categories */}
        <div style={{ display:"flex", gap:2, overflowX:"auto", scrollbarWidth:"none", flex:1, alignItems:"center" }}>
          <Link to="/products"
            onClick={() => dispatch({ type:"SET_FILTER", filter:{ category:"all" } })}
            style={{ padding:"0 15px", height:32, display:"flex", alignItems:"center", fontSize:13, fontWeight:700, color:"#fff", background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.35)", borderRadius:20, textDecoration:"none", whiteSpace:"nowrap", flexShrink:0 }}>
            All
          </Link>
          {CATEGORIES.filter(c => c !== "all").map(cat => (
            <Link key={cat} to={`/products?category=${cat}`}
              onClick={() => dispatch({ type:"SET_FILTER", filter:{ category:cat } })}
              style={{ padding:"0 14px", height:32, display:"flex", alignItems:"center", fontSize:13, fontWeight:500, color:"rgba(255,255,255,0.92)", borderRadius:20, textDecoration:"none", whiteSpace:"nowrap", flexShrink:0, textTransform:"capitalize" }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="transparent"; }}
            >{cat}</Link>
          ))}
        </div>

        {/* No action icons (WhatsApp, Call, Email, Wishlist, Cart, User) — removed */}

      </div>
    </nav>
  );
}

// ─── Trust badge items ────────────────────────────────────────────────────────
const TRUST_ITEMS = [
  { icon:"↩️", title:"Easy Returns",    desc:"30-day returns",   glowClass:"trust-glow-1" },
  { icon:"🔒", title:"Secure Payments", desc:"100% protected",   glowClass:"trust-glow-2" },
  { icon:"🎧", title:"24/7 Support",    desc:"Always here",      glowClass:"trust-glow-3" },
  { icon:"🚚", title:"Fast Delivery",   desc:"Countrywide",      glowClass:"trust-glow-4" },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { dispatch } = useApp();

  return (
    <div className="vx-page">
      <style>{GLOBAL_CSS}</style>

      <PromoBar />

      <MainNav dispatch={dispatch} />

      {/* PromoBar 36px + Nav 58px = 94px */}
      <div style={{ height: 94 }} />

      <div className="vx-pad" style={{ maxWidth:1400, margin:"0 auto", paddingTop:16, paddingBottom:32 }}>

        {/* Hero zone */}
        <div className="vx-hero-layout" style={{ gap:10, marginBottom:12 }}>
          <div className="vx-sidebar"><LeftAdColumn /></div>
          <HeroBanner />
          <div className="vx-subbanner" style={{ flexDirection:"column", gap:8 }}><SubBanners /></div>
        </div>

        {/* 3D cube category row */}
        <div
          style={{
            background: C.white,
            borderRadius: 12,
            padding: "20px 16px",
            marginBottom: 12,
            border: `1px solid ${C.gray200}`,
          }}
        >
          <QuickCats dispatch={dispatch} />
        </div>

        {/* Flash sale */}
        <div style={{ background:C.red, borderRadius:12, overflow:"hidden", marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 16px", flexWrap:"wrap", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:18 }}>⚡</span>
              <span style={{ color:C.white, fontWeight:900, fontSize:16 }}>Flash Sales</span>
              <span style={{ color:"rgba(255,255,255,0.65)", fontSize:12, marginLeft:4 }}>| Live Now</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ color:"rgba(255,255,255,0.8)", fontSize:12 }}>Time Left:</span>
              <Countdown />
            </div>
            <Link to="/products" style={{ color:C.white, fontSize:12, fontWeight:700, textDecoration:"none", background:"rgba(255,255,255,0.15)", padding:"5px 14px", borderRadius:20 }}>See All →</Link>
          </div>
          <div style={{ background:C.gray50, padding:"12px" }}>
            <div className="vx-flash-grid">
              {flashSaleProducts.map(p => (
                <div key={p.id} className="vx-pcard"><ProductCard product={p} compact /></div>
              ))}
            </div>
          </div>
        </div>

        {/* Promo banners */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:10, marginBottom:12 }}>
          {[
            { title:"Top Phones",   sub:"Latest models",  bg:`linear-gradient(135deg,${C.indigo},#6366f1)`,  img:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=320&q=85", link:"/products?category=phones" },
            { title:"Laptop Deals", sub:"Up to 15% off",  bg:`linear-gradient(135deg,#111827,#374151)`,       img:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=320&q=85", link:"/products?category=laptops" },
            { title:"Audio Week",   sub:"Premium sound",  bg:`linear-gradient(135deg,#7c3aed,#a855f7)`,       img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=320&q=85", link:"/products?category=audio" },
          ].map(b=>(
            <Link key={b.title} to={b.link} style={{ background:b.bg, borderRadius:12, padding:"18px 20px", textDecoration:"none", display:"flex", alignItems:"center", justifyContent:"space-between", minHeight:90, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"relative", zIndex:2 }}>
                <p style={{ color:C.white, fontWeight:800, fontSize:15, marginBottom:3 }}>{b.title}</p>
                <p style={{ color:"rgba(255,255,255,0.7)", fontSize:12, marginBottom:10 }}>{b.sub}</p>
                <span style={{ background:"rgba(255,255,255,0.2)", color:C.white, fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:20 }}>Shop Now →</span>
              </div>
              <img src={b.img} alt={b.title} style={{ position:"absolute", right:0, top:0, height:"100%", width:"50%", objectFit:"cover", objectPosition:"center", borderRadius:"0 12px 12px 0" }} />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right, rgba(0,0,0,0.45) 45%, transparent 100%)", borderRadius:12 }} />
            </Link>
          ))}
        </div>

        {/* Featured products */}
        <div style={{ background:C.white, borderRadius:12, padding:"16px", marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:14 }}>
            <div>
              <h2 style={{ fontSize:18, fontWeight:900, color:C.indigoDark, margin:0 }}>Featured Products</h2>
              <p style={{ fontSize:12, color:C.gray400, marginTop:3 }}>Handpicked top deals for you</p>
            </div>
            <Link to="/products" style={{ color:C.indigo, fontSize:13, fontWeight:700, textDecoration:"none" }}>See All →</Link>
          </div>
          <div className="vx-feat-grid">
            {products.slice(0, 12).map(p => (
              <div key={p.id} className="vx-pcard"><ProductCard product={p} /></div>
            ))}
          </div>
        </div>

        {/* Trust strip */}
        <div className="vx-trust">
          {TRUST_ITEMS.map(item => (
            <div key={item.title} className={item.glowClass} style={{
              background: "#2d2a6e",
              borderRadius: 40,
              padding: "8px 16px 8px 12px",
              display: "flex",
              alignItems: "center",
              gap: 9,
            }}>
              <span style={{ fontSize: 17, flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
              <div>
                <p style={{ fontWeight: 700, color: C.white, fontSize: 11.5, lineHeight: 1.25, margin: 0 }}>{item.title}</p>
                <p style={{ fontSize: 9.5, color: "rgba(255,255,255,0.48)", lineHeight: 1.25, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
// FILE: src/pages/HomePage.jsx

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { products, flashSaleProducts, CATEGORIES } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useApp } from "../context/AppContext";

const C = {
  indigo:      "#3730a3",
  indigoDark:  "#1e1b4b",
  indigoMid:   "#4f46e5",
  amber:       "#f59e0b",
  red:         "#dc2626",
  white:       "#ffffff",
  gray50:      "#f9fafb",
  gray100:     "#f3f4f6",
  gray200:     "#e5e7eb",
  gray400:     "#9ca3af",
  gray900:     "#111827",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; }
  html, body { overflow-x: hidden; width: 100%; }
  .vx-page { width: 100%; overflow-x: hidden; background: #f3f4f6; }

  @keyframes vxTicker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .vx-ticker-wrap { overflow: hidden; white-space: nowrap; }
  .vx-ticker { display: inline-block; animation: vxTicker 22s linear infinite; }

  @keyframes vxHeroIn {
    from { opacity: 0; transform: translateX(24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .vx-hero-slide { animation: vxHeroIn 0.42s ease; }

  @keyframes adScroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .vx-ad-strip-inner {
    display: inline-flex;
    gap: 8px;
    animation: adScroll 28s linear infinite;
    will-change: transform;
  }
  .vx-ad-strip-inner:hover { animation-play-state: paused; }

  .vx-pad { padding-left: 12px; padding-right: 12px; }
  @media (min-width: 640px)  { .vx-pad { padding-left: 20px; padding-right: 20px; } }
  @media (min-width: 1024px) { .vx-pad { padding-left: 32px; padding-right: 32px; } }

  /* ── Horizontal scroll rows ── */
  .vx-hscroll {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: #c7d2fe transparent;
    padding-bottom: 6px;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
  }
  .vx-hscroll::-webkit-scrollbar { height: 4px; }
  .vx-hscroll::-webkit-scrollbar-track { background: transparent; }
  .vx-hscroll::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 4px; }
  .vx-hscroll > * { scroll-snap-align: start; flex-shrink: 0; }

  .vx-flash-item { width: 140px; }
  @media (min-width: 480px) { .vx-flash-item { width: 160px; } }

  .vx-feat-item { width: 155px; }
  @media (min-width: 480px) { .vx-feat-item { width: 175px; } }

  /* offer cards */
  .vx-offer-item {
    width: 130px;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    text-decoration: none;
    display: block;
    aspect-ratio: 3/4;
    transition: transform 0.18s;
    flex-shrink: 0;
  }
  @media (min-width: 480px) { .vx-offer-item { width: 150px; } }
  .vx-offer-item:hover { transform: translateY(-3px); }
  .vx-offer-item img { width:100%; height:100%; object-fit:cover; display:block; }
  .vx-offer-item .oc-overlay {
    position:absolute; inset:0;
    background: linear-gradient(to top, rgba(0,0,0,0.78) 42%, rgba(0,0,0,0.04) 100%);
  }
  .vx-offer-item .oc-content {
    position:absolute; bottom:0; left:0; right:0; padding:9px 10px;
  }
  .oc-badge {
    display:inline-block; font-size:8px; font-weight:800;
    padding:2px 7px; border-radius:20px; margin-bottom:4px;
    text-transform:uppercase; letter-spacing:0.04em;
  }
  .oc-title { color:#fff; font-weight:800; font-size:12px; line-height:1.2; margin-bottom:2px; }
  .oc-price { font-weight:900; font-size:12px; margin-bottom:5px; }
  .oc-cta {
    display:inline-block; font-size:9px; font-weight:700;
    background:rgba(255,255,255,0.22); color:#fff;
    padding:2px 8px; border-radius:20px;
  }

  .vx-pcard { transition: box-shadow 0.18s, transform 0.18s; }
  .vx-pcard:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(55,48,163,0.13); }

  .vx-sec-hd { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
  .vx-sec-hd h2 { font-size:15px; font-weight:900; color:#1e1b4b; margin:0; }
  .vx-sec-hd a  { color:#3730a3; font-size:12px; font-weight:700; text-decoration:none; }

  .vx-sidebar { display: none; }
  @media (min-width: 900px) { .vx-sidebar { display: block; } }

  .vx-hero-layout { display: grid; grid-template-columns: 1fr; }
  @media (min-width: 900px) { .vx-hero-layout { grid-template-columns: 210px 1fr 200px; gap: 10px; } }

  .vx-subbanner { display: none; }
  @media (min-width: 900px) { .vx-subbanner { display: flex; } }
`;

// ─── Countdown ────────────────────────────────────────────────────────────────
function Countdown() {
  const [t, setT] = useState({ h:5, m:43, s:22 });
  useEffect(() => {
    const id = setInterval(() => setT(({ h, m, s }) => {
      if (--s < 0) { s=59; if (--m < 0) { m=59; if (--h < 0) h=23; } }
      return { h, m, s };
    }), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = n => String(n).padStart(2,"0");
  const Seg = ({ v }) => (
    <span style={{ background:"#2d2a6e", color:"#fff", fontWeight:800, fontSize:13, padding:"2px 6px", borderRadius:4, minWidth:26, textAlign:"center", fontFamily:"monospace" }}>{v}</span>
  );
  return (
    <div style={{ display:"flex", alignItems:"center", gap:3 }}>
      <Seg v={pad(t.h)}/><span style={{ color:"#fff", fontWeight:800 }}>:</span>
      <Seg v={pad(t.m)}/><span style={{ color:"#fff", fontWeight:800 }}>:</span>
      <Seg v={pad(t.s)}/>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
const SLIDES = [
  { tag:"🔥 Trending Now", title:"Smartphones & Accessories", sub:"Starting from", price:"KES 5,000", cta:"Shop Now", ctaLink:"/products?category=phones", bg:`linear-gradient(135deg,#1e1b4b 0%,#3730a3 55%,#6366f1 100%)`, img:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=480&q=85", accent:"#f59e0b" },
  { tag:"💻 New Arrivals",  title:"MacBooks & Laptops",        sub:"Up to",         price:"20% Off",   cta:"View Deals", ctaLink:"/products?category=laptops", bg:`linear-gradient(135deg,#111827 0%,#1e3a5f 55%,#1a3a8f 100%)`, img:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=480&q=85", accent:"#38bdf8" },
  { tag:"🎧 Audio Week",   title:"Premium Headphones",         sub:"Deals from",    price:"KES 2,500", cta:"Shop Audio", ctaLink:"/products?category=audio",   bg:`linear-gradient(135deg,#1e1b4b 0%,#4c1d95 55%,#7c3aed 100%)`, img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=480&q=85", accent:"#a78bfa" },
];
function HeroBanner() {
  const [cur, setCur] = useState(0);
  const [key, setKey] = useState(0);
  useEffect(() => {
    const id = setInterval(()=>{ setCur(c=>(c+1)%SLIDES.length); setKey(k=>k+1); }, 4500);
    return ()=>clearInterval(id);
  }, []);
  const s = SLIDES[cur];
  return (
    <div style={{ position:"relative", borderRadius:10, overflow:"hidden", height:260 }}>
      <div key={key} className="vx-hero-slide" style={{ background:s.bg, height:"100%", display:"flex", alignItems:"center", padding:"18px 22px", position:"relative" }}>
        <div style={{ flex:1, zIndex:2, position:"relative" }}>
          <span style={{ background:"rgba(255,255,255,0.14)", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:20, display:"inline-block", marginBottom:8 }}>{s.tag}</span>
          <h2 style={{ color:"#fff", fontWeight:900, fontSize:"clamp(16px,3.5vw,25px)", lineHeight:1.15, marginBottom:8, maxWidth:260 }}>{s.title}</h2>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:12, marginBottom:3 }}>{s.sub}</p>
          <p style={{ color:s.accent, fontWeight:900, fontSize:23, marginBottom:16 }}>{s.price}</p>
          <Link to={s.ctaLink} style={{ background:"#fff", color:"#3730a3", fontWeight:800, fontSize:12, padding:"8px 18px", borderRadius:8, textDecoration:"none", display:"inline-block" }}>{s.cta} →</Link>
        </div>
        <img src={s.img} alt="" style={{ position:"absolute", right:0, top:0, height:"100%", width:"45%", objectFit:"cover", opacity:0.4, borderRadius:"0 10px 10px 0" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(0,0,0,0.2) 45%,transparent 100%)", borderRadius:10 }} />
        <div style={{ position:"absolute", bottom:10, left:18, display:"flex", gap:5, zIndex:3 }}>
          {SLIDES.map((_,i)=>(
            <button key={i} onClick={()=>{setCur(i);setKey(k=>k+1);}} style={{ width:cur===i?18:5, height:5, borderRadius:3, background:cur===i?"#fff":"rgba(255,255,255,0.35)", border:"none", cursor:"pointer", padding:0, transition:"width 0.3s" }} />
          ))}
        </div>
        {[-1,1].map(dir=>(
          <button key={dir} onClick={()=>{setCur(c=>(c+dir+SLIDES.length)%SLIDES.length);setKey(k=>k+1);}} style={{ position:"absolute", [dir<0?"left":"right"]:8, top:"50%", transform:"translateY(-50%)", background:"rgba(255,255,255,0.18)", border:"none", borderRadius:"50%", width:28, height:28, color:"#fff", fontSize:14, cursor:"pointer", zIndex:4, display:"flex", alignItems:"center", justifyContent:"center" }}>{dir<0?"‹":"›"}</button>
        ))}
      </div>
    </div>
  );
}

const LEFT_ADS = [
  { label:"Latest Phones", sub:"From KES 8,999", img:"https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=320&q=85", link:"/products?category=phones" },
  { label:"Tablet Deals",  sub:"Up to 20% off",  img:"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=320&q=85", link:"/products?category=tablets" },
  { label:"Camera Gear",   sub:"Pro savings",     img:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=320&q=85", link:"/products?category=cameras" },
];
function LeftAdColumn() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8, height:260 }}>
      {LEFT_ADS.map(b=>(
        <Link key={b.label} to={b.link} style={{ flex:1, borderRadius:10, textDecoration:"none", overflow:"hidden", position:"relative", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"8px 10px" }}>
          <img src={b.img} alt={b.label} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.72) 40%,rgba(0,0,0,0.08) 100%)" }} />
          <div style={{ position:"relative", zIndex:2 }}>
            <p style={{ color:"#fff", fontWeight:800, fontSize:11, marginBottom:1 }}>{b.label}</p>
            <p style={{ color:"rgba(255,255,255,0.6)", fontSize:9, marginBottom:4 }}>{b.sub}</p>
            <span style={{ background:"rgba(255,255,255,0.2)", color:"#fff", fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:20 }}>Shop →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

const SUB_BANNERS = [
  { label:"Gaming Week", sub:"Up to 30% off", img:"https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=260&q=85", link:"/products?category=gaming", bg:`linear-gradient(135deg,#111827,#1a2744)` },
  { label:"Audio Deals", sub:"Premium sound",  img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=260&q=85", link:"/products?category=audio",  bg:`linear-gradient(135deg,#3730a3,#6366f1)` },
];
function SubBanners() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8, height:260 }}>
      {SUB_BANNERS.map(b=>(
        <Link key={b.label} to={b.link} style={{ flex:1, background:b.bg, borderRadius:10, padding:"12px 14px", textDecoration:"none", display:"flex", flexDirection:"column", justifyContent:"space-between", overflow:"hidden", position:"relative" }}>
          <div style={{ position:"relative", zIndex:2 }}>
            <p style={{ color:"#fff", fontWeight:800, fontSize:13, marginBottom:2 }}>{b.label}</p>
            <p style={{ color:"rgba(255,255,255,0.6)", fontSize:10 }}>{b.sub}</p>
          </div>
          <span style={{ background:"rgba(255,255,255,0.18)", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, alignSelf:"flex-start", position:"relative", zIndex:2 }}>Shop Now →</span>
          <img src={b.img} alt={b.label} style={{ position:"absolute", right:0, top:0, height:"100%", width:"55%", objectFit:"cover", borderRadius:"0 10px 10px 0" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(0,0,0,0.55) 40%,transparent 100%)" }} />
        </Link>
      ))}
    </div>
  );
}

const OFFER_CATS = [
  { label:"Phones",      badge:"Hot 🔥",      badgeColor:"#dc2626", price:"From KES 8,999",  priceColor:"#fbbf24", img:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85",  link:"/products?category=phones" },
  { label:"Laptops",     badge:"New 💻",      badgeColor:"#2563eb", price:"Up to 20% Off",   priceColor:"#6ee7b7", img:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=85",  link:"/products?category=laptops" },
  { label:"Audio",       badge:"Deal 🎧",     badgeColor:"#7c3aed", price:"From KES 2,500",  priceColor:"#c4b5fd", img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=85",  link:"/products?category=audio" },
  { label:"Tablets",     badge:"Sale 📱",     badgeColor:"#d97706", price:"Up to 15% Off",   priceColor:"#fcd34d", img:"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=85",     link:"/products?category=tablets" },
  { label:"Gaming",      badge:"Epic 🎮",     badgeColor:"#059669", price:"Up to 30% Off",   priceColor:"#6ee7b7", img:"https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&q=85",  link:"/products?category=gaming" },
  { label:"Cameras",     badge:"Pro 📷",      badgeColor:"#0369a1", price:"From KES 25,000", priceColor:"#7dd3fc", img:"https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=400&q=85",  link:"/products?category=cameras" },
  { label:"Accessories", badge:"⚡ Essentials",badgeColor:"#9d174d", price:"From KES 500",    priceColor:"#f9a8d4", img:"https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=85",  link:"/products?category=accessories" },
  { label:"Clearance",   badge:"−50% 🏷️",    badgeColor:"#dc2626", price:"While stocks last",priceColor:"#fca5a5",img:"https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=85",  link:"/products" },
];

function Section({ title, link, children, bg="#fff" }) {
  return (
    <div style={{ background:bg, borderRadius:12, padding:"13px 13px 15px", marginBottom:10 }}>
      <div className="vx-sec-hd">
        <h2>{title}</h2>
        {link && <Link to={link}>See All →</Link>}
      </div>
      {children}
    </div>
  );
}

export default function HomePage() {
  const { dispatch, cartCount, wishlist, user, logout } = useApp();

  return (
    <div className="vx-page">
      <style>{GLOBAL_CSS}</style>

      {/* No spacer needed — App.jsx <main> already offsets by navHeight via ResizeObserver */}

      <div className="vx-pad" style={{ maxWidth:1400, margin:"0 auto", paddingTop:0, paddingBottom:80 }}>

        {/* Hero */}
        <div className="vx-hero-layout" style={{ gap:10, marginBottom:10 }}>
          <div className="vx-sidebar"><LeftAdColumn /></div>
          <HeroBanner />
          <div className="vx-subbanner" style={{ flexDirection:"column", gap:8 }}><SubBanners /></div>
        </div>

        {/* Shop by Category — horizontal scroll */}
        <Section title="Shop by Category" link="/products">
          <div className="vx-hscroll">
            {OFFER_CATS.map(cat => (
              <Link key={cat.label} to={cat.link}
                onClick={() => dispatch({ type:"SET_FILTER", filter:{ category:cat.label.toLowerCase() } })}
                className="vx-offer-item"
              >
                <img src={cat.img} alt={cat.label} />
                <div className="oc-overlay" />
                <div className="oc-content">
                  <span className="oc-badge" style={{ background:cat.badgeColor, color:"#fff" }}>{cat.badge}</span>
                  <p className="oc-title">{cat.label}</p>
                  <p className="oc-price" style={{ color:cat.priceColor }}>{cat.price}</p>
                  <span className="oc-cta">Shop →</span>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        {/* Flash sale */}
        <div style={{ background:C.red, borderRadius:12, overflow:"hidden", marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 13px", flexWrap:"wrap", gap:6 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:15 }}>⚡</span>
              <span style={{ color:"#fff", fontWeight:900, fontSize:14 }}>Flash Sales</span>
              <span style={{ color:"rgba(255,255,255,0.55)", fontSize:10 }}>| Live Now</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <span style={{ color:"rgba(255,255,255,0.7)", fontSize:10 }}>Time Left:</span>
              <Countdown />
            </div>
            <Link to="/products" style={{ color:"#fff", fontSize:10, fontWeight:700, textDecoration:"none", background:"rgba(255,255,255,0.15)", padding:"3px 11px", borderRadius:20 }}>See All →</Link>
          </div>
          <div style={{ background:C.gray50, padding:"10px 13px" }}>
            <div className="vx-hscroll">
              {flashSaleProducts.map(p => (
                <div key={p.id} className="vx-pcard vx-flash-item"><ProductCard product={p} compact /></div>
              ))}
            </div>
          </div>
        </div>

        {/* Promo banners */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))", gap:10, marginBottom:10 }}>
          {[
            { title:"Top Phones",   sub:"Latest models",  bg:`linear-gradient(135deg,#3730a3,#6366f1)`, img:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=320&q=85", link:"/products?category=phones" },
            { title:"Laptop Deals", sub:"Up to 15% off",  bg:`linear-gradient(135deg,#111827,#374151)`,  img:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=320&q=85", link:"/products?category=laptops" },
            { title:"Audio Week",   sub:"Premium sound",  bg:`linear-gradient(135deg,#7c3aed,#a855f7)`,  img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=320&q=85", link:"/products?category=audio" },
          ].map(b=>(
            <Link key={b.title} to={b.link} style={{ background:b.bg, borderRadius:12, padding:"15px 16px", textDecoration:"none", display:"flex", alignItems:"center", justifyContent:"space-between", minHeight:78, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"relative", zIndex:2 }}>
                <p style={{ color:"#fff", fontWeight:800, fontSize:13, marginBottom:2 }}>{b.title}</p>
                <p style={{ color:"rgba(255,255,255,0.62)", fontSize:10, marginBottom:8 }}>{b.sub}</p>
                <span style={{ background:"rgba(255,255,255,0.2)", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:20 }}>Shop Now →</span>
              </div>
              <img src={b.img} alt={b.title} style={{ position:"absolute", right:0, top:0, height:"100%", width:"46%", objectFit:"cover", borderRadius:"0 12px 12px 0" }} />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(0,0,0,0.44) 44%,transparent 100%)", borderRadius:12 }} />
            </Link>
          ))}
        </div>

        {/* Featured products — horizontal scroll */}
        <Section title="Featured Products" link="/products">
          <div className="vx-hscroll">
            {products.slice(0,14).map(p => (
              <div key={p.id} className="vx-pcard vx-feat-item"><ProductCard product={p} /></div>
            ))}
          </div>
        </Section>

        {/* Trust bar */}
        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"5px 16px", padding:"8px 0 2px" }}>
          {[
            { icon:"↩️", label:"30-day Returns" },
            { icon:"🔒", label:"Secure Payments" },
            { icon:"🎧", label:"24/7 Support" },
            { icon:"🚚", label:"Fast Delivery" },
          ].map(t => (
            <span key={t.label} style={{ fontSize:10.5, color:C.gray400, display:"flex", alignItems:"center", gap:3, fontWeight:600 }}>
              <span style={{ fontSize:12 }}>{t.icon}</span>{t.label}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}
// FILE: src/components/HeroBanner.jsx
import { Link } from "react-router-dom";

export default function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-violet-950 to-indigo-900 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="max-w-2xl">
          <span className="inline-block bg-violet-500/20 text-violet-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-violet-500/30">
            🎉 New arrivals just dropped
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-5 leading-tight">
            Shop the
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300"> Future</span>
            <br />of Retail
          </h1>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-xl">
            Curated products from top brands. Discover electronics, fashion, home goods and more — all in one place.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/" className="px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition shadow-lg hover:shadow-violet-500/30">
              Shop Now
            </Link>
            <Link to="/" className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition border border-white/20 backdrop-blur">
              View Electronics
            </Link>
          </div>

          <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-white/10">
            {[
              { value: "50K+", label: "Happy Customers" },
              { value: "1,200+", label: "Products" },
              { value: "4.8★", label: "Avg. Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
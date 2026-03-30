import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} LumaShop. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="bg-slate-800 px-2 py-1 rounded text-slate-300 font-semibold">Stripe</span>
            <span className="bg-slate-800 px-2 py-1 rounded text-green-400 font-semibold">M-Pesa</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
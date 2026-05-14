import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

const KES_RATE = 130;
const FREE_SHIPPING_THRESHOLD = 6500;
const SHIPPING_FEE = 500;
const TAX_RATE = 0.08;

const toKes = (usd) => usd * KES_RATE;
const fmt = (kes) =>
  `KES ${Math.round(kes).toLocaleString("en-KE")}`;

export default function Cart() {
  const { cart, cartTotal, removeFromCart, updateQty, clearCart } = useApp();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const cartTotalKes = toKes(cartTotal);
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);
  const shipping = cartTotalKes >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const tax = cartTotalKes * TAX_RATE;
  const discount = promoApplied ? cartTotalKes * 0.1 : 0;
  const orderTotal = cartTotalKes + shipping + tax - discount;
  const shipProgress = Math.min(100, (cartTotalKes / FREE_SHIPPING_THRESHOLD) * 100);
  const shipRemaining = FREE_SHIPPING_THRESHOLD - cartTotalKes;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "VANTIX10") {
      setPromoApplied(true);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.25}
            className="w-12 h-12 text-slate-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
          Your cart is empty
        </h2>
        <p className="text-slate-400 text-sm mb-8 max-w-xs">
          Looks like you haven't added anything yet. Browse our catalogue to
          get started.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Shopping cart
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your bag
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
          </svg>
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

        {/* ── Cart Items ──────────────────────────────────────────── */}
        <div className="space-y-3">
          {cart.map((item, index) => {
            const lineKes = toKes(item.price * item.qty);
            const unitKes = toKes(item.price);
            return (
              <div
                key={item.id}
                className="group bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4 hover:border-slate-200 transition-colors shadow-sm"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {/* Thumbnail */}
                <Link to={`/product/${item.id}`} className="shrink-0">
                  <div className="w-[72px] h-[72px] rounded-xl bg-slate-50 overflow-hidden border border-slate-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.id}`}
                    className="block text-sm font-medium text-slate-800 hover:text-indigo-600 transition-colors leading-snug line-clamp-2"
                  >
                    {item.title}
                  </Link>
                  <p className="text-[11px] text-slate-400 capitalize mt-0.5 mb-2">
                    {item.category}
                  </p>
                  <p className="text-sm font-semibold text-indigo-600">
                    {fmt(unitKes)}
                  </p>

                  {/* Qty stepper */}
                  <div className="flex items-center gap-2 mt-2.5">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      disabled={item.qty <= 1}
                      aria-label="Decrease quantity"
                      className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition text-base leading-none"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-slate-800">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      aria-label="Increase quantity"
                      className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition text-base leading-none"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Line total + remove */}
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    {fmt(lineKes)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-2 text-[11px] text-slate-400 hover:text-red-500 transition-colors flex items-center gap-0.5 ml-auto"
                  >
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                      <path d="M5.28 4.22a.75.75 0 00-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 101.06 1.06L8 9.06l2.72 2.72a.75.75 0 101.06-1.06L9.06 8l2.72-2.72a.75.75 0 00-1.06-1.06L8 6.94 5.28 4.22z" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          {/* Free shipping progress */}
          {shipping > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3.5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-amber-700">
                  Add{" "}
                  <span className="font-bold">
                    {fmt(shipRemaining)}
                  </span>{" "}
                  more for free delivery
                </p>
                <span className="text-[11px] text-amber-500">
                  {Math.round(shipProgress)}%
                </span>
              </div>
              <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${shipProgress}%` }}
                />
              </div>
            </div>
          )}

          {shipping === 0 && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 flex items-center gap-2">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-500 shrink-0">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <p className="text-xs font-medium text-emerald-700">
                You've unlocked free delivery! 🎉
              </p>
            </div>
          )}
        </div>

        {/* ── Order Summary ───────────────────────────────────────── */}
        <div className="lg:sticky lg:top-20 self-start">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">

            {/* Summary header */}
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-800">
                Order summary
              </h2>
            </div>

            {/* Line items */}
            <div className="px-5 py-4 space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>
                  Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
                <span className="font-medium text-slate-800">
                  {fmt(cartTotalKes)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                {shipping === 0 ? (
                  <span className="text-emerald-600 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded-full">
                    FREE
                  </span>
                ) : (
                  <span className="font-medium text-slate-800">
                    {fmt(shipping)}
                  </span>
                )}
              </div>

              <div className="flex justify-between text-slate-600">
                <span>VAT (8%)</span>
                <span className="font-medium text-slate-800">{fmt(tax)}</span>
              </div>

              {promoApplied && (
                <div className="flex justify-between text-emerald-600">
                  <span className="flex items-center gap-1">
                    Promo (VANTIX10)
                    <button
                      onClick={() => {
                        setPromoApplied(false);
                        setPromoCode("");
                      }}
                      className="text-slate-300 hover:text-red-400 transition-colors"
                    >
                      ✕
                    </button>
                  </span>
                  <span className="font-semibold">−{fmt(discount)}</span>
                </div>
              )}

              <div className="border-t border-dashed border-slate-100 pt-3 flex justify-between items-baseline">
                <span className="font-semibold text-slate-900 text-sm">
                  Total
                </span>
                <span className="text-xl font-bold text-indigo-600 tracking-tight">
                  {fmt(orderTotal)}
                </span>
              </div>
            </div>

            {/* Promo code */}
            {!promoApplied && (
              <div className="px-5 pb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                    placeholder="Promo code"
                    className="flex-1 px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder-slate-300"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-4 py-2.5 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-[10px] text-slate-300 mt-1.5 pl-1">
                  Try VANTIX10 for 10% off
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="px-5 pb-5 space-y-2.5">
              <Link
                to="/checkout"
                className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl transition-all shadow-sm text-sm"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
                Proceed to checkout
              </Link>

              <Link
                to="/"
                className="block text-center text-xs text-slate-400 hover:text-indigo-600 transition-colors py-1"
              >
                ← Continue shopping
              </Link>
            </div>

            {/* Trust badges */}
            <div className="border-t border-slate-100 px-5 py-3 grid grid-cols-3 gap-2 text-center">
              {[
                { icon: "🔒", label: "Secure checkout" },
                { icon: "🚚", label: "Fast delivery" },
                { icon: "↩️", label: "Easy returns" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <span className="text-base">{icon}</span>
                  <span className="text-[10px] text-slate-400 leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Accepted payments note */}
          <p className="text-center text-[11px] text-slate-300 mt-3">
            M-Pesa · Visa · Mastercard · Airtel Money
          </p>
        </div>
      </div>
    </div>
  );
}
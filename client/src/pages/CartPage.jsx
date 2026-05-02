// FILE: src/pages/CartPage.jsx
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const KES_RATE = 130;
const fmt = (usd) =>
  `KES ${(usd * KES_RATE).toLocaleString("en-KE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtKes = (kes) =>
  `KES ${kes.toLocaleString("en-KE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const PAYMENT_BADGES = [
  { name: "Visa",         bg: "#1a1f71", color: "#fff" },
  { name: "M-Pesa",       bg: "#00a651", color: "#fff" },
  { name: "PayPal",       bg: "#0070ba", color: "#fff" },
  { name: "Airtel Money", bg: "#e4002b", color: "#fff" },
];

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, updateQty, clearCart } = useApp();
  const navigate = useNavigate();
  const cartTotalKes = cartTotal * KES_RATE;

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth={1.5} className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-1">Your cart is empty</h2>
        <p className="text-gray-400 text-sm mb-5">Add some products to get started</p>
        <Link to="/products" className="inline-block px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-xs text-gray-400 mt-0.5">{cart.reduce((s, i) => s + i.qty, 0)} item(s)</p>
        </div>
        <button onClick={clearCart} className="text-xs text-red-400 hover:text-red-600 font-medium border border-red-100 hover:border-red-200 px-3 py-1.5 rounded-lg transition">
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Items ── */}
        <div className="lg:col-span-2 space-y-2">
          {cart.map((item) => (
            <div key={`${item.id}-${item.variant}`} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">

              {/* Image */}
              <Link to={`/product/${item.id}`} className="shrink-0">
                <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-xl bg-gray-50" />
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.id}`} className="text-sm font-semibold text-gray-800 hover:text-indigo-600 line-clamp-2 leading-snug transition">
                  {item.title}
                </Link>
                {item.variant && <p className="text-xs text-gray-400 mt-0.5">Variant: {item.variant}</p>}
                <p className="text-indigo-600 font-bold text-sm mt-1">{fmt(item.price)}</p>
              </div>

              {/* Qty */}
              <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 shrink-0">
                <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-indigo-600 font-bold text-sm transition">−</button>
                <span className="w-7 text-center font-bold text-gray-800 text-sm">{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-indigo-600 font-bold text-sm transition">+</button>
              </div>

              {/* Total + Remove */}
              <div className="text-right shrink-0">
                <p className="font-bold text-gray-900 text-sm">{fmt(item.price * item.qty)}</p>
                <button onClick={() => removeFromCart(item.id, item.variant)} className="text-[11px] text-gray-300 hover:text-red-400 mt-1 transition">Remove</button>
              </div>
            </div>
          ))}

          <Link to="/products" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-600 transition mt-1 ml-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
            Continue Shopping
          </Link>
        </div>

        {/* ── Summary ── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">

            <h2 className="font-bold text-gray-900 text-sm mb-4">Order Summary</h2>

            {/* Totals */}
            <div className="space-y-2.5 text-sm mb-5">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
                <span className="font-semibold text-gray-800">{fmtKes(cartTotalKes)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery</span>
                <span className="text-xs text-gray-400 italic">At checkout</span>
              </div>
              <div className="border-t border-dashed border-gray-100 pt-2.5 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-indigo-600 text-base">{fmtKes(cartTotalKes)}</span>
              </div>
            </div>

            {/* Promo */}
            <div className="flex gap-1.5 mb-4">
              <input type="text" placeholder="Promo code" className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              <button className="px-3 py-2 bg-gray-700 hover:bg-gray-800 text-white text-xs font-bold rounded-lg transition">Apply</button>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-sm shadow-indigo-200"
            >
              Proceed to Checkout →
            </button>

            {/* Payment badges */}
            <div className="mt-4 pt-4 border-t border-gray-50">
              <p className="text-[10px] text-gray-400 text-center mb-2 uppercase tracking-widest font-medium">We accept</p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {PAYMENT_BADGES.map((p) => (
                  <span key={p.name} style={{ background: p.bg, color: p.color }} className="text-[9px] font-bold px-2.5 py-1 rounded-lg">
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
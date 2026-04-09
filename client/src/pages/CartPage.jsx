// FILE: src/pages/CartPage.jsx
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://electronics-shop-api-id3m.onrender.com';


export default function CartPage() {
  const { cart, cartTotal, removeFromCart, updateQty, clearCart } = useApp();
  const navigate = useNavigate();

  const shippingFee = cartTotal >= 50 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const orderTotal = cartTotal + shippingFee + tax;

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-8">Add some products to get started</p>
        <Link to="/products" className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart ({cart.reduce((s, i) => s + i.qty, 0)} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {/* Select all header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-700">All Items</span>
              <button onClick={clearCart} className="text-xs text-red-500 hover:underline">Clear Cart</button>
            </div>

            {cart.map((item, idx) => (
              <div key={`${item.id}-${item.variant}`} className={`flex items-center gap-4 px-4 py-4 ${idx < cart.length - 1 ? "border-b border-gray-50" : ""}`}>
                {/* Image */}
                <Link to={`/product/${item.id}`} className="shrink-0">
                  <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-xl bg-gray-50" />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.id}`} className="font-semibold text-gray-800 hover:text-blue-600 text-sm line-clamp-2 leading-tight">
                    {item.title}
                  </Link>
                  {item.variant && (
                    <p className="text-xs text-gray-400 mt-0.5">Variant: {item.variant}</p>
                  )}
                  <p className="text-blue-600 font-bold mt-1">${item.price.toFixed(2)}</p>
                  {item.freeShipping && (
                    <span className="text-[10px] text-green-600 font-semibold">FREE SHIPPING</span>
                  )}
                </div>

                {/* Qty */}
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden shrink-0">
                  <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-3 py-2 hover:bg-gray-50 text-gray-600 font-bold">−</button>
                  <span className="px-3 py-2 font-semibold text-gray-800 text-sm border-x border-gray-200">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-3 py-2 hover:bg-gray-50 text-gray-600 font-bold">+</button>
                </div>

                {/* Total + remove */}
                <div className="text-right shrink-0">
                  <p className="font-bold text-gray-900">${(item.price * item.qty).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.id, item.variant)} className="text-xs text-red-400 hover:text-red-600 mt-1 transition-colors">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Free shipping progress */}
          {cartTotal < 50 && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-sm text-blue-700 font-medium mb-2">
                🚚 Add <strong>${(50 - cartTotal).toFixed(2)}</strong> more to get FREE shipping!
              </p>
              <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${Math.min(100, (cartTotal / 50) * 100)}%` }} />
              </div>
            </div>
          )}
          {cartTotal >= 50 && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-sm text-green-700 font-medium">
              ✅ You've unlocked FREE shipping!
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-24">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
                <span className="font-semibold text-gray-800">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shippingFee === 0 ? "text-green-600 font-semibold" : "font-semibold text-gray-800"}>
                  {shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (8%)</span>
                <span className="font-semibold text-gray-800">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo code */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Promo / coupon code"
                className="flex-1 px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2.5 bg-gray-800 hover:bg-gray-900 text-white text-sm font-bold rounded-xl transition">
                Apply
              </button>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-md text-base"
            >
              Proceed to Checkout →
            </button>

            <Link to="/products" className="block text-center text-sm text-gray-400 hover:text-blue-600 transition mt-3">
              ← Continue Shopping
            </Link>

            {/* Payment methods */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center mb-2">We accept</p>
              <div className="flex items-center justify-center gap-2">
                {["Visa", "M-Pesa", "PayPal", "Stripe"].map((p) => (
                  <span key={p} className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
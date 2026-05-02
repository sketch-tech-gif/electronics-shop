// FILE: src/pages/OrdersPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

const RATE = 130;
const kes = (usd) => `KES ${(usd * RATE).toLocaleString("en-KE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const statusColors = {
  "Processing": "bg-yellow-100 text-yellow-700",
  "Confirmed":  "bg-blue-100 text-blue-700",
  "Shipped":    "bg-purple-100 text-purple-700",
  "Delivered":  "bg-green-100 text-green-700",
  "Cancelled":  "bg-red-100 text-red-700",
};

const statusSteps = ["Processing", "Confirmed", "Shipped", "Delivered"];

// Generate realistic tracking timeline based on order status
function getTrackingEvents(order) {
  const base = new Date(order.date);
  const all = [
    {
      status: "Order Placed",
      detail: "Your order has been received and is being reviewed.",
      location: "Vantix Kenya — Online",
      icon: "🛒",
      color: "#3b82f6",
      time: new Date(base),
    },
    {
      status: "Order Confirmed",
      detail: "Payment verified. Your order has been confirmed and sent to the warehouse.",
      location: "Vantix Warehouse, Westlands, Nairobi",
      icon: "✅",
      color: "#3b82f6",
      time: new Date(base.getTime() + 1 * 60 * 60 * 1000),
    },
    {
      status: "Packed & Ready",
      detail: "Items have been picked, packed, and labelled for dispatch.",
      location: "Vantix Warehouse, Westlands, Nairobi",
      icon: "📦",
      color: "#8b5cf6",
      time: new Date(base.getTime() + 5 * 60 * 60 * 1000),
    },
    {
      status: "Dispatched",
      detail: "Your package has left our warehouse and is on its way.",
      location: "Vantix Dispatch Hub, Industrial Area, Nairobi",
      icon: "🚚",
      color: "#8b5cf6",
      time: new Date(base.getTime() + 24 * 60 * 60 * 1000),
    },
    {
      status: "In Transit",
      detail: "Package is in transit with our courier partner G4S Kenya.",
      location: "G4S Sorting Facility, Embakasi, Nairobi",
      icon: "🔄",
      color: "#f59e0b",
      time: new Date(base.getTime() + 30 * 60 * 60 * 1000),
    },
    {
      status: "Out for Delivery",
      detail: "Your package is out for delivery. Our rider will call you shortly.",
      location: "Local Delivery Hub — Your Area",
      icon: "🛵",
      color: "#f59e0b",
      time: new Date(base.getTime() + 46 * 60 * 60 * 1000),
    },
    {
      status: "Delivered",
      detail: "Package delivered successfully. Thank you for shopping with Vantix!",
      location: "Your Delivery Address",
      icon: "🎉",
      color: "#22c55e",
      time: new Date(order.estimatedDelivery),
    },
  ];

  const stepMap = { Processing: 2, Confirmed: 3, Shipped: 5, Delivered: 7 };
  const count = stepMap[order.status] || 2;
  return all.slice(0, count);
}

// ── Track Order Modal ──────────────────────────────────────────────────────────
function TrackOrderModal({ order, onClose }) {
  const events = getTrackingEvents(order);
  const latest = events[events.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Track Order</h2>
            <p className="text-xs text-gray-400 mt-0.5">{order.id}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Status banner */}
          <div className="rounded-xl p-4 flex items-center gap-4" style={{ background: "linear-gradient(135deg, #1d4ed8, #4f46e5)" }}>
            <div className="text-3xl">{latest.icon}</div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm">{latest.status}</p>
              <p className="text-blue-100 text-xs mt-0.5">{latest.detail}</p>
            </div>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
              {order.status}
            </span>
          </div>

          {/* Courier info */}
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-lg shrink-0">🚚</div>
            <div className="flex-1">
              <p className="text-xs text-gray-400">Courier Partner</p>
              <p className="font-bold text-gray-800 text-sm">G4S Kenya Logistics</p>
              <p className="text-xs text-gray-500">Tracking ref: {order.id.replace("ORD-", "G4S-")}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Est. Delivery</p>
              <p className="font-bold text-blue-600 text-sm">
                {new Date(order.estimatedDelivery).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Delivery Timeline</p>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100" />

              <div className="space-y-0">
                {[...events].reverse().map((event, i) => {
                  const isLatest = i === 0;
                  return (
                    <div key={i} className="relative flex gap-4 pb-5 last:pb-0">
                      {/* Dot */}
                      <div className="relative z-10 shrink-0 flex flex-col items-center">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-white shadow-sm"
                          style={{ background: isLatest ? event.color : "#e5e7eb", fontSize: 14 }}
                        >
                          {isLatest ? event.icon : "✓"}
                        </div>
                      </div>

                      {/* Content */}
                      <div className={`flex-1 pb-1 ${isLatest ? "" : "opacity-70"}`}>
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-bold ${isLatest ? "text-gray-900" : "text-gray-600"}`}>
                            {event.status}
                          </p>
                          <p className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">
                            {event.time.toLocaleDateString("en-KE", { day: "numeric", month: "short" })}
                            {" "}
                            {event.time.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{event.detail}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <p className="text-[10px] text-gray-400">{event.location}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Delivery address */}
          {order.shipping && (
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs font-bold text-blue-700 mb-2 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Delivery Address
              </p>
              <p className="text-sm text-blue-900 font-semibold">{order.shipping.firstName} {order.shipping.lastName}</p>
              <p className="text-xs text-blue-700">{order.shipping.address}, {order.shipping.city}</p>
              <p className="text-xs text-blue-700">{order.shipping.phone}</p>
            </div>
          )}

          {/* Help */}
          <div className="text-center pb-1">
            <p className="text-xs text-gray-400">
              Need help?{" "}
              <Link to="/contact" onClick={onClose} className="text-blue-600 font-semibold hover:underline">
                Contact Support
              </Link>
              {" "}or call{" "}
              <a href="tel:+254700000000" className="text-blue-600 font-semibold hover:underline">+254 700 000 000</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main OrdersPage ────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const { orders, user, addToCart } = useApp();
  const [trackingOrder, setTrackingOrder] = useState(null);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Sign in to view your orders</h2>
        <Link to="/auth" className="inline-block mt-4 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Track Order Modal */}
      {trackingOrder && <TrackOrderModal order={trackingOrder} onClose={() => setTrackingOrder(null)} />}

      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="font-bold text-gray-800 text-xl mb-2">No orders yet</h2>
          <p className="text-gray-400 mb-6">Your orders will appear here after you make a purchase</p>
          <Link to="/products" className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">

              {/* Order header */}
              <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-gray-50 bg-gray-50">
                <div className="flex items-center gap-6 flex-wrap text-sm">
                  <div>
                    <p className="text-gray-400 text-xs">Order ID</p>
                    <p className="font-bold text-gray-800">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Date</p>
                    <p className="font-semibold text-gray-700">{new Date(order.date).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Total</p>
                    <p className="font-bold text-gray-900">{kes(order.total)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Est. Delivery</p>
                    <p className="font-semibold text-gray-700">{new Date(order.estimatedDelivery).toLocaleDateString("en-KE", { day: "numeric", month: "short" })}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                  {order.status}
                </span>
              </div>

              {/* Progress bar */}
              <div className="px-5 py-4 border-b border-gray-50">
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
                  <div
                    className="absolute top-3.5 left-0 h-0.5 bg-blue-600 z-0 transition-all"
                    style={{ width: `${(statusSteps.indexOf(order.status) / (statusSteps.length - 1)) * 100}%` }}
                  />
                  {statusSteps.map((s, i) => {
                    const currentIdx = statusSteps.indexOf(order.status);
                    const done = i <= currentIdx;
                    return (
                      <div key={s} className="flex flex-col items-center gap-1 z-10">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          done ? "bg-blue-600 text-white" : "bg-white border-2 border-gray-200 text-gray-400"
                        }`}>
                          {done ? "✓" : i + 1}
                        </div>
                        <span className={`text-xs font-medium ${done ? "text-blue-600" : "text-gray-400"} hidden sm:block`}>{s}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items */}
              <div className="px-5 py-4">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded-xl bg-gray-50 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.id}`} className="text-sm font-semibold text-gray-800 hover:text-blue-600 line-clamp-1">{item.title}</Link>
                        {item.variant && <p className="text-xs text-gray-400">{item.variant}</p>}
                        <p className="text-xs text-gray-500">Qty: {item.qty} × {kes(item.price)}</p>
                      </div>
                      <p className="font-bold text-gray-800 text-sm shrink-0">{kes(item.price * item.qty)}</p>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={() => setTrackingOrder(order)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Track Order
                  </button>
                  <Link
                    to="/help"
                    className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold rounded-xl transition"
                  >
                    Return / Refund
                  </Link>
                  <button
                    onClick={() => order.items.forEach(item => addToCart(item))}
                    className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition ml-auto"
                  >
                    Buy Again
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
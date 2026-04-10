// FILE: src/pages/OrdersPage.jsx
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

const API = 'https://electronics-shop-api-id3m.onrender.com';

const statusColors = {
  "Processing": "bg-yellow-100 text-yellow-700",
  "Confirmed": "bg-blue-100 text-blue-700",
  "Shipped": "bg-purple-100 text-purple-700",
  "Delivered": "bg-green-100 text-green-700",
  "Cancelled": "bg-red-100 text-red-700",
};

const statusSteps = ["Processing", "Confirmed", "Shipped", "Delivered"];

export default function OrdersPage() {
  const { orders, user } = useApp();

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
                    <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
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

              {/* Order tracking */}
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
                        <p className="text-xs text-gray-500">Qty: {item.qty} × ${item.price.toFixed(2)}</p>
                      </div>
                      <p className="font-bold text-gray-800 text-sm shrink-0">${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-4">
                  <button className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold rounded-xl transition">
                    Track Order
                  </button>
                  <button className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold rounded-xl transition">
                    Return / Refund
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition ml-auto">
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
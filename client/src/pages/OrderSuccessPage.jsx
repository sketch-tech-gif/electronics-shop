// FILE: src/pages/OrderSuccessPage.jsx
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://electronics-shop-api-id3m.onrender.com';


export default function OrderSuccessPage() {
  const { orders } = useApp();
  const latestOrder = orders[0];

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-10 h-10 text-green-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h1>
      <p className="text-gray-500 mb-2">Thank you for shopping with TechStore.</p>
      {latestOrder && (
        <p className="text-blue-600 font-bold mb-6">Order ID: {latestOrder.id}</p>
      )}
      <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-2 mb-8 border border-gray-100">
        <p className="text-sm text-gray-600">✅ Order confirmation sent to your email</p>
        <p className="text-sm text-gray-600">📦 Estimated delivery: 3–5 business days</p>
        <p className="text-sm text-gray-600">🔄 Track your order in <Link to="/orders" className="text-blue-600 font-semibold hover:underline">My Orders</Link></p>
        <p className="text-sm text-gray-600">💬 Questions? <Link to="/help" className="text-blue-600 font-semibold hover:underline">Contact Support</Link></p>
      </div>
      <div className="flex gap-3 justify-center">
        <Link to="/orders" className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition">
          View Orders
        </Link>
        <Link to="/products" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
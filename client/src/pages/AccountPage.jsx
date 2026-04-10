// FILE: src/pages/AccountPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";


const API = 'https://electronics-shop-api-id3m.onrender.com';


export default function AccountPage() {
  const { user, updateProfile, logout, orders, wishlist } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">👤</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Sign in to access your account</h2>
        <Link to="/auth" className="inline-block mt-4 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Sign In</Link>
      </div>
    );
  }

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    return e;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    updateProfile(form);
    setEditing(false);
    setSaving(false);
    setErrors({});
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "orders", label: `Orders (${orders.length})`, icon: "📦" },
    { id: "wishlist", label: `Wishlist (${wishlist.length})`, icon: "❤️" },
    { id: "security", label: "Security", icon: "🔒" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* User card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-500 p-5 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-2">
                {user.name[0].toUpperCase()}
              </div>
              <p className="font-bold">{user.name}</p>
              <p className="text-blue-100 text-xs mt-0.5">{user.email}</p>
            </div>

            <nav className="p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 mt-1 transition"
              >
                <span>🚪</span>
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">

            {/* Profile */}
            {activeTab === "profile" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-gray-900 text-lg">Personal Information</h2>
                  {!editing && (
                    <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-semibold">
                      ✏️ Edit
                    </button>
                  )}
                </div>

                {!editing ? (
                  <div className="space-y-4">
                    {[
                      { label: "Full Name", value: user.name },
                      { label: "Email Address", value: user.email },
                      { label: "Phone Number", value: user.phone || "Not set" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center py-3 border-b border-gray-50">
                        <p className="text-sm text-gray-500 w-40 shrink-0">{label}</p>
                        <p className="text-sm font-semibold text-gray-800">{value}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[
                      { label: "Full Name", field: "name", placeholder: "Your full name", required: true },
                      { label: "Email Address", field: "email", placeholder: "you@example.com", required: true },
                      { label: "Phone Number", field: "phone", placeholder: "+254 700 000 000" },
                    ].map(({ label, field, placeholder, required }) => (
                      <div key={field}>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          {label} {required && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type="text"
                          value={form[field]}
                          onChange={(e) => { setForm(f => ({ ...f, [field]: e.target.value })); if (errors[field]) setErrors(er => ({ ...er, [field]: "" })); }}
                          placeholder={placeholder}
                          className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[field] ? "border-red-400" : "border-gray-200"}`}
                        />
                        {errors[field] && <p className="text-xs text-red-500 mt-1">⚠ {errors[field]}</p>}
                      </div>
                    ))}
                    <div className="flex gap-3 pt-2">
                      <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl transition">
                        {saving && <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                      <button onClick={() => { setEditing(false); setErrors({}); setForm({ name: user.name, email: user.email, phone: user.phone || "" }); }} className="px-6 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold rounded-xl transition">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders tab */}
            {activeTab === "orders" && (
              <div>
                <h2 className="font-bold text-gray-900 text-lg mb-5">My Orders</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-4xl mb-3">📦</div>
                    <p className="text-gray-500 mb-4">No orders yet</p>
                    <Link to="/products" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700">Shop Now</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{order.id}</p>
                          <p className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString()} • {order.items.length} items</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">{order.status}</span>
                        </div>
                      </div>
                    ))}
                    {orders.length > 5 && (
                      <Link to="/orders" className="block text-center text-sm text-blue-600 hover:underline mt-2">
                        View all {orders.length} orders →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist tab */}
            {activeTab === "wishlist" && (
              <div>
                <h2 className="font-bold text-gray-900 text-lg mb-5">My Wishlist</h2>
                {wishlist.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-4xl mb-3">❤️</div>
                    <p className="text-gray-500 mb-4">Your wishlist is empty</p>
                    <Link to="/products" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700">Browse Products</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {wishlist.slice(0, 6).map((item) => (
                      <Link key={item.id} to={`/product/${item.id}`} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                        <img src={item.image} alt={item.title} className="w-full h-24 object-cover" />
                        <div className="p-2">
                          <p className="text-xs font-medium text-gray-700 line-clamp-1">{item.title}</p>
                          <p className="text-xs font-bold text-blue-600 mt-0.5">${item.price.toFixed(2)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Security tab */}
            {activeTab === "security" && (
              <div>
                <h2 className="font-bold text-gray-900 text-lg mb-5">Security Settings</h2>
                <div className="space-y-4">
                  <div className="border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">Password</p>
                      <p className="text-sm text-gray-400">Last changed: Never</p>
                    </div>
                    <button className="text-sm text-blue-600 font-semibold hover:underline">Change</button>
                  </div>
                  <div className="border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-400">Add extra security to your account</p>
                    </div>
                    <button className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 font-semibold">Enable</button>
                  </div>
                  <div className="border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">Login Sessions</p>
                      <p className="text-sm text-gray-400">1 active session</p>
                    </div>
                    <button className="text-sm text-red-500 font-semibold hover:underline">Sign Out All</button>
                  </div>
                  <div className="border border-red-100 rounded-xl p-4">
                    <p className="font-semibold text-red-600 mb-1">Delete Account</p>
                    <p className="text-sm text-gray-400 mb-3">Permanently delete your account and all data</p>
                    <button className="text-sm bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-100 font-semibold transition">
                      Delete My Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
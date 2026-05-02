// FILE: src/pages/CheckoutPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const KES_RATE = 130;
const fmt    = (usd) => fmtKes(usd * KES_RATE);
const fmtKes = (kes) =>
  `KES ${Number(kes).toLocaleString("en-KE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const STEPS = ["Shipping", "Payment", "Confirm"];

// ── Reusable input ─────────────────────────────────────────────────────────────
const Field = ({ label, value, onChange, error, placeholder, type = "text", required }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-1">
      {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
    </label>
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      className={`w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 transition
        ${error ? "border-rose-300 bg-rose-50 focus:ring-rose-300" : "border-gray-200 bg-gray-50 focus:ring-indigo-300"}`}
    />
    {error && <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">⚠ {error}</p>}
  </div>
);

// ── STK Push PIN modal ─────────────────────────────────────────────────────────
function StkModal({ phone, amount, carrier, onSuccess, onCancel }) {
  const [pin,   setPin]   = useState("");
  const [stage, setStage] = useState("prompt"); // prompt | processing | done

  const isMpesa  = carrier === "mpesa";
  const themeColor = isMpesa ? "#00a651" : "#e4002b";
  const carrierName = isMpesa ? "Safaricom M-Pesa" : "Airtel Money";

  const confirm = () => {
    if (pin.length < 4) return;
    setStage("processing");
    setTimeout(() => { setStage("done"); setTimeout(onSuccess, 1400); }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[320px] overflow-hidden">

        {/* Header bar */}
        <div style={{ background: themeColor }} className="px-6 py-5 text-center">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
              <path d="M17 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2zm-5 17a1 1 0 110-2 1 1 0 010 2zm3-4H9V5h6v10z"/>
            </svg>
          </div>
          <p className="text-white font-black text-base tracking-tight">{carrierName}</p>
          <p className="text-white/70 text-xs mt-0.5">Secure Payment Request</p>
        </div>

        <div className="px-6 py-6">
          {stage === "prompt" && (
            <>
              {/* Amount */}
              <div className="text-center mb-5 bg-gray-50 rounded-2xl py-4">
                <p className="text-xs text-gray-400 mb-1">Amount to pay</p>
                <p className="text-2xl font-black text-gray-900">{fmtKes(amount)}</p>
                <p className="text-xs text-gray-400 mt-1">Merchant: <strong className="text-gray-600">Vantix Kenya</strong></p>
                <p className="text-xs text-gray-400">{phone}</p>
              </div>

              {/* PIN dots */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-600 mb-2 text-center">Enter your PIN</label>
                <div className="flex justify-center gap-3 mb-3">
                  {[0,1,2,3,4,5].map(i => (
                    <div key={i} className={`w-3 h-3 rounded-full border-2 transition-all ${
                      i < pin.length
                        ? "border-transparent"
                        : "border-gray-300"
                    }`} style={i < pin.length ? { background: themeColor } : {}} />
                  ))}
                </div>
                <input
                  type="password" inputMode="numeric" maxLength={6}
                  value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter PIN"
                  className="w-full px-4 py-3 text-center text-2xl tracking-[0.6em] bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 font-bold"
                  autoFocus
                />
              </div>

              <button
                onClick={confirm}
                disabled={pin.length < 4}
                style={{ background: pin.length >= 4 ? themeColor : "#e5e7eb", color: pin.length >= 4 ? "#fff" : "#9ca3af" }}
                className="w-full font-bold py-3 rounded-xl text-sm transition mb-2"
              >
                Confirm & Pay {fmtKes(amount)}
              </button>
              <button onClick={onCancel} className="w-full text-gray-400 text-xs py-1.5 hover:text-gray-600 transition">
                Cancel
              </button>
            </>
          )}

          {stage === "processing" && (
            <div className="text-center py-8">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full border-4 border-gray-100 animate-spin" style={{ borderTopColor: themeColor }} />
              <p className="font-bold text-gray-800">Processing payment…</p>
              <p className="text-xs text-gray-400 mt-1">Please do not close this window</p>
            </div>
          )}

          {stage === "done" && (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: themeColor + "20" }}>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.5} className="w-7 h-7" style={{ stroke: themeColor }}>
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p className="font-black text-gray-900">Payment Successful!</p>
              <p className="text-xs text-gray-400 mt-1">{fmtKes(amount)} confirmed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main checkout ──────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { cart, cartTotal, user, placeOrder, toast } = useApp();
  const navigate = useNavigate();

  const [step,       setStep]       = useState(0);
  const [processing, setProcessing] = useState(false);
  const [payMethod,  setPayMethod]  = useState("mpesa");
  const [errors,     setErrors]     = useState({});
  const [stkOpen,    setStkOpen]    = useState(false);

  const cartTotalKes = cartTotal * KES_RATE;
  const orderTotal   = cartTotalKes; // no tax

  const [shipping, setShipping] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName:  user?.name?.split(" ")[1] || "",
    email:     user?.email  || "",
    phone:     user?.phone  || "",
    address:   "", city: "", state: "", country: "Kenya", zip: "",
  });
  const [card,   setCard]   = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [mpesa,  setMpesa]  = useState({ phone: user?.phone || "" });
  const [airtel, setAirtel] = useState({ phone: user?.phone || "" });
  const [paypal, setPaypal] = useState({ email: user?.email || "" });

  const upd = (f) => (e) => { setShipping(s => ({ ...s, [f]: e.target.value })); setErrors(er => ({ ...er, [f]: "" })); };

  const vShip = () => {
    const e = {};
    if (!shipping.firstName.trim()) e.firstName = "Required";
    if (!shipping.lastName.trim())  e.lastName  = "Required";
    if (!shipping.email || !/\S+@\S+\.\S+/.test(shipping.email)) e.email = "Valid email required";
    if (!shipping.phone)            e.phone   = "Required";
    if (!shipping.address.trim())   e.address = "Required";
    if (!shipping.city.trim())      e.city    = "Required";
    return e;
  };

  const vPay = () => {
    const e = {};
    if (payMethod === "card") {
      if (!card.number || card.number.replace(/\s/g,"").length < 16) e.cardNumber = "16-digit card number required";
      if (!card.name.trim())                                          e.cardName   = "Required";
      if (!/^\d{2}\/\d{2}$/.test(card.expiry))                       e.cardExpiry = "MM/YY format";
      if (card.cvv.length < 3)                                        e.cardCvv    = "3–4 digits";
    }
    if (payMethod === "mpesa"  && !mpesa.phone)  e.mpesaPhone  = "Phone number required";
    if (payMethod === "airtel" && !airtel.phone) e.airtelPhone = "Phone number required";
    if (payMethod === "paypal" && !paypal.email) e.paypalEmail = "PayPal email required";
    return e;
  };

  const next = () => {
    const errs = step === 0 ? vShip() : step === 1 ? vPay() : {};
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setStep(s => s + 1);
  };

  const placeNow = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1200));
    placeOrder(orderTotal, shipping, { method: payMethod, ...card });
    toast("🎉 Order placed successfully!");
    navigate("/order-success");
    setProcessing(false);
  };

  const handlePlace = () => {
    if (payMethod === "mpesa" || payMethod === "airtel") { setStkOpen(true); return; }
    placeNow();
  };

  const fmtCard   = (v) => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExpiry = (v) => { const c = v.replace(/\D/g,"").slice(0,4); return c.length > 2 ? `${c.slice(0,2)}/${c.slice(2)}` : c; };

  const PAY_OPTS = [
    { id: "mpesa",  label: "M-Pesa",       color: "#00a651", icon: "📱" },
    { id: "airtel", label: "Airtel Money",  color: "#e4002b", icon: "📲" },
    { id: "card",   label: "Visa Card",     color: "#1a1f71", icon: "💳" },
    { id: "paypal", label: "PayPal",        color: "#0070ba", icon: "🅿️" },
  ];

  if (cart.length === 0) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Your cart is empty</h2>
      <Link to="/products" className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700">Shop Now</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* STK modal */}
      {stkOpen && (
        <StkModal
          phone={payMethod === "mpesa" ? mpesa.phone : airtel.phone}
          amount={orderTotal}
          carrier={payMethod}
          onSuccess={() => { setStkOpen(false); placeNow(); }}
          onCancel={() => setStkOpen(false)}
        />
      )}

      {/* Back */}
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-600 mb-6 transition">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
        Back to Cart
      </Link>

      {/* Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                i < step  ? "bg-indigo-600 border-indigo-600 text-white" :
                i === step ? "border-indigo-500 text-indigo-600 bg-white" :
                             "border-gray-200 text-gray-400"
              }`}>
                {i < step
                  ? <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"/></svg>
                  : i + 1}
              </div>
              <span className={`text-xs font-semibold hidden sm:block ${
                i === step ? "text-indigo-600" : i < step ? "text-indigo-400" : "text-gray-400"
              }`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`w-10 sm:w-14 h-0.5 rounded ${i < step ? "bg-indigo-400" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Main ── */}
        <div className="lg:col-span-2">

          {/* STEP 0 — Shipping */}
          {step === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="First Name" value={shipping.firstName} onChange={upd("firstName")} error={errors.firstName} placeholder="John" required />
                <Field label="Last Name"  value={shipping.lastName}  onChange={upd("lastName")}  error={errors.lastName}  placeholder="Doe"  required />
                <div className="sm:col-span-2"><Field label="Email" type="email" value={shipping.email} onChange={upd("email")} error={errors.email} placeholder="you@example.com" required /></div>
                <div className="sm:col-span-2"><Field label="Phone" type="tel"   value={shipping.phone} onChange={upd("phone")} error={errors.phone} placeholder="+254 700 000 000" required /></div>
                <div className="sm:col-span-2"><Field label="Street Address" value={shipping.address} onChange={upd("address")} error={errors.address} placeholder="123 Kenyatta Avenue" required /></div>
                <Field label="City" value={shipping.city} onChange={upd("city")} error={errors.city} placeholder="Nairobi" required />
                <Field label="State / County" value={shipping.state} onChange={upd("state")} placeholder="Nairobi County" />
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Country <span className="text-rose-400">*</span></label>
                  <select value={shipping.country} onChange={upd("country")} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                    {["Kenya","Uganda","Tanzania","Ethiopia","South Africa","Nigeria","United States","United Kingdom","Other"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <Field label="Postal Code" value={shipping.zip} onChange={upd("zip")} placeholder="00100" />
              </div>
              <button onClick={next} className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm transition">
                Continue to Payment →
              </button>
            </div>
          )}

          {/* STEP 1 — Payment */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
                Payment Method
              </h2>

              {/* Method selector */}
              <div className="grid grid-cols-4 gap-2 mb-5">
                {PAY_OPTS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setPayMethod(m.id); setErrors({}); }}
                    style={payMethod === m.id ? { borderColor: m.color, background: `${m.color}12` } : {}}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-[11px] font-bold transition-all
                      ${payMethod === m.id ? "shadow-sm" : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
                  >
                    <span className="text-xl">{m.icon}</span>
                    <span style={payMethod === m.id ? { color: m.color } : {}}>{m.label}</span>
                  </button>
                ))}
              </div>

              {/* M-Pesa */}
              {payMethod === "mpesa" && (
                <div className="space-y-3">
                  <div className="flex gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#00a651" }}>
                      <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5"><path d="M17 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2zm-5 17a1 1 0 110-2 1 1 0 010 2zm3-4H9V5h6v10z"/></svg>
                    </div>
                    <div>
                      <p className="font-bold text-emerald-800 text-sm">M-Pesa STK Push</p>
                      <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">You'll receive a payment prompt on your Safaricom phone. Simply enter your M-Pesa PIN to complete the payment instantly.</p>
                    </div>
                  </div>
                  <Field label="Safaricom M-Pesa Number" type="tel" value={mpesa.phone} onChange={e => setMpesa({ phone: e.target.value })} error={errors.mpesaPhone} placeholder="0712 345 678" required />
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <span className="text-xs text-gray-500">Total charge</span>
                    <span className="font-black text-gray-900 text-sm">{fmtKes(orderTotal)}</span>
                  </div>
                </div>
              )}

              {/* Airtel Money */}
              {payMethod === "airtel" && (
                <div className="space-y-3">
                  <div className="flex gap-3 bg-rose-50 border border-rose-200 rounded-2xl p-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#e4002b" }}>
                      <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5"><path d="M17 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2zm-5 17a1 1 0 110-2 1 1 0 010 2zm3-4H9V5h6v10z"/></svg>
                    </div>
                    <div>
                      <p className="font-bold text-rose-800 text-sm">Airtel Money Push</p>
                      <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">You'll receive a payment prompt on your Airtel phone. Enter your Airtel Money PIN to complete the payment instantly.</p>
                    </div>
                  </div>
                  <Field label="Airtel Phone Number" type="tel" value={airtel.phone} onChange={e => setAirtel({ phone: e.target.value })} error={errors.airtelPhone} placeholder="0100 123 456" required />
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <span className="text-xs text-gray-500">Total charge</span>
                    <span className="font-black text-gray-900 text-sm">{fmtKes(orderTotal)}</span>
                  </div>
                </div>
              )}

              {/* Visa Card */}
              {payMethod === "card" && (
                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-700 rounded-2xl p-5 text-white mb-2">
                    <div className="flex justify-between items-start mb-6">
                      <svg viewBox="0 0 48 16" className="h-5" fill="white"><text x="0" y="13" fontSize="14" fontWeight="900" fontFamily="serif">VISA</text></svg>
                      <div className="w-8 h-8 rounded-full bg-white/20" />
                    </div>
                    <p className="font-mono text-lg tracking-widest mb-5">{card.number || "•••• •••• •••• ••••"}</p>
                    <div className="flex justify-between items-end">
                      <div><p className="text-[9px] text-white/50 uppercase tracking-widest mb-1">Card Holder</p><p className="font-bold text-sm">{card.name || "YOUR NAME"}</p></div>
                      <div className="text-right"><p className="text-[9px] text-white/50 uppercase tracking-widest mb-1">Expires</p><p className="font-bold text-sm">{card.expiry || "MM/YY"}</p></div>
                    </div>
                  </div>
                  <Field label="Card Number"  value={card.number} onChange={e => setCard(c => ({ ...c, number: fmtCard(e.target.value) }))} error={errors.cardNumber} placeholder="1234 5678 9012 3456" required />
                  <Field label="Name on Card" value={card.name}   onChange={e => setCard(c => ({ ...c, name: e.target.value }))}           error={errors.cardName}   placeholder="John Doe" required />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Expiry" value={card.expiry} onChange={e => setCard(c => ({ ...c, expiry: fmtExpiry(e.target.value) }))} error={errors.cardExpiry} placeholder="MM/YY" required />
                    <Field label="CVV" type="password" value={card.cvv} onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g,"").slice(0,4) }))} error={errors.cardCvv} placeholder="•••" required />
                  </div>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
                    256-bit SSL encrypted · Powered by Stripe
                  </p>
                </div>
              )}

              {/* PayPal */}
              {payMethod === "paypal" && (
                <div className="space-y-3">
                  <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 text-center">
                    <div className="text-4xl mb-2">🅿️</div>
                    <p className="font-bold text-gray-800 text-sm mb-1">Pay with PayPal</p>
                    <p className="text-xs text-gray-500">Enter your PayPal email. You'll be redirected to complete payment securely.</p>
                  </div>
                  <Field label="PayPal Email" type="email" value={paypal.email} onChange={e => setPaypal({ email: e.target.value })} error={errors.paypalEmail} placeholder="you@paypal.com" required />
                </div>
              )}

              <div className="flex gap-2 mt-5">
                <button onClick={() => setStep(0)} className="px-4 py-2.5 border border-gray-200 text-gray-500 hover:bg-gray-50 font-semibold rounded-xl text-xs transition">← Back</button>
                <button onClick={next} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm transition">Review Order →</button>
              </div>
            </div>
          )}

          {/* STEP 2 — Review */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
                Review & Confirm
              </h2>

              {/* Items */}
              <div className="space-y-2.5 mb-5">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <img src={item.image} alt={item.title} className="w-11 h-11 object-cover rounded-xl bg-gray-50 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 line-clamp-1">{item.title}</p>
                      <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                    </div>
                    <p className="font-bold text-gray-900 text-sm shrink-0">{fmt(item.price * item.qty)}</p>
                  </div>
                ))}
              </div>

              {/* Info cards */}
              <div className="grid sm:grid-cols-2 gap-3 mb-5">
                <div className="bg-indigo-50/60 rounded-xl p-4 border border-indigo-100">
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">📦 Shipping To</p>
                  <p className="text-sm font-semibold text-gray-800">{shipping.firstName} {shipping.lastName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{shipping.address}</p>
                  <p className="text-xs text-gray-500">{shipping.city}, {shipping.country}</p>
                  <p className="text-xs text-gray-500">{shipping.phone}</p>
                </div>
                <div className="bg-indigo-50/60 rounded-xl p-4 border border-indigo-100">
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">💳 Payment</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {payMethod === "mpesa"  ? "Safaricom M-Pesa" :
                     payMethod === "airtel" ? "Airtel Money" :
                     payMethod === "card"   ? `Visa ••••${card.number.slice(-4)||"••••"}` :
                     "PayPal"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {payMethod === "mpesa"  ? mpesa.phone :
                     payMethod === "airtel" ? airtel.phone :
                     payMethod === "paypal" ? paypal.email : card.name}
                  </p>
                  {(payMethod === "mpesa" || payMethod === "airtel") && (
                    <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3"><polyline points="20 6 9 17 4 12"/></svg>
                      PIN prompt on your phone
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="px-4 py-2.5 border border-gray-200 text-gray-500 hover:bg-gray-50 font-semibold rounded-xl text-xs transition">← Back</button>
                <button
                  onClick={handlePlace}
                  disabled={processing}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-sm shadow-emerald-200"
                >
                  {processing
                    ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Processing…</>
                    : `Place Order · ${fmtKes(orderTotal)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Your Order</h3>

            <div className="space-y-2 max-h-44 overflow-y-auto mb-3">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-xs text-gray-500">
                  <span className="truncate flex-1 pr-2">{item.title} ×{item.qty}</span>
                  <span className="shrink-0 font-semibold text-gray-700">{fmt(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-100 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span className="font-semibold text-gray-700">{fmtKes(cartTotalKes)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Delivery</span><span className="italic text-gray-400">TBD</span></div>
              <div className="flex justify-between font-bold text-sm pt-1.5 border-t border-gray-100">
                <span className="text-gray-900">Total</span>
                <span className="text-indigo-600">{fmtKes(orderTotal)}</span>
              </div>
            </div>

            {/* Payment badges */}
            <div className="mt-4 pt-3 border-t border-gray-50">
              <p className="text-[10px] text-gray-400 text-center mb-2 uppercase tracking-widest">Accepted</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {[
                  { name: "Visa",         bg: "#1a1f71" },
                  { name: "M-Pesa",       bg: "#00a651" },
                  { name: "PayPal",       bg: "#0070ba" },
                  { name: "Airtel Money", bg: "#e4002b" },
                ].map(p => (
                  <span key={p.name} style={{ background: p.bg }} className="text-white text-[9px] font-bold px-2 py-1 rounded-lg">
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
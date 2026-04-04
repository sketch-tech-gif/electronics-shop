// FILE: src/pages/AuthPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
const API = 'https://electronics-shop-api-id3m.onrender.com'
// Mock user DB
const MOCK_USERS = [
  { id: 1, name: "Demo User", email: "demo@techstore.com", password: "Demo@123", phone: "+254 700 000 000" },
];

function PasswordStrength({ password }) {
  const checks = [
    { label: "At least 8 characters", pass: password.length >= 8 },
    { label: "Contains uppercase", pass: /[A-Z]/.test(password) },
    { label: "Contains number", pass: /[0-9]/.test(password) },
    { label: "Contains special character", pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  if (!password) return null;
  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full transition-colors ${i <= score ? colors[score] : "bg-gray-200"}`} />
        ))}
      </div>
      <p className={`text-xs font-medium ${score <= 1 ? "text-red-500" : score === 2 ? "text-orange-500" : score === 3 ? "text-yellow-600" : "text-green-600"}`}>
        {labels[score]}
      </p>
      <div className="grid grid-cols-2 gap-1">
        {checks.map((c) => (
          <div key={c.label} className={`text-xs flex items-center gap-1 ${c.pass ? "text-green-600" : "text-gray-400"}`}>
            <span>{c.pass ? "✓" : "○"}</span> {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AuthPage() {
  const { login, user } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get("mode") === "register" ? "register" : "login");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "", remember: false });
  const [registerForm, setRegisterForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "", agreeTerms: false,
  });

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const validateLogin = () => {
    const e = {};
    if (!loginForm.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(loginForm.email)) e.email = "Invalid email address";
    if (!loginForm.password) e.password = "Password is required";
    return e;
  };

  const validateRegister = () => {
    const e = {};
    if (!registerForm.firstName.trim()) e.firstName = "First name is required";
    if (!registerForm.lastName.trim()) e.lastName = "Last name is required";
    if (!registerForm.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(registerForm.email)) e.email = "Invalid email address";
    if (!registerForm.phone) e.phone = "Phone number is required";
    else if (!/^\+?[\d\s\-]{9,}$/.test(registerForm.phone)) e.phone = "Invalid phone number";
    if (!registerForm.password) e.password = "Password is required";
    else if (registerForm.password.length < 8) e.password = "Password must be at least 8 characters";
    if (!registerForm.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (registerForm.password !== registerForm.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!registerForm.agreeTerms) e.agreeTerms = "You must agree to the terms";
    return e;
  };

  const handleLogin = async e => {
  e.preventDefault()
  const errs = validateLogin()
  if (Object.keys(errs).length) { setErrors(errs); return }
  setLoading(true)
  try {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: lf.email, password: lf.password }),
    })
    const data = await res.json()
    if (!res.ok) { setErrors({ general: data.error }); setLoading(false); return }
    localStorage.setItem('token', data.token)
    login(data.user)
    navigate('/')
  } catch {
    setErrors({ general: 'Network error. Please try again.' })
  }
  setLoading(false)
}

  const handleRegister = async e => {
  e.preventDefault()
  const errs = validateReg()
  if (Object.keys(errs).length) { setErrors(errs); return }
  setLoading(true)
  try {
    const res = await fetch(`${API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${rf.firstName} ${rf.lastName}`,
        email: rf.email,
        phone: rf.phone,
        password: rf.password,
      }),
    })
    const data = await res.json()
    if (!res.ok) { setErrors({ general: data.error }); setLoading(false); return }
    localStorage.setItem('token', data.token)
    login(data.user)
    navigate('/')
  } catch {
    setErrors({ general: 'Network error. Please try again.' })
  }
  setLoading(false)
}

  const updateLogin = (field) => (e) => {
    setLoginForm(f => ({ ...f, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: "" }));
  };

  const updateRegister = (field) => (e) => {
    setRegisterForm(f => ({ ...f, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: "" }));
  };

  const InputField = ({ label, name, type = "text", value, onChange, error, placeholder, required, children }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
            error ? "border-red-400 bg-red-50" : "border-gray-200"
          }`}
        />
        {children}
      </div>
      {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><span>⚠</span>{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z"/>
                <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z"/>
                <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z"/>
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-900">Tech<span className="text-blue-600">Store</span></span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {[["login", "Sign In"], ["register", "Create Account"]].map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => { setMode(tab); setErrors({}); }}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                  mode === tab ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* General error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4 flex items-start gap-2">
              <span className="text-red-500 mt-0.5">⚠</span>
              <span>{errors.general}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <InputField label="Email Address" name="email" type="email" value={loginForm.email} onChange={updateLogin("email")} error={errors.email} placeholder="you@example.com" required />
              <InputField label="Password" name="password" type={showPassword ? "text" : "password"} value={loginForm.password} onChange={updateLogin("password")} error={errors.password} placeholder="••••••••" required>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </InputField>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={loginForm.remember} onChange={updateLogin("remember")} className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-sm text-blue-600 hover:underline font-medium">Forgot password?</button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition"
              >
                {loading && <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
                <strong>Demo credentials:</strong> demo@techstore.com / Demo@123
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <InputField label="First Name" name="firstName" value={registerForm.firstName} onChange={updateRegister("firstName")} error={errors.firstName} placeholder="John" required />
                <InputField label="Last Name" name="lastName" value={registerForm.lastName} onChange={updateRegister("lastName")} error={errors.lastName} placeholder="Doe" required />
              </div>

              <InputField label="Email Address" name="email" type="email" value={registerForm.email} onChange={updateRegister("email")} error={errors.email} placeholder="you@example.com" required />

              <InputField label="Phone Number" name="phone" type="tel" value={registerForm.phone} onChange={updateRegister("phone")} error={errors.phone} placeholder="+254 700 000 000" required />

              <div>
                <InputField label="Password" name="password" type={showPassword ? "text" : "password"} value={registerForm.password} onChange={updateRegister("password")} error={errors.password} placeholder="Create a strong password" required>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </InputField>
                <PasswordStrength password={registerForm.password} />
              </div>

              <InputField label="Confirm Password" name="confirmPassword" type={showConfirm ? "text" : "password"} value={registerForm.confirmPassword} onChange={updateRegister("confirmPassword")} error={errors.confirmPassword} placeholder="Repeat your password" required>
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </InputField>

              <div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={registerForm.agreeTerms}
                    onChange={updateRegister("agreeTerms")}
                    className="w-4 h-4 text-blue-600 rounded mt-0.5 shrink-0"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the <button type="button" className="text-blue-600 hover:underline font-medium">Terms of Service</button> and <button type="button" className="text-blue-600 hover:underline font-medium">Privacy Policy</button>
                  </span>
                </label>
                {errors.agreeTerms && <p className="text-xs text-red-500 mt-1">⚠ {errors.agreeTerms}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition"
              >
                {loading && <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}

          {/* Social login */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Google", icon: "G", color: "text-red-500" },
              { name: "Apple", icon: "🍎", color: "text-gray-800" },
            ].map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  login({ id: Date.now(), name: `${p.name} User`, email: `user@${p.name.toLowerCase()}.com`, phone: "" });
                  navigate("/");
                }}
                className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 py-3 rounded-xl text-sm font-semibold text-gray-700 transition"
              >
                <span className={`font-bold ${p.color}`}>{p.icon}</span>
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
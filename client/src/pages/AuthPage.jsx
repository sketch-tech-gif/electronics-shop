import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const API = 'https://electronics-shop-api-id3m.onrender.com'

/* ✅ FIXED: moved OUTSIDE AuthPage */
function InputField({ label, type = 'text', value, onChange, error, placeholder, required, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
          }`}
        />
        {children}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">&#9888; {error}</p>}
    </div>
  )
}

function PasswordStrength({ password }) {
  if (!password) return null
  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Contains uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Contains number', pass: /[0-9]/.test(password) },
    { label: 'Contains special char', pass: /[^A-Za-z0-9]/.test(password) },
  ]
  const score = checks.filter(c => c.pass).length
  const barColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500']
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const labelColors = ['', 'text-red-500', 'text-orange-500', 'text-yellow-600', 'text-green-600']

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`flex-1 h-1.5 rounded-full ${i < score ? barColors[score - 1] : 'bg-gray-200'}`} />
        ))}
      </div>
      {score > 0 && <p className={`text-xs font-semibold ${labelColors[score]}`}>{labels[score]}</p>}
    </div>
  )
}

function GoogleIcon() {
  return <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/></svg>
}

function AppleIcon() {
  return <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39z"/></svg>
}

export default function AuthPage() {
  const { login, user } = useApp()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [mode, setMode] = useState(
    searchParams.get('mode') === 'register' ? 'register' : 'login'
  )

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    remember: false,
  })

  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })

  useEffect(() => {
    if (user) navigate('/')
  }, [user, navigate])

  const updateLogin = field => e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setLoginForm(f => ({ ...f, [field]: val }))
  }

  const updateRegister = field => e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setRegisterForm(f => ({ ...f, [field]: val }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      
      {/* SIMPLE TEST FORM */}
      <div className="w-full max-w-md space-y-4">
        <InputField
          label="Email"
          value={loginForm.email}
          onChange={updateLogin('email')}
        />

        <InputField
          label="Password"
          type="password"
          value={loginForm.password}
          onChange={updateLogin('password')}
        />
      </div>

    </div>
  )
}
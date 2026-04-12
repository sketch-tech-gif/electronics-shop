import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useGoogleLogin } from '@react-oauth/google' // stays here

const API = "https://electronics-shop-api-id3m.onrender.com";

function PasswordStrength({ password }) {
  if (!password) return null
  const checks = [
    { label: 'At least 6 characters', pass: password.length >= 6 },
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
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              i < score ? barColors[score - 1] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      {score > 0 && <p className={`text-xs font-semibold ${labelColors[score]}`}>{labels[score]}</p>}
      <div className="grid grid-cols-2 gap-1">
        {checks.map(c => (
          <div
            key={c.label}
            className={`text-xs flex items-center gap-1 ${
              c.pass ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            <span>{c.pass ? '✓' : '○'}</span> {c.label}
          </div>
        ))}
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export default function AuthPage() {
  const { login, user } = useApp()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState(searchParams.get('mode') === 'register' ? 'register' : 'login')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: '', password: '', remember: false })
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })

  // ✅ FIX: moved hook inside component
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        }).then(r => r.json())

        const res = await fetch(`${API}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credential: tokenResponse.access_token,
            email: userInfo.email,
            name: userInfo.name
          }),
        })

        const data = await res.json()
        if (!res.ok) { setErrors({ general: data.error }); return }
        localStorage.setItem('token', data.token)
        login(data.user)
        navigate('/')
      } catch {
        setErrors({ general: 'Google login failed. Try again.' })
      }
    },
    onError: () => setErrors({ general: 'Google login failed. Try again.' })
  })

  useEffect(() => {
    if (user) navigate('/')
  }, [user, navigate])

  const updateLogin = field => e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setLoginForm(f => ({ ...f, [field]: val }))
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }))
    if (errors.general) setErrors(er => ({ ...er, general: '' }))
  }

  const updateRegister = field => e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setRegisterForm(f => ({ ...f, [field]: val }))
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }))
    if (errors.general) setErrors(er => ({ ...er, general: '' }))
  }

  // ... REST OF YOUR CODE UNCHANGED
// FILE: src/pages/HelpPage.jsx
// Changes:
//  • Search bar now actually filters FAQs and quick-link cards in real time
//  • Mobile sizing tightened (smaller hero padding, smaller text, compact cards)
//  • "No results" state when search returns nothing

import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

const ALL_FAQS = [
  { q: 'How do I track my order?',           a: "Go to My Orders in your account dashboard. You'll find real-time tracking information for all your orders." },
  { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, M-Pesa, PayPal, and Stripe. All transactions are secured with SSL encryption.' },
  { q: 'How long does delivery take?',        a: 'Standard delivery within Nairobi takes 1–2 business days. Upcountry deliveries take 2–5 business days.' },
  { q: 'Can I return a product?',             a: 'Yes! We offer a 30-day return policy on all products. Items must be in original condition with packaging.' },
  { q: 'Are all products genuine?',           a: 'Absolutely. All products are sourced from authorized distributors and come with manufacturer warranties.' },
  { q: 'How do I cancel an order?',           a: 'Orders can be cancelled within 1 hour of placing them. Go to My Orders and click "Cancel Order".' },
]

const ALL_QUICK_LINKS = [
  { icon: '📦', title: 'Track Order',  desc: 'Check delivery status',    to: '/orders',  keywords: ['track', 'order', 'delivery', 'status', 'shipping'] },
  { icon: '↩️', title: 'Returns',      desc: 'Return or exchange',       to: '/account', keywords: ['return', 'exchange', 'refund', 'send back'] },
  { icon: '💳', title: 'Payments',     desc: 'Payment methods & issues', to: '/contact', keywords: ['payment', 'pay', 'mpesa', 'card', 'visa', 'billing'] },
  { icon: '🎧', title: 'Contact Us',   desc: 'Talk to our team',         to: '/contact', keywords: ['contact', 'support', 'help', 'team', 'call', 'chat'] },
]

export default function HelpPage() {
  const [open,   setOpen]   = useState(null)
  const [query,  setQuery]  = useState('')

  const q = query.trim().toLowerCase()

  // Filter FAQs: match against question text + answer text
  const filteredFaqs = useMemo(() => {
    if (!q) return ALL_FAQS
    return ALL_FAQS.filter(
      faq =>
        faq.q.toLowerCase().includes(q) ||
        faq.a.toLowerCase().includes(q)
    )
  }, [q])

  // Filter quick-link cards: match against title, desc, or keywords
  const filteredLinks = useMemo(() => {
    if (!q) return ALL_QUICK_LINKS
    return ALL_QUICK_LINKS.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q)  ||
        item.keywords.some(k => k.includes(q))
    )
  }, [q])

  const hasResults = filteredFaqs.length > 0 || filteredLinks.length > 0

  const handleSearch = (e) => {
    e.preventDefault()   // prevent page reload on Enter
  }

  // When query changes, auto-expand the first matching FAQ
  const handleQueryChange = (e) => {
    const val = e.target.value
    setQuery(val)
    // Auto-open first result when there's a search term
    if (val.trim()) setOpen(0)
    else setOpen(null)
  }

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── Hero / Search ─────────────────────────────────────────── */}
      <div className="bg-blue-700 text-white py-8 sm:py-14 px-4 text-center">
        <h1 className="text-2xl sm:text-4xl font-extrabold mb-2 sm:mb-3">Help Center</h1>
        <p className="text-blue-100 text-sm sm:text-lg mb-5 sm:mb-6">How can we help you today?</p>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
          <div className="flex bg-white rounded-xl overflow-hidden shadow-lg">
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder="Search for help topics…"
              className="flex-1 px-4 py-3 text-gray-800 text-sm focus:outline-none min-w-0"
            />
            {/* Clear button — visible only when there's a query */}
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setOpen(null) }}
                className="px-3 text-gray-400 hover:text-gray-600 text-xs bg-white border-l border-gray-100"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 text-sm font-semibold transition shrink-0"
            >
              Search
            </button>
          </div>

          {/* Live result count hint */}
          {query && (
            <p className="text-blue-200 text-xs mt-2">
              {hasResults
                ? `${filteredFaqs.length} FAQ${filteredFaqs.length !== 1 ? 's' : ''} · ${filteredLinks.length} topic${filteredLinks.length !== 1 ? 's' : ''} found`
                : 'No results — try a different term'}
            </p>
          )}
        </form>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* ── Quick Links ─────────────────────────────────────────── */}
        {filteredLinks.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-12">
            {filteredLinks.map(item => (
              <Link
                key={item.title}
                to={item.to}
                className="bg-white rounded-xl p-3 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-center group"
              >
                <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2">{item.icon}</div>
                <p className="font-bold text-gray-800 text-xs sm:text-sm group-hover:text-blue-600 leading-tight">
                  {item.title}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 leading-tight">{item.desc}</p>
              </Link>
            ))}
          </div>
        )}

        {/* ── No results state ────────────────────────────────────── */}
        {query && !hasResults && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="font-bold text-gray-700 text-lg mb-2">No results for "{query}"</h3>
            <p className="text-gray-500 text-sm mb-5">Try different keywords or browse the categories above.</p>
            <button
              onClick={() => setQuery('')}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* ── FAQs ────────────────────────────────────────────────── */}
        {filteredFaqs.length > 0 && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
              {query ? `Results for "${query}"` : 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-2 sm:space-y-3">
              {filteredFaqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="w-full text-left px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between font-semibold text-gray-800 hover:text-blue-600 transition-colors text-sm sm:text-base"
                  >
                    <span className="pr-4">{faq.q}</span>
                    <svg
                      width="16" height="16" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2"
                      className={`shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {open === i && (
                    <div className="px-4 sm:px-6 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Contact CTA ─────────────────────────────────────────── */}
        {!query && (
          <div className="mt-10 sm:mt-12 bg-blue-600 rounded-2xl text-white text-center py-8 sm:py-10 px-4 sm:px-6">
            <h3 className="text-lg sm:text-xl font-bold mb-2">Still need help?</h3>
            <p className="text-blue-100 mb-4 sm:mb-5 text-sm sm:text-base">Our support team is available 24/7</p>
            <Link
              to="/contact"
              className="inline-block bg-white text-blue-700 font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-blue-50 transition shadow-lg text-sm sm:text-base"
            >
              Contact Support
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
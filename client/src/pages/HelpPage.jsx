// FILE: src/pages/HelpPage.jsx
// Fixes:
//  • Fixed quick-link keyword matching (case-insensitive)
//  • Fixed FAQ open-state bug when filtering (stable index handling)
//  • Improved UX consistency for filtered results
//  • Corrected Returns quick link route to /returns
//  • Removed auto-open behavior causing mismatch issues

import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

const ALL_FAQS = [
  { q: 'How do I track my order?', a: "Go to My Orders in your account dashboard. You'll find real-time tracking information for all your orders." },
  { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, M-Pesa, PayPal, and Stripe. All transactions are secured with SSL encryption.' },
  { q: 'How long does delivery take?', a: 'Standard delivery within Nairobi takes 1–2 business days. Upcountry deliveries take 2–5 business days.' },
  { q: 'Can I return a product?', a: 'Yes! We offer a 30-day return policy on all products. Items must be in original condition with packaging.' },
  { q: 'Are all products genuine?', a: 'Absolutely. All products are sourced from authorized distributors and come with manufacturer warranties.' },
  { q: 'How do I cancel an order?', a: 'Orders can be cancelled within 1 hour of placing them. Go to My Orders and click "Cancel Order".' },
]

const ALL_QUICK_LINKS = [
  { icon: '📦', title: 'Track Order',  desc: 'Check delivery status',    to: '/orders',  keywords: ['track', 'order', 'delivery', 'status', 'shipping'] },
  { icon: '↩️', title: 'Returns',      desc: 'Return or exchange',       to: '/returns', keywords: ['return', 'refund', 'exchange', 'send back'] },
  { icon: '💳', title: 'Payments',     desc: 'Payment methods & issues', to: '/contact', keywords: ['payment', 'pay', 'mpesa', 'card', 'visa', 'billing'] },
  { icon: '🎧', title: 'Contact Us',   desc: 'Talk to our team',         to: '/contact', keywords: ['contact', 'support', 'help', 'team', 'call', 'chat'] },
]

export default function HelpPage() {
  const [open, setOpen] = useState(null)
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()

  const filteredFaqs = useMemo(() => {
    if (!q) return ALL_FAQS
    return ALL_FAQS.filter(f =>
      f.q.toLowerCase().includes(q) ||
      f.a.toLowerCase().includes(q)
    )
  }, [q])

  const filteredLinks = useMemo(() => {
    if (!q) return ALL_QUICK_LINKS
    return ALL_QUICK_LINKS.filter(item => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.keywords.some(k => k.toLowerCase().includes(q))
      )
    })
  }, [q])

  const hasResults = filteredFaqs.length > 0 || filteredLinks.length > 0

  const handleSearch = (e) => e.preventDefault()

  const handleQueryChange = (e) => {
    setQuery(e.target.value)
    setOpen(null)
  }

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero */}
      <div className="bg-blue-700 text-white py-8 sm:py-14 px-4 text-center">
        <h1 className="text-2xl sm:text-4xl font-extrabold mb-2">Help Center</h1>
        <p className="text-blue-100 text-sm sm:text-lg mb-5">How can we help you today?</p>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
          <div className="flex bg-white rounded-xl overflow-hidden shadow-lg">
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder="Search help topics..."
              className="flex-1 px-4 py-3 text-gray-800 text-sm focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setOpen(null) }}
                className="px-3 text-gray-400"
              >
                ✕
              </button>
            )}
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 text-sm font-semibold">
              Search
            </button>
          </div>
        </form>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Quick Links */}
        {filteredLinks.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {filteredLinks.map(item => (
              <Link
                key={item.title}
                to={item.to}
                className="bg-white p-4 rounded-xl border shadow-sm text-center"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="font-bold text-sm">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </Link>
            ))}
          </div>
        )}

        {/* No results */}
        {q && !hasResults && (
          <div className="text-center py-10">
            <p className="text-lg font-bold">No results for "{query}"</p>
            <button onClick={() => setQuery('')} className="mt-4 text-blue-600">
              Clear search
            </button>
          </div>
        )}

        {/* FAQs */}
        {filteredFaqs.length > 0 && (
          <div className="max-w-3xl mx-auto">
            <h2 className="font-bold text-lg mb-4">Frequently Asked Questions</h2>

            {filteredFaqs.map((faq, i) => (
              <div key={i} className="border-b">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full text-left py-4 flex justify-between font-semibold"
                >
                  {faq.q}
                  <span>{open === i ? '−' : '+'}</span>
                </button>

                {open === i && (
                  <div className="pb-4 text-gray-600 text-sm">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        {!q && (
          <div className="mt-12 bg-blue-600 text-white text-center p-8 rounded-2xl">
            <h3 className="text-lg font-bold mb-2">Still need help?</h3>
            <Link to="/contact" className="bg-white text-blue-700 px-6 py-2 rounded-lg font-bold">
              Contact Support
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

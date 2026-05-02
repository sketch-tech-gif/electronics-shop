// FILE: src/pages/SitemapPage.jsx
import { Link } from "react-router-dom";

const sections = [
  {
    title: "Shop",
    links: [
      { label: "All Products",       to: "/products" },
      { label: "Phones",             to: "/products?category=phones" },
      { label: "Laptops",            to: "/products?category=laptops" },
      { label: "Tablets",            to: "/products?category=tablets" },
      { label: "Accessories",        to: "/products?category=accessories" },
      { label: "Audio",              to: "/products?category=audio" },
      { label: "Cameras",            to: "/products?category=cameras" },
      { label: "Gaming",             to: "/products?category=gaming" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In / Register", to: "/auth" },
      { label: "My Account",         to: "/account" },
      { label: "My Orders",          to: "/orders" },
      { label: "Wishlist",           to: "/wishlist" },
      { label: "Shopping Cart",      to: "/cart" },
      { label: "Checkout",           to: "/checkout" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "Help Center",        to: "/help" },
      { label: "Track Order",        to: "/orders" },
      { label: "Returns & Refunds",  to: "/help" },
      { label: "Contact Us",         to: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us",           to: "/about" },
      { label: "Careers",            to: "/about" },
      { label: "Press",              to: "/about" },
      { label: "Blog",               to: "/about" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy",     to: "/privacy" },
      { label: "Terms of Service",   to: "/terms" },
      { label: "Cookie Policy",      to: "/privacy" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-blue-700 text-white py-12 px-4 text-center">
        <h1 className="text-3xl font-extrabold mb-2">Sitemap</h1>
        <p className="text-blue-100 text-sm">All pages on Vantix Kenya</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map(section => (
            <div key={section.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">
                {section.title}
              </h2>
              <ul className="space-y-2.5">
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
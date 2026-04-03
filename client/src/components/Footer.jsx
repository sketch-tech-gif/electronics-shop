// FILE: src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-8">
      {/* Newsletter */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-bold text-lg">Subscribe to our newsletter</h3>
              <p className="text-blue-100 text-sm">Get the latest deals and tech news delivered to your inbox</p>
            </div>
            <div className="flex w-full sm:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 sm:w-64 px-4 py-2.5 rounded-xl text-sm text-gray-800 focus:outline-none"
              />
              <button className="bg-white text-blue-700 font-bold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition text-sm whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                  <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z"/>
                  <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z"/>
                  <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z"/>
                </svg>
              </div>
              <span className="font-bold text-white text-lg">Tech<span className="text-blue-400">Store</span></span>
            </Link>
            <p className="text-sm leading-relaxed mb-3">Kenya's #1 online electronics store. Genuine products, fast delivery, best prices.</p>
            <div className="flex gap-3">
              {["📘", "🐦", "📸", "▶️"].map((icon, i) => (
                <button key={i} className="w-8 h-8 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center text-sm transition-colors">
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: "Shop",
              links: [
                { label: "All Products", to: "/products" },
                { label: "Phones", to: "/products?category=phones" },
                { label: "Laptops", to: "/products?category=laptops" },
                { label: "Audio", to: "/products?category=audio" },
                { label: "Gaming", to: "/products?category=gaming" },
              ],
            },
            {
              title: "Customer Service",
              links: [
                { label: "My Account", to: "/account" },
                { label: "My Orders", to: "/orders" },
                { label: "Track Order", to: "/orders" },
                { label: "Returns & Refunds", to: "/" },
                { label: "Help Center", to: "/" },
              ],
            },
            {
              title: "Company",
              links: [
                { label: "About Us", to: "/" },
                { label: "Careers", to: "/" },
                { label: "Press", to: "/" },
                { label: "Contact Us", to: "/" },
                { label: "Blog", to: "/" },
              ],
            },
            {
              title: "Legal",
              links: [
                { label: "Privacy Policy", to: "/" },
                { label: "Terms of Service", to: "/" },
                { label: "Cookie Policy", to: "/" },
                { label: "Sitemap", to: "/" },
              ],
            },
          ].map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold text-sm mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm hover:text-blue-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} TechStore Kenya. All rights reserved.</p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="text-gray-500">Secure payments:</span>
            {["Visa", "M-Pesa", "PayPal", "Stripe", "Mastercard"].map((p) => (
              <span key={p} className="bg-gray-800 text-gray-300 text-[10px] font-bold px-2 py-1 rounded">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
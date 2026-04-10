// FILE: src/pages/ProductDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { products, mockReviews } from "../data/products";

const API = 'https://electronics-shop-api-id3m.onrender.com';


function StarRating({ rating, size = "sm" }) {
  const sizes = { sm: "w-3.5 h-3.5", md: "w-5 h-5" };
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className={`${sizes[size]} ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <svg viewBox="0 0 24 24" className={`w-7 h-7 transition-colors ${(hover || value) >= star ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted, toast, cart } = useApp();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "", name: "", email: "" });
  const [reviewError, setReviewError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const found = products.find((p) => p.id === Number(id));
      if (found) {
        setProduct(found);
        setSelectedVariant(found.variants?.[0] || "");
        setReviews(mockReviews[found.id] || []);
      }
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-gray-200 rounded-2xl h-96" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-10 bg-gray-200 rounded w-1/3" />
            <div className="h-12 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">
          Browse Products
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : product.rating;
  const inCart = cart.find((i) => i.id === product.id);

  const handleAddToCart = () => {
    addToCart({ ...product, variant: selectedVariant, qty });
  };

  const handleBuyNow = () => {
    addToCart({ ...product, variant: selectedVariant, qty });
    navigate("/checkout");
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError("");
    if (!reviewForm.rating) { setReviewError("Please select a rating"); return; }
    if (!reviewForm.name.trim()) { setReviewError("Please enter your name"); return; }
    if (!reviewForm.comment.trim() || reviewForm.comment.trim().length < 10) {
      setReviewError("Please write at least 10 characters"); return;
    }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    const newReview = {
      id: Date.now(),
      user: reviewForm.name,
      avatar: reviewForm.name.slice(0, 2).toUpperCase(),
      rating: reviewForm.rating,
      date: new Date().toISOString().split("T")[0],
      verified: false,
      comment: reviewForm.comment,
      helpful: 0,
    };
    setReviews((prev) => [newReview, ...prev]);
    setReviewForm({ rating: 0, comment: "", name: "", email: "" });
    setSubmitting(false);
    toast("Review submitted successfully! ⭐");
    setActiveTab("reviews");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-blue-600 capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Main product section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-8 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Images */}
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl overflow-hidden aspect-square relative">
                <img
                  src={product.images[activeImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
                    -{discount}% OFF
                  </div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === i ? "border-blue-600" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <p className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-2">{product.brand}</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight">{product.title}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={Number(avgRating)} size="md" />
                <span className="font-bold text-gray-800">{avgRating}</span>
                <span className="text-gray-400 text-sm">({reviews.length || product.reviewCount} reviews)</span>
                <span className="text-gray-400 text-sm">|</span>
                <span className="text-gray-400 text-sm">{product.sold.toLocaleString()} sold</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-gray-100">
                <span className="text-3xl font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                    <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Variants */}
              {product.variants?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Color/Variant: <span className="text-blue-600">{selectedVariant}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                          selectedVariant === v
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-600 hover:border-gray-400"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock */}
              <div className="mb-4">
                {product.stock > 10 ? (
                  <p className="text-sm text-green-600 font-medium">✅ In Stock ({product.stock} available)</p>
                ) : product.stock > 0 ? (
                  <p className="text-sm text-orange-500 font-medium">⚠️ Only {product.stock} left in stock!</p>
                ) : (
                  <p className="text-sm text-red-500 font-medium">❌ Out of Stock</p>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-4">
                <p className="text-sm font-semibold text-gray-700">Quantity:</p>
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-4 py-2.5 hover:bg-gray-50 text-gray-700 font-bold text-lg transition"
                  >
                    −
                  </button>
                  <span className="px-5 py-2.5 font-bold text-gray-800 min-w-[3rem] text-center border-x border-gray-200">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="px-4 py-2.5 hover:bg-gray-50 text-gray-700 font-bold text-lg transition"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-400">Max: {product.stock}</span>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition shadow-md"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  {inCart ? "Add More to Cart" : "Add to Cart"}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded-xl border-2 transition-all ${
                    wishlisted ? "border-red-300 bg-red-50 text-red-500" : "border-gray-200 text-gray-400 hover:border-red-300"
                  }`}
                >
                  <svg viewBox="0 0 24 24" strokeWidth={2} className={`w-5 h-5 ${wishlisted ? "fill-red-500 stroke-red-500" : "fill-none"}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>
              </div>

              {/* Delivery info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                {product.freeShipping && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500">🚚</span>
                    <span><strong>Free Delivery</strong> on this order</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📦</span>
                  <span>Estimated delivery: <strong>3-5 business days</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>↩️</span>
                  <span><strong>30-day</strong> hassle-free returns</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>🔒</span>
                  <span><strong>{product.warranty}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {["description", "specifications", "reviews", "write-review"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-4 text-sm font-semibold whitespace-nowrap capitalize transition-colors ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "write-review" ? "Write a Review" : tab}
                {tab === "reviews" && reviews.length > 0 && (
                  <span className="ml-1.5 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                    {reviews.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Description */}
            {activeTab === "description" && (
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-gray-600 text-sm">
                        <span className="text-blue-500">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Specifications */}
            {activeTab === "specifications" && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-100">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <tr key={key}>
                        <td className="py-3 pr-6 font-medium text-gray-500 w-1/3 whitespace-nowrap">{key}</td>
                        <td className="py-3 text-gray-800">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Reviews */}
            {activeTab === "reviews" && (
              <div>
                {/* Summary */}
                <div className="flex items-center gap-8 mb-6 pb-6 border-b border-gray-100">
                  <div className="text-center">
                    <p className="text-5xl font-extrabold text-gray-900">{avgRating}</p>
                    <StarRating rating={Number(avgRating)} size="md" />
                    <p className="text-sm text-gray-400 mt-1">{reviews.length} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter((r) => r.rating === star).length;
                      const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 w-4">{star}★</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-2">
                            <div className="bg-yellow-400 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-gray-400 w-6">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {reviews.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">No reviews yet. Be the first to review!</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((r) => (
                      <div key={r.id} className="border border-gray-100 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {r.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-800 text-sm">{r.user}</span>
                                {r.verified && (
                                  <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full font-medium">✓ Verified</span>
                                )}
                              </div>
                              <span className="text-xs text-gray-400">{r.date}</span>
                            </div>
                            <StarRating rating={r.rating} size="sm" />
                            <p className="mt-2 text-gray-600 text-sm leading-relaxed">{r.comment}</p>
                            <button className="mt-2 text-xs text-gray-400 hover:text-gray-600">
                              👍 Helpful ({r.helpful})
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Write review form */}
            {activeTab === "write-review" && (
              <form onSubmit={handleSubmitReview} className="max-w-lg space-y-4">
                <h3 className="font-bold text-gray-900 text-lg">Share Your Experience</h3>

                {reviewError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                    {reviewError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating *</label>
                  <StarPicker value={reviewForm.rating} onChange={(r) => setReviewForm(f => ({ ...f, rating: r }))} />
                  {reviewForm.rating > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][reviewForm.rating]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email (optional)</label>
                  <input
                    type="email"
                    value={reviewForm.email}
                    onChange={(e) => setReviewForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Review *</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                    placeholder="Tell others about your experience with this product (minimum 10 characters)..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">{reviewForm.comment.length} characters</p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Submitting...
                    </>
                  ) : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((p) => (
                <div key={p.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <Link to={`/product/${p.id}`}>
                    <img src={p.image} alt={p.title} className="w-full h-40 object-cover" />
                  </Link>
                  <div className="p-3">
                    <p className="text-xs text-blue-600 font-semibold mb-1">{p.brand}</p>
                    <Link to={`/product/${p.id}`} className="text-sm font-medium text-gray-800 hover:text-blue-600 line-clamp-2">
                      {p.title}
                    </Link>
                    <p className="font-bold text-gray-900 mt-1">${p.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
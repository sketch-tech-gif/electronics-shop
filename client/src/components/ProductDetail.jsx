// FILE: src/components/ProductList.jsx
import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { products, CATEGORIES } from "../data/products";
import ProductCard from "./ProductCard";
import { SkeletonCard } from "./ui/Skeleton";

const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export default function ProductList() {
  const { searchQuery, filters, dispatch } = useApp();
  const [loading] = useState(false); // Replace with real loading state if fetching from API

  // Filter & sort products
  const filtered = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Category
    if (filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }

    // Price range
    result = result.filter(
      (p) => p.price >= filters.minPrice && p.price <= (filters.maxPrice || Infinity)
    );

    // Sort
    switch (filters.sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, filters]);

  const setFilter = (key, value) =>
    dispatch({ type: "SET_FILTER", filter: { [key]: value } });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">
          {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
        </h1>
        <p className="text-slate-500 text-sm">{filtered.length} products found</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Sidebar Filters ─────────────────────────────────────────────────── */}
        <aside className="lg:w-56 shrink-0">
          <div className="sticky top-20 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-6">

            {/* Category */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Category</h3>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter("category", cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                      filters.category === cat
                        ? "bg-violet-600 text-white"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Price Range</h3>
              <div className="space-y-1">
                {[
                  { label: "All Prices", min: 0, max: Infinity },
                  { label: "Under $100", min: 0, max: 100 },
                  { label: "$100 – $250", min: 100, max: 250 },
                  { label: "$250 – $500", min: 250, max: 500 },
                  { label: "Over $500", min: 500, max: Infinity },
                ].map((range) => {
                  const active = filters.minPrice === range.min && filters.maxPrice === range.max;
                  return (
                    <button
                      key={range.label}
                      onClick={() => {
                        setFilter("minPrice", range.min);
                        setFilter("maxPrice", range.max);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        active ? "bg-violet-600 text-white" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {range.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={() => dispatch({ type: "SET_FILTER", filter: { category: "all", minPrice: 0, maxPrice: Infinity, sort: "default" } })}
              className="w-full text-sm text-slate-400 hover:text-violet-600 transition-colors text-center"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* ── Product Grid ─────────────────────────────────────────────────────── */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm text-slate-500 hidden sm:block">{filtered.length} items</span>
            <div className="flex items-center gap-2 ml-auto">
              <label className="text-sm text-slate-500">Sort:</label>
              <select
                value={filters.sort}
                onChange={(e) => setFilter("sort", e.target.value)}
                className="text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-700 mb-1">No products found</h3>
              <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
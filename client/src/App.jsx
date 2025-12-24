import { useEffect, useState } from "react";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import ProductDetail from "./components/ProductDetail";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "https://electronics-shop-api-id3m.onrender.com";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const CONTACT_PHONE = "+254745909218";
  const WHATSAPP_NUMBER = "+254745909218";
  const SALE_PRICE = null;

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterBrand, setFilterBrand] = useState("All");
  const [filterPriceMin, setFilterPriceMin] = useState(0);
  const [filterPriceMax, setFilterPriceMax] = useState(10000000);
  const [filterInStock, setFilterInStock] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const brands = [
    "All",
    ...new Set(products.map((p) => p.brand).filter(Boolean)),
  ];

  // Filter and sort products
  const filteredProducts = products
    .filter((p) => {
      // If user hasn't typed anything, show everything
      if (!searchTerm.trim()) {
        return true;
      }

      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "All" || p.category === filterCategory;
      const matchesBrand =
        filterBrand === "All" || p.brand === filterBrand;
      const matchesPrice =
        p.price >= filterPriceMin && p.price <= filterPriceMax;
      const matchesStock = !filterInStock || p.inStock;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand &&
        matchesPrice &&
        matchesStock
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find((item) => item._id === product._id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">FAITH-ELECTRONICS</h1>
        </div>
      </header>

      <div className="hero">
        <div className="hero-content">
          <div className="hero-left">
            <h2>Top Quality products and services You Can Trust</h2>
            <p>
              Fast delivery within Nairobi • Order via WhatsApp or call to
              reserve
            </p>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value) setShowFilterSidebar(true);
              }}
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => {
                  setSearchTerm("");
                  setShowFilterSidebar(false);
                  setFilterCategory("All");
                  setFilterBrand("All");
                  setFilterPriceMin(0);
                  setFilterPriceMax(10000000);
                  setFilterInStock(false);
                }}
              >
                ✕ Clear
              </button>
            )}
          </div>

          <div className="hero-actions">
            <button
              className="cart-btn"
              onClick={() => setShowCart(!showCart)}
            >
              🛒 Cart ({cartCount})
            </button>
          </div>
        </div>
      </div>

      {showCart ? (
        <Cart
          cart={cart}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onClose={() => setShowCart(false)}
        />
      ) : selectedProduct ? (
        <ProductDetail
          product={selectedProduct}
          allProducts={products}
          onAddToCart={(p, qty) => addToCart(p, qty)}
          onClose={() => setSelectedProduct(null)}
        />
      ) : (
        <main className="main-content">
          <div className="products-section">
            {showFilterSidebar && searchTerm && (
              <aside className="filter-sidebar">
                <h3>🔍 Search Filters</h3>

                <div className="filter-group">
                  <h4>Price Range (KES)</h4>
                  <div className="price-inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filterPriceMin}
                      onChange={(e) =>
                        setFilterPriceMin(Number(e.target.value) || 0)
                      }
                    />
                    <span>—</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filterPriceMax}
                      onChange={(e) =>
                        setFilterPriceMax(
                          Number(e.target.value) || 10000000
                        )
                      }
                    />
                  </div>
                  <button
                    className="apply-btn"
                    onClick={() => {}}
                  >
                    Apply
                  </button>
                </div>

                <div className="filter-group">
                  <h4>Category</h4>
                  <ul>
                    {categories.map((cat) => (
                      <li key={cat}>
                        <label>
                          <input
                            type="radio"
                            name="category"
                            value={cat}
                            checked={filterCategory === cat}
                            onChange={(e) =>
                              setFilterCategory(e.target.value)
                            }
                          />
                          {cat}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="filter-group">
                  <h4>Brand</h4>
                  <ul>
                    {brands.map((brand) => (
                      <li key={brand}>
                        <label>
                          <input
                            type="radio"
                            name="brand"
                            value={brand}
                            checked={filterBrand === brand}
                            onChange={(e) =>
                              setFilterBrand(e.target.value)
                            }
                          />
                          {brand}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="filter-group">
                  <label className="stock-checkbox">
                    <input
                      type="checkbox"
                      checked={filterInStock}
                      onChange={(e) =>
                        setFilterInStock(e.target.checked)
                      }
                    />
                    In Stock Only
                  </label>
                </div>
              </aside>
            )}

            <div
              className={`products-content ${
                showFilterSidebar && searchTerm ? "with-sidebar" : ""
              }`}
            >
              {loading ? (
                <div className="loading">Loading products...</div>
              ) : filteredProducts.length > 0 ? (
                <ProductList
                  products={filteredProducts}
                  onAddToCart={addToCart}
                  onViewDetails={(p) => setSelectedProduct(p)}
                  contactPhone={CONTACT_PHONE}
                  whatsappNumber={WHATSAPP_NUMBER}
                  salePrice={SALE_PRICE}
                />
              ) : (
                <div className="no-results">
                  <p>No products found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      <footer className="footer">
        <p>&copy; 2025 Mercy Electronics Shop. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;

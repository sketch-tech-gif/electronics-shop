import "./ProductDetail.css";
import { useState } from "react";

function ProductDetail({ product, allProducts = [], onAddToCart, onClose }) {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] ?? null);
  const [activeTab, setActiveTab] = useState("description");

  // Get similar products (same category OR same brand, exclude current product)
  const similarProducts = allProducts.filter(
    p => p._id !== product._id && (p.category === product.category || p.brand === product.brand)
  ).slice(0, 8);

  const increment = () => setQuantity((q) => Math.min(q + 1, 99));
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAddToCart = () => {
    onAddToCart(product, Number(quantity));
  };

  const currentPrice = product.salePrice ?? product.price ?? 0;
  const originalPrice = product.salePrice ? product.price : null;
  const discountPercent = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : null;

  const rating = product.rating ?? null;
  const reviewsCount = product.reviewsCount ?? null;

  const whatsappNumber = "+254745909218".replace(/\D/g, "");
  const waMessage = encodeURIComponent(
    `Hello, I'm interested in ${product.name} (${selectedColor ?? 'Default'}) - Qty: ${quantity} - Price: KES ${currentPrice?.toLocaleString()}`
  );

  return (
    <div className="pd-full-page">
      <header className="pd-page-header">
        <button className="pd-back" onClick={onClose}>← Back</button>
        <h1>Product Details</h1>
      </header>

      <div className="pd-container">
        <div className="pd-grid">
          <div className="pd-media">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="pd-main-image" />
            ) : (
              <div className="pd-image-placeholder">No image</div>
            )}
            {product.gallery?.length > 1 && (
              <div className="pd-thumbs">
                {product.gallery.map((g, i) => (
                  <img key={i} src={g} alt={`${product.name} ${i}`} className="pd-thumb" />
                ))}
              </div>
            )}
          </div>

          <div className="pd-details">
            <button className="pd-close-btn" onClick={onClose} aria-label="Close">✕</button>
            {product.brand && <div className="pd-brand">{product.brand}</div>}
            <h2 className="pd-title">{product.name}</h2>

            {rating && reviewsCount && (
              <div className="pd-rating">
                <div className="pd-stars" aria-hidden>
                  {"★".repeat(Math.round(rating))}
                  {"☆".repeat(5 - Math.round(rating))}
                </div>
                <div className="pd-review-count">{rating.toFixed(1)} • {reviewsCount.toLocaleString()} reviews</div>
              </div>
            )}

            <div className="pd-price-row">
              <div className="pd-price">KSh {currentPrice?.toLocaleString()}</div>
              {originalPrice && (
                <>
                  <div className="pd-original">KSh {originalPrice?.toLocaleString()}</div>
                  {discountPercent > 0 && (
                    <div className="pd-discount">-{discountPercent}%</div>
                  )}
                </>
              )}
            </div>

            <div className="pd-service">Service: <span>fulfilled by mercy electronics shop</span></div>

            {product.colors && product.colors.length > 0 && (
              <div className="pd-colors">
                <label>Color:</label>
                <div className="pd-color-options">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      className={`color-btn ${selectedColor === c ? 'active' : ''}`}
                      onClick={() => setSelectedColor(c)}
                      aria-pressed={selectedColor === c}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pd-delivery">Delivery:Ships from Nairobi CBD</div>

            <div className="pd-quantity-row">
              <div className="pd-quantity">
                <label>Quantity</label>
                <div className="quantity-input">
                  <button onClick={decrement} aria-label="Decrease">−</button>
                  <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))} />
                  <button onClick={increment} aria-label="Increase">+</button>
                </div>
              </div>
              <button className="pd-add-inline" onClick={handleAddToCart}>Add to Cart</button>
            </div>

            <div className="pd-actions-secondary">
              <a className="pd-order-wa" href={`https://wa.me/${whatsappNumber}?text=${waMessage}`} target="_blank" rel="noopener noreferrer">Order via WhatsApp</a>
              <a className="pd-call" href="tel:+254700000000" title="Call to order">📞 Call</a>
            </div>
          </div>
        </div>

        <div className="pd-tabs">
          <button className={`pd-tab ${activeTab === "description" ? "active" : ""}`} onClick={() => setActiveTab("description")}>Description</button>
          <button className={`pd-tab ${activeTab === "specs" ? "active" : ""}`} onClick={() => setActiveTab("specs")}>Specifications</button>
          <button className={`pd-tab ${activeTab === "recommend" ? "active" : ""}`} onClick={() => setActiveTab("recommend")}>Similar Products</button>
        </div>

        <div className="pd-tab-content">
          {activeTab === "description" && (
            <div className="pd-desc-section">
              {product.description ? (
                <>
                  <h4>About this item</h4>
                  <p>{product.description.split(/(?<=[.!?])\s+/).join('\n')}</p>
                </>
              ) : (
                <p className="pd-empty">No description available.</p>
              )}
            </div>
          )}

          {activeTab === "specs" && (
            <div className="pd-specs-table">
              {product.specs ? (
                <table>
                  <tbody>
                    <tr><td></td><td>{product.specs.split(/(?<=[.!?])\s+/).join('\n')}</td></tr>
                  </tbody>
                </table>
              ) : (
                <p className="pd-empty">No specifications available.</p>
              )}
            </div>
          )}

          {activeTab === "recommend" && (
            <div className="pd-recommend-section">
              {similarProducts.length > 0 ? (
                <ul>
                  {similarProducts.map((p) => (
                    <li key={p._id} className="pd-similar-product">
                      <strong>{p.name}</strong> - KSh {p.price?.toLocaleString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="pd-empty">No similar products available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;

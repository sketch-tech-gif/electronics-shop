function ProductCard({ product, onAddToCart, onViewDetails, contactPhone, whatsappNumber, salePrice }) {
  const displaySalePrice = salePrice ?? product.salePrice ?? null;

  const handleAddToCart = () => {
    onAddToCart(product);
  };

  const handleView = () => {
    if (onViewDetails) onViewDetails(product);
  };

  return (
    <div className="product-card">
      {product.imageUrl && (
        <div className="product-image" onClick={handleView} role="button" tabIndex={0}>
          <img src={product.imageUrl} alt={product.name} />
        </div>
      )}

      <div className="product-info">
        <h3 className="clickable" onClick={handleView} role="button" tabIndex={0}>
          {product.name}
        </h3>
        {product.brand && <p className="brand">{product.brand}</p>}

        <div className="product-footer">
          <div className="price-block">
            <p className="price">KES {product.price.toLocaleString()}</p>
            {displaySalePrice && (
              <p className="sale-price">
                Selling Price: KES {displaySalePrice.toLocaleString()}
              </p>
            )}
          </div>

          <div className="footer-actions">
            {product.inStock ? (
              <button
                className="btn-add-cart"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            ) : (
              <button className="btn-out-of-stock" disabled>
                Out of Stock
              </button>
            )}
            {/* WhatsApp and Call buttons intentionally removed from card */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

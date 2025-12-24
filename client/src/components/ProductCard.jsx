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
      <div className="product-image" onClick={handleView} role="button" tabIndex={0}>
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            loading="eager"
            fetchpriority="high"
            onError={(e) => {
              console.log('Image load error:', product.imageUrl);
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23f5f5f5" width="300" height="300"/%3E%3Ctext fill="%23999" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
            }}
          />
        ) : (
          <div style={{width: '100%', height: '100%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999'}}>
            No Image
          </div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name" onClick={handleView} role="button" tabIndex={0}>
          {product.name}
        </h3>
        {product.brand && <p className="brand">{product.brand}</p>}

        <div className="product-footer">
          <div className="price-block">
            <p className="price">KES {product.price.toLocaleString()}</p>
            {displaySalePrice && displaySalePrice !== product.price && (
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

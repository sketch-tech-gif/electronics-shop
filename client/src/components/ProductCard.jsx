function ProductCard({ product, onAddToCart, onViewDetails, contactPhone = "+254745909218", whatsappNumber = "+254745909218", salePrice = null }) {
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
        <h3 className="clickable" onClick={handleView} role="button" tabIndex={0}>{product.name}</h3>
        {product.brand && <p className="brand">{product.brand}</p>}
        {product.category && <p className="category">Category: {product.category}</p>}
        {product.description && (
          <p className="description">{product.description}</p>
        )}
        {product.specs && <p className="specs">Specs: {product.specs}</p>}

        <div className="product-footer">
          <div className="price-block">
            <p className="price">KES {product.price.toLocaleString()}</p>
            {displaySalePrice ? (
              <p className="sale-price">Selling Price: KES {displaySalePrice.toLocaleString()}</p>
            ) : null}
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

            <a
              className="quick-whatsapp"
              href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
                `Hi, I'm interested in ${product.name} (SKU: ${product.sku || 'N/A'}) - Selling Price: KES ${
                  displaySalePrice ? displaySalePrice.toLocaleString() : (product.price?.toLocaleString() || '')
                }`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Order via WhatsApp"
            >
              <svg className="icon icon-whatsapp" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="#fff" d="M20.5 3.5a11 11 0 10-3 21.6l.2.1 2-7.2a10.9 10.9 0 001.5-14.5zM12 21a9 9 0 110-18 9 9 0 010 18z"></path></svg>
              WhatsApp
            </a>

            <a className="quick-call" href={`tel:${contactPhone}`} title="Call to order">
              <svg className="icon icon-phone" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="#fff" d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.1-2.1a1 1 0 01.9-.3c1 .3 2 .5 2.9.5a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h2.3a1 1 0 011 1c0 .9.2 1.9.5 2.9.1.4 0 .8-.3.9L6.6 10.8z"></path></svg>
              Call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

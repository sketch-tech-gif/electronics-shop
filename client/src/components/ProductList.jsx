import ProductCard from "./ProductCard";

function ProductList({ products, onAddToCart, onViewDetails, contactPhone, whatsappNumber, salePrice }) {
  if (products.length === 0) {
    return (
      <div className="no-products">
        <p>No products found. Try adjusting your filters or search.</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
          contactPhone={contactPhone}
          whatsappNumber={whatsappNumber}
          salePrice={salePrice}
        />
      ))}
    </div>
  );
}

export default ProductList;

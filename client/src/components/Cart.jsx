function Cart({ cart, onRemove, onUpdateQuantity, onClose }) {
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <div className="cart-header-row">
        <button className="close-cart-btn" onClick={onClose}>
          ← Back to Products
        </button>
        <h2 className="cart-title">Shopping Cart</h2>
      </div>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                {/* left: (optional) thumbnail placeholder */}
                <div className="cart-item-thumb">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} />
                  )}
                </div>

                {/* middle: name + unit price */}
                <div className="cart-item-info">
                  <h4 className="cart-item-name">{item.name}</h4>
                  <p className="cart-item-price">
                    KES {item.price.toLocaleString()}
                  </p>
                </div>

                {/* quantity controls */}
                <div className="cart-item-qty">
                  <button
                    onClick={() =>
                      onUpdateQuantity(item._id, item.quantity - 1)
                    }
                    className="qty-btn"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      onUpdateQuantity(
                        item._id,
                        parseInt(e.target.value, 10) || 1
                      )
                    }
                    className="qty-input"
                  />
                  <button
                    onClick={() =>
                      onUpdateQuantity(item._id, item.quantity + 1)
                    }
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>

                {/* right: subtotal + delete */}
                <div className="cart-item-total">
                  <p className="item-subtotal">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </p>
                  <button
                    onClick={() => onRemove(item._id)}
                    className="btn-remove"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* summary on the side / bottom */}
          <aside className="cart-summary">
            <div className="cart-summary-box">
              <div className="cart-summary-row">
                <span>Total:</span>
                <span className="cart-summary-total">
                  KES {totalPrice.toLocaleString()}
                </span>
              </div>
              <button className="btn-checkout">Proceed to Checkout</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Cart;

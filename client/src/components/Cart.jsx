function Cart({ cart, onRemove, onUpdateQuantity, onClose }) {
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <button className="close-cart-btn" onClick={onClose}>
        ← Back to Products
      </button>

      <h2>Shopping Cart</h2>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>KES {item.price.toLocaleString()}</p>
                </div>

                <div className="item-quantity">
                  <button
                    onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                    className="qty-btn"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      onUpdateQuantity(item._id, parseInt(e.target.value) || 1)
                    }
                    className="qty-input"
                  />
                  <button
                    onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>

                <p className="item-subtotal">
                  KES {(item.price * item.quantity).toLocaleString()}
                </p>

                <button
                  onClick={() => onRemove(item._id)}
                  className="btn-remove"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>
              Total: KES {totalPrice.toLocaleString()}
            </h3>
            <button className="btn-checkout">Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;

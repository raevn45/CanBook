import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useCart } from "../../context/cartcontext";

export default function CartPage() {
  const { cart, total, updateQuantity, removeFromCart } = useCart();

  if (!cart.length) {
    return (
      <div className="empty-page">
        <div className="pixel-label">canbook / cart</div>
        <h1>your cart is empty.</h1>
        <p>go find something delicious.</p>
        <Link to="/menu" className="pixel-button">
          browse menu →
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <div className="pixel-label">canbook / cart</div>
          <h1>your order.</h1>
        </div>
      </div>

      <div className="cart-layout">
        <div className="cart-list">
          {cart.map((item) => (
            <motion.div key={item.item_id} className="cart-item" layout>
              <div>
                <h2>{item.item_name}</h2>
                <p>AED {Number(item.price).toFixed(2)}</p>
              </div>

              <div className="quantity">
                <button
                  onClick={() =>
                    updateQuantity(item.item_id, item.quantity - 1)
                  }
                >
                  −
                </button>
                <strong>{item.quantity}</strong>
                <button
                  onClick={() =>
                    updateQuantity(item.item_id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>

              <button
                className="remove"
                onClick={() => removeFromCart(item.item_id)}
              >
                remove
              </button>
            </motion.div>
          ))}
        </div>

        <div className="checkout-box">
          <span>total</span>
          <strong>AED {total.toFixed(2)}</strong>
          <Link to="/checkout" className="pixel-button">
            checkout →
          </Link>
        </div>
      </div>
    </div>
  );
}

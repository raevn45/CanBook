import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cartcontext";
import { orderapi } from "../../api";
import { pickupslots } from "../../constants";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();

  const [pickupSlot, setPickupSlot] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    setError("");

    if (!pickupSlot) {
      setError("choose a pickup slot.");
      return;
    }

    setLoading(true);

    try {
      const data = await orderapi.create({
        pickup_slot: pickupSlot,
        items: cart.map((item) => ({
          item_id: item.item_id,
          quantity: item.quantity,
        })),
      });

      clearCart();
      navigate(`/success?id=${data.order_id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-content">
        <div className="pixel-label">canbook / checkout</div>
        <h1>almost there.</h1>
        <p className="checkout-subtitle">
          choose when you want to collect your order.
        </p>

        <div className="pickup-options">
          {pickupslots.map((slot) => (
            <button
              key={slot}
              className={pickupSlot === slot ? "pickup active" : "pickup"}
              onClick={() => setPickupSlot(slot)}
            >
              <span>{slot}</span>
              <small>pickup slot</small>
            </button>
          ))}
        </div>

        {error && <div className="error-box">{error}</div>}

        <div className="final-total">
          <span>total</span>
          <strong>AED {total.toFixed(2)}</strong>
        </div>

        <button
          className="pixel-button"
          onClick={placeOrder}
          disabled={loading || !cart.length}
        >
          {loading ? "placing order..." : "place order →"}
        </button>
      </div>
    </div>
  );
}

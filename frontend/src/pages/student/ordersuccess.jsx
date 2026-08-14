import React from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight, Clock } from "lucide-react";

export default function OrderSuccess() {
  const order = JSON.parse(
    localStorage.getItem("canbook_current_order") || "null"
  );

  const orderNumber = order?.id || "CANBOOK";
  const total = Number(order?.total || 0);

  return (
    <main className="success-page">
      <div className="success-decoration success-decoration-one" />
      <div className="success-decoration success-decoration-two" />

      <section className="success-card">
        <div className="success-check">
          <Check size={34} strokeWidth={3} />
        </div>

        <p className="eyebrow">CANBOOK / ORDER CONFIRMED</p>

        <h1>
          You're
          <br />
          <span>all set.</span>
        </h1>

        <p className="success-message">
          Your order has been sent to the canteen. We'll have it ready for
          pickup.
        </p>

        <div className="success-order-number">
          <span>ORDER NUMBER</span>
          <strong>#{orderNumber}</strong>
        </div>

        {order?.items?.length > 0 && (
          <div className="success-items">
            {order.items.map((item) => (
              <div className="success-item" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <span>× {item.quantity}</span>
                </div>

                <strong>
                  AED{" "}
                  {(
                    Number(item.price) * Number(item.quantity)
                  ).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>
        )}

        <div className="success-total">
          <span>Total</span>
          <strong>AED {total.toFixed(2)}</strong>
        </div>

        <div className="success-pickup">
          <Clock size={20} />

          <div>
            <strong>Pickup at the canteen</strong>
            <p>You'll see updates when your order is ready.</p>
          </div>
        </div>

        <div className="success-actions">
          <Link to="/myorders" className="btn-primary">
            View my orders
            <ArrowRight size={18} />
          </Link>

          <Link to="/register" className="btn-secondary">
            Order something else
          </Link>
        </div>
      </section>
    </main>
  );
}
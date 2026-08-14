import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle2, Package } from "lucide-react";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(
      localStorage.getItem("canbook_orders") || "[]"
    );

    setOrders(savedOrders);
  }, []);

  return (
    <main className="orders-page">
      <div className="orders-page-inner">
        <header className="orders-header">
          <Link to="/" className="back-link">
            <ArrowLeft size={18} />
            Back
          </Link>

          <div>
            <p className="eyebrow">CANBOOK / STUDENT</p>
            <h1>My orders.</h1>
            <p>Everything you've ordered, all in one place.</p>
          </div>
        </header>

        {orders.length === 0 ? (
          <section className="orders-empty">
            <div className="orders-empty-icon">
              <Package size={30} />
            </div>

            <h2>No orders yet.</h2>

            <p>
              You haven't placed an order yet. Hungry? Let's fix that.
            </p>

            <Link to="/register" className="btn-primary">
              Start ordering
            </Link>
          </section>
        ) : (
          <section className="orders-list">
            {orders.map((order, index) => {
              const status = order.status || "pending";

              return (
                <article
                  className="order-card"
                  key={order.id || index}
                >
                  <div className="order-card-top">
                    <div>
                      <span className="order-label">ORDER</span>
                      <h2>#{order.id || "CANBOOK"}</h2>
                    </div>

                    <div className={`order-status ${status}`}>
                      {status === "ready" ? (
                        <CheckCircle2 size={17} />
                      ) : (
                        <Clock size={17} />
                      )}

                      <span>
                        {status === "ready"
                          ? "Ready for pickup"
                          : status === "completed"
                          ? "Completed"
                          : "Preparing"}
                      </span>
                    </div>
                  </div>

                  <div className="order-items">
                    {(order.items || []).map((item) => (
                      <div className="order-item" key={item.id}>
                        <div>
                          <strong>{item.name}</strong>
                          <span>× {item.quantity}</span>
                        </div>

                        <strong>
                          AED{" "}
                          {(
                            Number(item.price) *
                            Number(item.quantity)
                          ).toFixed(2)}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <div className="order-card-bottom">
                    <div>
                      <span>Total</span>
                      <strong>
                        AED {Number(order.total || 0).toFixed(2)}
                      </strong>
                    </div>

                    <span className="order-time">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString(
                            "en-AE",
                            {
                              day: "numeric",
                              month: "short",
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          )
                        : "Recent order"}
                    </span>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, CalendarDays, Clock3, Package, RefreshCw } from "lucide-react";
import { orderapi } from "../../api";

const statusCopy = {
  pending: "Order received",
  preparing: "Being prepared",
  ready: "Ready for pickup",
  completed: "Completed",
};

function formatPickup(slot) {
  if (!slot) return "Pickup time not set";
  const [date, time] = String(slot).split(" ");
  if (!date) return slot;
  const parsed = new Date(`${date}T${time || "00:00"}`);
  if (Number.isNaN(parsed.getTime())) return slot;
  return `${parsed.toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" })}${time ? ` · ${time}` : ""}`;
}

function formatCreated(value) {
  if (!value) return "Recently placed";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently placed";
  return date.toLocaleString("en-AE", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await orderapi.getall();
      const summaries = data.orders || [];
      const detailed = await Promise.all(
        summaries.map(async (order) => {
          try {
            return await orderapi.getone(order.order_id);
          } catch {
            return { ...order, items: [] };
          }
        })
      );
      setOrders(detailed);
    } catch (err) {
      setError(err.message || "Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <main className="app-page orders-page-new">
      <div className="orders-page-inner">
        <header className="orders-header-new">
          <div>
            <span className="micro-label">CANBOOK / STUDENT</span>
            <h1>My <em>orders.</em></h1>
            <p>Your real order history, pickup details and current status.</p>
          </div>
          <button type="button" className="orders-refresh" onClick={loadOrders} disabled={loading}>
            <RefreshCw size={16} className={loading ? "spin" : ""} />
            Refresh
          </button>
        </header>

        {error && (
          <section className="orders-state orders-error">
            <Package size={28} />
            <h2>We couldn't load your orders.</h2>
            <p>{error}</p>
            <button type="button" className="btn-primary" onClick={loadOrders}>Try again</button>
          </section>
        )}

        {!error && loading && (
          <section className="orders-state">
            <RefreshCw size={28} className="spin" />
            <h2>Loading your orders…</h2>
            <p>Getting the latest status from the canteen.</p>
          </section>
        )}

        {!error && !loading && orders.length === 0 && (
          <section className="orders-state">
            <div className="orders-empty-icon"><Package size={30} /></div>
            <h2>No orders yet.</h2>
            <p>Your orders will appear here as soon as you place one.</p>
            <Link to="/menu" className="btn-primary">Browse the menu <ArrowUpRight size={17} /></Link>
          </section>
        )}

        {!error && !loading && orders.length > 0 && (
          <section className="orders-list-new">
            {orders.map((order) => {
              const status = order.status || "pending";
              const items = order.items || [];
              return (
                <article className="order-card-new" key={order.order_id}>
                  <div className="order-card-new-head">
                    <div>
                      <span className="order-label">ORDER #{order.order_id}</span>
                      <strong>{formatCreated(order.created_at)}</strong>
                    </div>
                    <span className={`order-status-new ${status}`}>{statusCopy[status] || status}</span>
                  </div>

                  <div className="order-pickup-row">
                    <div><CalendarDays size={17} /><span>Pickup</span><strong>{formatPickup(order.pickup_slot)}</strong></div>
                    <div><Clock3 size={17} /><span>Status</span><strong>{statusCopy[status] || status}</strong></div>
                  </div>

                  <div className="order-items-new">
                    {items.length ? items.map((item, index) => (
                      <div className="order-item-new" key={`${item.item_id}-${index}`}>
                        <div><strong>{item.item_name || "Menu item"}</strong><span>× {item.quantity}</span></div>
                        <strong>AED {(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}</strong>
                      </div>
                    )) : (
                      <div className="order-item-new"><span>Order items</span><span>Details unavailable</span></div>
                    )}
                  </div>

                  <div className="order-card-new-foot">
                    <span>Total</span>
                    <strong>AED {Number(order.total || 0).toFixed(2)}</strong>
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

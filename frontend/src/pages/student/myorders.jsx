import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, CalendarDays, CheckCircle2, Clock, Package, RefreshCw } from "lucide-react";
import { orderapi } from "../../api";

const statusCopy = {
  Pending: "Order received",
  Preparing: "Being prepared",
  Ready: "Ready for pickup",
  Collected: "Collected",
  Cancelled: "Cancelled",
};

function formatPickup(slot) {
  if (!slot) return "Pickup time not set";
  const [date, time] = String(slot).split(" ");
  const parsed = new Date(`${date}T${time || "00:00"}`);
  if (Number.isNaN(parsed.getTime())) return slot;
  return `${parsed.toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" })}${time ? ` · ${time}` : ""}`;
}

function formatCreated(value) {
  if (!value) return "Recently placed";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently placed";
  return date.toLocaleString("en-AE", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
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
      const detailed = await Promise.all((data.orders || []).map(async (order) => {
        try { return await orderapi.getone(order.order_id); }
        catch { return { ...order, items: [] }; }
      }));
      setOrders(detailed);
    } catch (err) {
      setError(err.message || "Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  return (
    <main className="orders-page">
      <div className="orders-page-inner">
        <header className="orders-header">
          <div>
            <p className="eyebrow">CANBOOK / STUDENT</p>
            <h1>My orders.</h1>
            <p>Your real order history, pickup details and current status.</p>
          </div>
          <button type="button" className="btn-secondary" onClick={loadOrders} disabled={loading}>
            <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh
          </button>
        </header>

        {error && <section className="orders-empty"><Package size={30} /><h2>We couldn't load your orders.</h2><p>{error}</p><button type="button" className="btn-primary" onClick={loadOrders}>Try again</button></section>}
        {!error && loading && <section className="orders-empty"><RefreshCw size={30} className="spin" /><h2>Loading your orders…</h2><p>Getting the latest status from the canteen.</p></section>}
        {!error && !loading && orders.length === 0 && <section className="orders-empty"><div className="orders-empty-icon"><Package size={30} /></div><h2>No orders yet.</h2><p>Your orders will appear here as soon as you place one.</p><Link to="/menu" className="btn-primary">Browse the menu <ArrowUpRight size={17} /></Link></section>}

        {!error && !loading && orders.length > 0 && (
          <section className="orders-list">
            {orders.map((order) => {
              const status = order.status || "Pending";
              const items = order.items || [];
              return (
                <article className="order-card" key={order.order_id}>
                  <div className="order-card-top">
                    <div><span className="order-label">ORDER #{order.order_id}</span><h2>{formatCreated(order.created_at)}</h2></div>
                    <div className={`order-status ${status.toLowerCase()}`}>
                      {status === "Ready" || status === "Collected" ? <CheckCircle2 size={17} /> : <Clock size={17} />}
                      <span>{statusCopy[status] || status}</span>
                    </div>
                  </div>
                  <div className="order-pickup"><CalendarDays size={17} /><div><span>Pickup</span><strong>{formatPickup(order.pickup_slot)}</strong></div></div>
                  <div className="order-items">
                    {items.length ? items.map((item, index) => <div className="order-item" key={`${item.item_id}-${index}`}><div><strong>{item.item_name || "Menu item"}</strong><span>× {item.quantity}</span></div><strong>AED {(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}</strong></div>) : <div className="order-item"><span>Order items unavailable</span></div>}
                  </div>
                  <div className="order-card-bottom"><div><span>Total</span><strong>AED {Number(order.total_amount || order.total || 0).toFixed(2)}</strong></div><span className="order-time">Order #{order.order_id}</span></div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

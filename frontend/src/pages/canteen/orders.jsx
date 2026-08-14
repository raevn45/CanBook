import { useEffect, useState } from "react";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { canteenapi } from "../../api";

const STATUSES = ["Pending", "Preparing", "Ready", "Collected", "Cancelled"];

export default function Orders() {
  const [data, setData] = useState({ orders: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      setData(await canteenapi.dashboard());
    } catch (err) {
      setError(err.message || "Unable to load today's orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    setError("");
    try {
      await canteenapi.updateorder(id, status);
      await loadOrders();
    } catch (err) {
      setError(err.message || "Unable to update this order.");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <main className="app-page canteen-orders-page">
      <header className="canteen-section-head">
        <div>
          <span className="micro-label">CANBOOK / CANTEEN</span>
          <h1>Today's <em>queue.</em></h1>
          <p>Every order is live. Update the status as food moves from received to collected.</p>
        </div>
        <button type="button" className="giant-submit inline-submit" onClick={loadOrders} disabled={loading}>
          <span>Refresh queue</span>
          <RefreshCw size={18} className={loading ? "spin" : ""} />
        </button>
      </header>

      {error && <div className="form-error menu-error">{error}</div>}

      {!loading && !error && data.orders.length === 0 && (
        <section className="orders-state">
          <span className="micro-label">NO ORDERS YET</span>
          <h2>The queue is clear.</h2>
          <p>New student orders will appear here automatically.</p>
        </section>
      )}

      <section className="canteen-order-list">
        {data.orders.map((order, index) => (
          <article className="canteen-order-row" key={order.order_id}>
            <div className="canteen-order-number">{String(index + 1).padStart(2, "0")}</div>
            <div className="canteen-order-main">
              <span>ORDER #{order.order_id}</span>
              <h2>{order.name}</h2>
              <small>{order.pickup_slot || "Pickup time not set"}</small>
            </div>
            <div className="canteen-order-total">
              <span>TOTAL</span>
              <strong>AED {Number(order.total_amount || 0).toFixed(2)}</strong>
            </div>
            <select
              value={order.status}
              disabled={updating === order.order_id}
              onChange={(event) => updateStatus(order.order_id, event.target.value)}
              aria-label={`Status for order ${order.order_id}`}
            >
              {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <Link to={`/canteen/orders/${order.order_id}`} className="canteen-order-open" aria-label={`Open order ${order.order_id}`}>
              <ArrowUpRight size={20} />
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}

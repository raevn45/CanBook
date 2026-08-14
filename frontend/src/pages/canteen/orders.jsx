import { useEffect, useState } from "react";
import { ArrowUpRight, CheckCircle2, Clock3, RefreshCw, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";
import { canteenapi } from "../../api";

const STATUSES = ["Pending", "Preparing", "Ready", "Collected", "Cancelled"];
const statusClass = (status) => String(status || "Pending").toLowerCase();

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

  useEffect(() => { loadOrders(); }, []);

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
      <header className="canteen-hero-head queue-head">
        <div>
          <span className="micro-label"><UtensilsCrossed size={13} /> CANBOOK / STAFF / LIVE QUEUE</span>
          <h1>Today's <em>orders.</em></h1>
          <p>Move each order through the kitchen. Pickup details stay visible while the queue changes.</p>
        </div>
        <button type="button" className="dashboard-refresh" onClick={loadOrders} disabled={loading}><RefreshCw size={17} className={loading ? "spin" : ""} /> {loading ? "Syncing" : "Refresh queue"}</button>
      </header>

      {error && <section className="staff-error"><strong>Queue couldn't load.</strong><span>{error}</span><button onClick={loadOrders}>Try again</button></section>}

      {!loading && !error && data.orders.length === 0 && <section className="staff-empty-hero"><div><span>QUEUE / CLEAR</span><h2>Nothing waiting.<br /><em>For now.</em></h2><p>New student orders will slide into this board as they arrive.</p></div><div className="empty-queue-mark"><CheckCircle2 size={44} /></div></section>}

      {!error && data.orders.length > 0 && (
        <section className="queue-board">
          <div className="queue-board-head"><span>{data.orders.length} active order{data.orders.length === 1 ? "" : "s"}</span><span>LIVE CANTEEN BOARD</span></div>
          <div className="queue-grid">
            {data.orders.map((order, index) => (
              <article className={`queue-card status-${statusClass(order.status)}`} key={order.order_id}>
                <div className="queue-card-top"><span className="queue-number">{String(index + 1).padStart(2, "0")}</span><span className={`queue-status ${statusClass(order.status)}`}><Clock3 size={13} /> {order.status}</span></div>
                <div className="queue-card-title"><span>ORDER #{order.order_id}</span><h2>{order.name}</h2></div>
                <div className="queue-pickup"><small>PICKUP</small><strong>{order.pickup_slot || "Pickup time not set"}</strong></div>
                <div className="queue-money"><span>TOTAL</span><strong>AED {Number(order.total_amount || 0).toFixed(2)}</strong></div>
                <div className="queue-actions"><label><span>Move status</span><select value={order.status} disabled={updating === order.order_id} onChange={(event) => updateStatus(order.order_id, event.target.value)} aria-label={`Status for order ${order.order_id}`}>{STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select></label><Link to={`/canteen/orders/${order.order_id}`} className="queue-open">Open order <ArrowUpRight size={16} /></Link></div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

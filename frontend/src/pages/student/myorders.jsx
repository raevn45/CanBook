import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, CalendarDays, CheckCircle2, Clock3, Package, RefreshCw, ShoppingBag } from "lucide-react";
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
  const raw = String(slot).trim();
  const match = raw.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})(?:\s*-\s*(\d{2}:\d{2}))?$/);
  if (match) {
    const [, datePart, start, end] = match;
    const date = new Date(`${datePart}T${start}:00`);
    const formattedDate = Number.isNaN(date.getTime()) ? datePart : date.toLocaleDateString("en-AE", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    return `${formattedDate} · ${start}${end ? ` – ${end}` : ""}`;
  }
  return raw;
}

function formatCreated(value) {
  if (!value) return "Recently placed";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently placed";
  return date.toLocaleString("en-AE", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

function itemPrice(item) {
  return Number(item.price_at_order ?? item.price ?? 0);
}

function itemTotal(item) {
  return itemPrice(item) * Number(item.quantity || 0);
}

function statusIcon(status) {
  if (status === "Ready" || status === "Collected") return <CheckCircle2 size={17} />;
  return <Clock3 size={17} />;
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
    <main className="app-page orders-page">
      <div className="orders-page-inner">
        <header className="orders-header">
          <div className="orders-title-block">
            <span className="micro-label">CANBOOK / STUDENT / ORDER HISTORY</span>
            <h1>My <em>orders.</em></h1>
            <p>Every lunch, every pickup window, all in one place.</p>
          </div>
          <button type="button" className="orders-refresh-button" onClick={loadOrders} disabled={loading}>
            <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh
          </button>
        </header>

        {error && <section className="orders-state orders-state-error"><div className="orders-state-icon"><Package size={28} /></div><span className="micro-label">COULDN'T LOAD ORDERS</span><h2>Something went wrong.</h2><p>{error}</p><button type="button" className="giant-submit inline-submit" onClick={loadOrders}>Try again <ArrowUpRight size={18} /></button></section>}
        {!error && loading && <section className="orders-state"><div className="orders-loading-mark"><RefreshCw size={30} className="spin" /></div><span className="micro-label">SYNCING WITH THE CANTEEN</span><h2>Loading your orders…</h2><p>Getting the latest order status and pickup details.</p></section>}
        {!error && !loading && orders.length === 0 && <section className="orders-state orders-state-empty"><div className="orders-state-icon"><ShoppingBag size={30} /></div><span className="micro-label">NO ORDERS YET</span><h2>Your lunch starts here.</h2><p>Your orders will appear here as soon as you place one.</p><Link to="/menu" className="giant-submit inline-submit">Browse the menu <ArrowUpRight size={18} /></Link></section>}

        {!error && !loading && orders.length > 0 && (
          <section className="orders-list">
            <div className="orders-list-meta"><span>{orders.length} order{orders.length === 1 ? "" : "s"}</span><span>LIVE HISTORY</span></div>
            {orders.map((order, index) => {
              const status = order.status || "Pending";
              const items = order.items || [];
              const total = Number(order.total_amount ?? order.total ?? 0);
              return (
                <article className="order-card" key={order.order_id}>
                  <div className="order-card-index">{String(index + 1).padStart(2, "0")}</div>
                  <div className="order-card-main">
                    <div className="order-card-top">
                      <div><span className="order-label">ORDER #{order.order_id}</span><h2>{formatCreated(order.created_at || order.order_date)}</h2></div>
                      <div className={`order-status ${status.toLowerCase()}`}>{statusIcon(status)}<span>{statusCopy[status] || status}</span></div>
                    </div>
                    <div className="order-pickup"><div className="order-pickup-icon"><CalendarDays size={19} /></div><div><span>Pickup</span><strong>{formatPickup(order.pickup_slot)}</strong></div></div>
                    <div className="order-items">
                      {items.length ? items.map((item, itemIndex) => <div className="order-item" key={`${item.item_id || item.item_name}-${itemIndex}`}><div className="order-item-copy"><strong>{item.item_name || "Menu item"}</strong><span>× {item.quantity}</span></div><strong>AED {itemTotal(item).toFixed(2)}</strong></div>) : <div className="order-item order-item-unavailable"><span>Order item details unavailable</span></div>}
                    </div>
                    <div className="order-card-bottom"><div className="order-total"><span>Total</span><strong>AED {total.toFixed(2)}</strong></div><span className="order-reference">CANBOOK · #{order.order_id}</span></div>
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

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, CalendarDays, ChevronDown, Clock3, Package, RefreshCw, ShoppingBag, Trash2, X } from "lucide-react";
import { orderapi } from "../../api";

const statusCopy = { Pending: "Order received", Preparing: "Being prepared", Ready: "Ready for pickup", Collected: "Collected", Cancelled: "Cancelled" };
const statusProgress = { Pending: 1, Preparing: 2, Ready: 3, Collected: 4, Cancelled: 1 };

function formatPickup(slot) {
  if (!slot) return "Pickup time not set";
  const raw = String(slot).trim();
  const match = raw.match(/^(\d{4}-\d{2}-\d{2})\s*\|?\s*(\d{2}:\d{2})(?:\s*-\s*(\d{2}:\d{2}))?$/);
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

function itemTotal(item) { return Number(item.price_at_order ?? item.price ?? 0) * Number(item.quantity || 0); }

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await orderapi.getall();
      const detailed = await Promise.all((data.orders || []).map(async (order) => {
        try { return await orderapi.getone(order.order_id); } catch { return { ...order, items: [] }; }
      }));
      setOrders(detailed);
      if (detailed[0]) setExpanded((current) => current ?? detailed[0].order_id);
    } catch (err) { setError(err.message || "Unable to load your orders."); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadOrders(); }, []);

  const removeOrder = async (orderId) => {
    setDeleting(orderId);
    setError("");
    try {
      await orderapi.remove(orderId);
      setOrders((current) => current.filter((order) => order.order_id !== orderId));
      setConfirmDelete(null);
      setExpanded((current) => current === orderId ? null : current);
    } catch (err) {
      setError(err.message || "Unable to delete this order.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <main className="app-page orders-page">
      <div className="orders-page-inner">
        <header className="orders-header">
          <div className="orders-title-block"><span className="micro-label">CANBOOK / STUDENT / ORDER HISTORY</span><h1>My <em>orders.</em></h1><p>Every lunch, every pickup window, all in one place.</p></div>
          <motion.button type="button" className="orders-refresh-button" onClick={loadOrders} disabled={loading} whileHover={{ y: -3 }} whileTap={{ scale: .96 }}><RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh</motion.button>
        </header>

        {error && <motion.section className="orders-state orders-state-error" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}><div className="orders-state-icon"><Package size={28} /></div><span className="micro-label">COULDN'T LOAD ORDERS</span><h2>Something went wrong.</h2><p>{error}</p><button type="button" className="giant-submit inline-submit" onClick={loadOrders}>Try again <ArrowUpRight size={18} /></button></motion.section>}
        {!error && loading && <section className="orders-state"><div className="orders-loading-mark"><RefreshCw size={30} className="spin" /></div><span className="micro-label">SYNCING WITH THE CANTEEN</span><h2>Loading your orders…</h2><p>Getting the latest order status and pickup details.</p></section>}
        {!error && !loading && orders.length === 0 && <section className="orders-state orders-state-empty"><div className="orders-state-icon"><ShoppingBag size={30} /></div><span className="micro-label">NO ORDERS YET</span><h2>Your lunch starts here.</h2><p>Your orders will appear here as soon as you place one.</p><Link to="/menu" className="giant-submit inline-submit">Browse the menu <ArrowUpRight size={18} /></Link></section>}

        {!error && !loading && orders.length > 0 && (
          <section className="orders-list">
            <div className="orders-list-meta"><span>{orders.length} order{orders.length === 1 ? "" : "s"}</span><span>LIVE HISTORY</span></div>
            {orders.map((order, index) => {
              const status = order.status || "Pending";
              const items = order.items || [];
              const total = Number(order.total_amount ?? order.total ?? 0);
              const progress = statusProgress[status] || 1;
              const isOpen = expanded === order.order_id;
              const isConfirming = confirmDelete === order.order_id;
              return (
                <motion.article layout className={`order-card order-card-${status.toLowerCase()}`} key={order.order_id} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18, scale: .96 }} transition={{ delay: index * .06, type: "spring", stiffness: 220, damping: 22 }}>
                  <div className="order-card-index">{String(index + 1).padStart(2, "0")}</div>
                  <div className="order-card-main">
                    <div className="order-card-top">
                      <div><span className="order-label">ORDER #{order.order_id}</span><h2>{formatCreated(order.created_at || order.order_date)}</h2></div>
                      <div className="order-card-actions">
                        <AnimatePresence mode="wait" initial={false}>
                          {isConfirming ? <motion.div className="order-delete-confirm" initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .94 }}><span>Delete this order?</span><button type="button" onClick={() => removeOrder(order.order_id)} disabled={deleting === order.order_id}>{deleting === order.order_id ? "Deleting…" : "Delete"}</button><button type="button" onClick={() => setConfirmDelete(null)} aria-label="Cancel delete"><X size={15} /></button></motion.div> : <motion.button type="button" className="order-delete-button" onClick={() => setConfirmDelete(order.order_id)} whileHover={{ y: -2 }} whileTap={{ scale: .94 }} aria-label={`Delete order ${order.order_id}`}><Trash2 size={16} /></motion.button>}
                        </AnimatePresence>
                        <motion.div className={`order-status ${status.toLowerCase()}`} whileTap={{ scale: .96 }}><Clock3 size={17} /><span>{statusCopy[status] || status}</span></motion.div>
                      </div>
                    </div>
                    <div className="order-progress-rail"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(progress, 4) / 4 * 100}%` }} transition={{ duration: .7, delay: .15 }} /><span className={progress >= 1 ? "on" : ""}>Received</span><span className={progress >= 2 ? "on" : ""}>Preparing</span><span className={progress >= 3 ? "on" : ""}>Ready</span><span className={progress >= 4 ? "on" : ""}>Collected</span></div>
                    <div className="order-pickup"><div className="order-pickup-icon"><CalendarDays size={19} /></div><div><span>Pickup</span><strong>{formatPickup(order.pickup_slot)}</strong></div></div>
                    <motion.button className="order-expand" onClick={() => setExpanded(isOpen ? null : order.order_id)} whileTap={{ scale: .98 }}><span>{items.length} item{items.length === 1 ? "" : "s"} in this order</span><motion.span animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDown size={17} /></motion.span></motion.button>
                    <AnimatePresence initial={false}>{isOpen && <motion.div className="order-items" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .3 }}>
                      {items.length ? items.map((item, itemIndex) => <div className="order-item" key={`${item.item_id || item.item_name}-${itemIndex}`}><div className="order-item-copy"><strong>{item.item_name || "Menu item"}</strong><span>× {item.quantity}</span></div><strong>AED {itemTotal(item).toFixed(2)}</strong></div>) : <div className="order-item"><span>Order item details unavailable</span></div>}
                    </motion.div>}</AnimatePresence>
                    <div className="order-card-bottom"><div className="order-total"><span>Total</span><strong>AED {total.toFixed(2)}</strong></div><span className="order-reference">CANBOOK · #{order.order_id}</span></div>
                  </div>
                </motion.article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

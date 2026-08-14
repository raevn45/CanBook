import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, BarChart3, ChefHat, ClipboardList, RefreshCw, ShoppingBag, Sparkles, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";
import { canteenapi } from "../../api";

const statusClass = (status) => String(status || "Pending").toLowerCase();
const statusRank = { Pending: 0, Preparing: 1, Ready: 2, Collected: 3, Cancelled: -1 };

export default function CanteenDashboard() {
  const [data, setData] = useState({ total_orders: 0, revenue: 0, demand: [], orders: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const load = async () => {
    setLoading(true); setError("");
    try { setData(await canteenapi.dashboard()); }
    catch (err) { setError(err.message || "Unable to load the canteen dashboard."); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const activeOrders = useMemo(() => data.orders.filter((order) => order.status !== "Collected" && order.status !== "Cancelled"), [data.orders]);
  const top = data.demand[0];

  return (
    <main className="app-page canteen-dashboard-page">
      <header className="canteen-hero-head">
        <div><span className="micro-label"><Sparkles size={13} /> CANBOOK / STAFF CONTROL CENTER</span><h1>Run the<br /><em>canteen.</em></h1><p>Incoming orders, live demand and menu control — arranged like a command board, not a spreadsheet.</p></div>
        <motion.button type="button" className="dashboard-refresh" onClick={load} disabled={loading} whileHover={{ y: -3 }} whileTap={{ scale: .96 }}><RefreshCw size={17} className={loading ? "spin" : ""} /> {loading ? "Syncing" : "Refresh"}</motion.button>
      </header>

      {error && <section className="staff-error"><strong>Dashboard couldn't connect.</strong><span>{error}</span><button onClick={load}>Try again</button></section>}

      <section className="staff-command-grid">
        <motion.div className="staff-command-card staff-command-primary" whileHover={{ y: -8 }} whileTap={{ scale: .99 }}>
          <Link to="/canteen/orders" className="staff-card-hit" aria-label="Open live order queue" />
          <div className="staff-command-icon"><ClipboardList size={24} /></div><span>01 / LIVE QUEUE</span><h2>{activeOrders.length}<br /><em>orders moving.</em></h2><p>Open the queue, change statuses and keep pickup details visible.</p><ArrowUpRight className="staff-command-arrow" size={27} />
        </motion.div>
        <motion.div className="staff-command-card" whileHover={{ y: -8 }} whileTap={{ scale: .99 }}>
          <Link to="/canteen/menu" className="staff-card-hit" aria-label="Open menu control" />
          <div className="staff-command-icon"><UtensilsCrossed size={22} /></div><span>02 / MENU CONTROL</span><h2>{data.demand.length || "09"}<br /><em>items tracked.</em></h2><p>Add food or pull it from student ordering without deleting order history.</p><ArrowUpRight className="staff-command-arrow" size={24} />
        </motion.div>
        <motion.div className="staff-command-card staff-command-dark" whileHover={{ y: -8 }} whileTap={{ scale: .99 }}>
          <Link to="/canteen/analytics" className="staff-card-hit" aria-label="Open analytics" />
          <div className="staff-command-icon"><BarChart3 size={22} /></div><span>03 / DATABASE ANALYTICS</span><h2>{top?.quantity || 0}<br /><em>top item units.</em></h2><p>See what students actually order and how many students choose each item.</p><ArrowUpRight className="staff-command-arrow" size={24} />
        </motion.div>
      </section>

      <section className="staff-stat-strip">
        <div><span><ShoppingBag size={14} /> TODAY'S ORDERS</span><strong>{data.total_orders}</strong></div>
        <div><span><ChefHat size={14} /> EXPECTED REVENUE</span><strong>AED {Number(data.revenue || 0).toFixed(0)}</strong></div>
        <div><span>TOP ITEM</span><strong>{top?.item_name || "—"}</strong></div>
      </section>

      <section className="staff-dashboard-grid">
        <article className="staff-panel demand-live-panel">
          <div className="staff-panel-head"><div><span>LIVE DEMAND</span><h2>What's moving?</h2></div><Link to="/canteen/analytics">Analytics <ArrowUpRight size={14} /></Link></div>
          <div className="staff-demand-list">
            {data.demand.length ? data.demand.slice(0, 6).map((item, index) => {
              const max = Number(data.demand[0]?.quantity || 1);
              return <motion.div key={item.item_name} className="staff-demand-item" initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .06 }}><div><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.item_name}</strong></div><b>{item.quantity}</b><div className="staff-demand-bar"><motion.i initial={{ width: 0 }} animate={{ width: `${Math.max(5, Number(item.quantity) / max * 100)}%` }} transition={{ duration: .7, delay: .12 + index * .05 }} /></div></motion.div>;
            }) : <div className="staff-empty"><ChefHat size={28} /><span>No orders yet today.</span></div>}
          </div>
        </article>

        <article className="staff-panel recent-staff-panel">
          <div className="staff-panel-head"><div><span>RECENT ORDERS</span><h2>Keep it moving.</h2></div><Link to="/canteen/orders">All orders <ArrowUpRight size={14} /></Link></div>
          <div className="staff-recent-list">
            {data.orders.length ? data.orders.slice(0, 6).map((order, index) => <motion.button type="button" className="staff-recent-order staff-recent-button" key={order.order_id} onClick={() => setSelectedOrder(order)} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .06 }}><span className="staff-order-number">#{order.order_id}</span><div><strong>{order.name}</strong><small>{order.pickup_slot || "Pickup not set"}</small></div><span className={`staff-status ${statusClass(order.status)}`}>{order.status}</span><ArrowUpRight size={17} /></motion.button>) : <div className="staff-empty">The queue is clear. New student orders will appear here.</div>}
          </div>
        </article>
      </section>

      {selectedOrder && <motion.div className="staff-preview-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedOrder(null); }}>
        <motion.aside className="staff-preview-panel" initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 24 }}>
          <button className="preview-close" onClick={() => setSelectedOrder(null)} aria-label="Close preview">×</button>
          <span className="micro-label">ORDER PREVIEW</span><strong className="preview-order-id">#{selectedOrder.order_id}</strong><h2>{selectedOrder.name}</h2>
          <div className="preview-pickup"><span>PICKUP</span><b>{selectedOrder.pickup_slot || "Not set"}</b></div>
          <div className="preview-status-row"><span>STATUS</span><b>{selectedOrder.status}</b></div>
          <div className="preview-progress">{["Pending", "Preparing", "Ready", "Collected"].map((status, index) => <div className={statusRank[selectedOrder.status] >= index ? "done" : ""} key={status}><i />{status}</div>)}</div>
          <Link to={`/canteen/orders/${selectedOrder.order_id}`} className="giant-submit">Open full order <ArrowUpRight size={20} /></Link>
        </motion.aside>
      </motion.div>}
    </main>
  );
}

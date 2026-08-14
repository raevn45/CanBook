import { useEffect, useState } from "react";
import { ArrowUpRight, BarChart3, ChefHat, ClipboardList, RefreshCw, ShoppingBag, Sparkles, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { canteenapi } from "../../api";

const statusClass = (status) => String(status || "Pending").toLowerCase();

export default function CanteenDashboard() {
  const [data, setData] = useState({ total_orders: 0, revenue: 0, demand: [], orders: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setData(await canteenapi.dashboard());
    } catch (err) {
      setError(err.message || "Unable to load the canteen dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <main className="app-page canteen-dashboard-page">
      <header className="canteen-hero-head">
        <div>
          <span className="micro-label"><Sparkles size={13} /> CANBOOK / STAFF CONTROL CENTER</span>
          <h1>Run the<br /><em>canteen.</em></h1>
          <p>Incoming orders, live demand and menu control — all in one place.</p>
        </div>
        <button type="button" className="dashboard-refresh" onClick={load} disabled={loading}><RefreshCw size={17} className={loading ? "spin" : ""} /> {loading ? "Syncing" : "Refresh"}</button>
      </header>

      {error && <section className="staff-error"><strong>Dashboard couldn't connect.</strong><span>{error}</span><button onClick={load}>Try again</button></section>}

      <section className="staff-command-grid">
        <Link to="/canteen/orders" className="staff-command-card staff-command-primary">
          <div className="staff-command-icon"><ClipboardList size={24} /></div>
          <span>01 / LIVE QUEUE</span>
          <h2>Incoming<br /><em>orders.</em></h2>
          <p>Open the queue, change statuses and see pickup details.</p>
          <ArrowUpRight className="staff-command-arrow" size={27} />
        </Link>
        <Link to="/canteen/menu" className="staff-command-card">
          <div className="staff-command-icon"><UtensilsCrossed size={22} /></div>
          <span>02 / MENU CONTROL</span>
          <h2>What's<br /><em>on?</em></h2>
          <p>Add items or pull them from student ordering without deleting history.</p>
          <ArrowUpRight className="staff-command-arrow" size={24} />
        </Link>
        <Link to="/canteen/analytics" className="staff-command-card staff-command-dark">
          <div className="staff-command-icon"><BarChart3 size={22} /></div>
          <span>03 / DATABASE ANALYTICS</span>
          <h2>Know the<br /><em>demand.</em></h2>
          <p>See what students actually order and how many students choose each item.</p>
          <ArrowUpRight className="staff-command-arrow" size={24} />
        </Link>
      </section>

      <section className="staff-stat-strip">
        <div><span><ShoppingBag size={14} /> TODAY'S ORDERS</span><strong>{data.total_orders}</strong></div>
        <div><span><ChefHat size={14} /> EXPECTED REVENUE</span><strong>AED {Number(data.revenue || 0).toFixed(0)}</strong></div>
        <div><span>TOP ITEM</span><strong>{data.demand[0]?.item_name || "—"}</strong></div>
      </section>

      <section className="staff-dashboard-grid">
        <article className="staff-panel demand-live-panel">
          <div className="staff-panel-head"><div><span>LIVE DEMAND</span><h2>What's moving?</h2></div><Link to="/canteen/analytics">Analytics <ArrowUpRight size={14} /></Link></div>
          <div className="staff-demand-list">
            {data.demand.length ? data.demand.slice(0, 6).map((item, index) => {
              const max = Number(data.demand[0]?.quantity || 1);
              return <motion.div key={item.item_name} className="staff-demand-item" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .06 }}><div><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.item_name}</strong></div><b>{item.quantity}</b><div className="staff-demand-bar"><i style={{ width: `${Math.max(5, Number(item.quantity) / max * 100)}%` }} /></div></motion.div>;
            }) : <div className="staff-empty">No orders yet today.</div>}
          </div>
        </article>

        <article className="staff-panel recent-staff-panel">
          <div className="staff-panel-head"><div><span>RECENT ORDERS</span><h2>Keep it moving.</h2></div><Link to="/canteen/orders">All orders <ArrowUpRight size={14} /></Link></div>
          <div className="staff-recent-list">
            {data.orders.length ? data.orders.slice(0, 6).map((order) => <Link to={`/canteen/orders/${order.order_id}`} className="staff-recent-order" key={order.order_id}><span className="staff-order-number">#{order.order_id}</span><div><strong>{order.name}</strong><small>{order.pickup_slot || "Pickup not set"}</small></div><span className={`staff-status ${statusClass(order.status)}`}>{order.status}</span><ArrowUpRight size={17} /></Link>) : <div className="staff-empty">The queue is clear. New student orders will appear here.</div>}
          </div>
        </article>
      </section>
    </main>
  );
}

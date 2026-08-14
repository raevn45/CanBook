import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { BarChart3, GraduationCap, ShoppingBag, TrendingUp } from "lucide-react";
import { canteenapi } from "../../api";

export default function DemandAnalytics() {
  const [data, setData] = useState({ summary: {}, demand: [], daily: [] });
  const [error, setError] = useState("");
  const [view, setView] = useState("items");

  useEffect(() => { canteenapi.analytics().then(setData).catch((err) => setError(err.message)); }, []);

  const max = Math.max(...data.demand.map((item) => Number(item.quantity)), 1);
  const top = data.demand[0];
  const latestDays = useMemo(() => [...(data.daily || [])].reverse(), [data.daily]);

  return (
    <main className="app-page analytics-page-new">
      <header className="analytics-head"><div><span className="micro-label"><BarChart3 size={13} /> CANTEEN / DATABASE ANALYTICS</span><h1>Know what<br /><em>students want.</em></h1><p>Real order data, grouped by item and student. Tap between demand and daily activity.</p></div></header>
      {error && <div className="form-error">{error}</div>}

      <section className="analytics-stat-grid">
        <motion.article whileHover={{ y: -5 }}><span><ShoppingBag size={15} /> TOTAL ORDERS</span><strong>{data.summary.total_orders || 0}</strong></motion.article>
        <motion.article whileHover={{ y: -5 }}><span><GraduationCap size={15} /> STUDENTS</span><strong>{data.summary.total_students || 0}</strong></motion.article>
        <motion.article whileHover={{ y: -5 }}><span><TrendingUp size={15} /> ITEMS ORDERED</span><strong>{data.summary.total_items || 0}</strong></motion.article>
        <motion.article whileHover={{ y: -5 }}><span>REVENUE</span><strong>AED {Number(data.summary.total_revenue || 0).toFixed(0)}</strong></motion.article>
      </section>

      <section className="analytics-main-grid">
        <article className="analytics-panel-new demand-panel-new">
          <div className="analytics-panel-title"><div><span>01 / DATA VIEW</span><h2>{view === "items" ? "What gets ordered?" : "Recent demand"}</h2></div><div className="analytics-view-switch"><button className={view === "items" ? "active" : ""} onClick={() => setView("items")}>Items</button><button className={view === "daily" ? "active" : ""} onClick={() => setView("daily")}>Days</button></div></div>
          {view === "items" ? <div className="demand-chart-list">
            {data.demand.length ? data.demand.map((item, index) => {
              const percentage = (Number(item.quantity) / max) * 100;
              return <motion.div className="demand-chart-row" key={item.item_id} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .045 }}><div className="demand-chart-label"><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item.item_name}</strong><small>{item.students} student{Number(item.students) === 1 ? "" : "s"}</small></div><b>{item.quantity}</b></div><div className="bar-track-new"><motion.div className="bar-new" initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: .7, delay: .1 + index * .04 }} /></div></motion.div>;
            }) : <p className="empty-analytics">Orders will appear here after students place them.</p>}
          </div> : <div className="daily-list-new analytics-daily-big">
            {latestDays.length ? latestDays.map((day, index) => <motion.div className="daily-row-new" key={String(day.order_date)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }}><div><strong>{String(day.order_date).slice(0, 10)}</strong><small>{day.students} students</small></div><span>{day.orders} orders</span><b>AED {Number(day.revenue).toFixed(0)}</b></motion.div>) : <p className="empty-analytics">Orders will appear here after students place them.</p>}
          </div>}
        </article>

        <article className="analytics-panel-new daily-panel-new">
          <div className="analytics-panel-title"><div><span>02 / QUICK READ</span><h2>Top signals.</h2></div></div>
          <div className="analytics-signal-stack">
            <div className="analytics-signal"><span>TOP ITEM</span><strong>{top?.item_name || "—"}</strong><b>{top?.quantity || 0} units</b></div>
            <div className="analytics-signal"><span>STUDENTS REACHED</span><strong>{data.summary.total_students || 0}</strong><b>unique students</b></div>
            <div className="analytics-signal"><span>AVERAGE ORDER</span><strong>AED {data.summary.total_orders ? (Number(data.summary.total_revenue || 0) / Number(data.summary.total_orders)).toFixed(2) : "0.00"}</strong><b>per order</b></div>
          </div>
        </article>
      </section>
    </main>
  );
}

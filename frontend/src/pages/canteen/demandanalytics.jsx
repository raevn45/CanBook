import { useEffect, useMemo, useState } from "react";
import { BarChart3, GraduationCap, ShoppingBag, TrendingUp } from "lucide-react";
import { canteenapi } from "../../api";

export default function DemandAnalytics() {
  const [data, setData] = useState({ summary: {}, demand: [], daily: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    canteenapi.analytics().then(setData).catch((err) => setError(err.message));
  }, []);

  const max = Math.max(...data.demand.map((item) => Number(item.quantity)), 1);
  const top = data.demand[0];
  const latestDays = useMemo(() => [...(data.daily || [])].reverse(), [data.daily]);

  return (
    <main className="app-page analytics-page-new">
      <header className="analytics-head">
        <div><span className="micro-label"><BarChart3 size={13} /> CANTEEN / DATABASE ANALYTICS</span><h1>Know what<br /><em>students want.</em></h1><p>Real order data, grouped by item and student. No demo numbers.</p></div>
      </header>

      {error && <div className="form-error">{error}</div>}

      <section className="analytics-stat-grid">
        <article><span><ShoppingBag size={15} /> TOTAL ORDERS</span><strong>{data.summary.total_orders || 0}</strong></article>
        <article><span><GraduationCap size={15} /> STUDENTS</span><strong>{data.summary.total_students || 0}</strong></article>
        <article><span><TrendingUp size={15} /> ITEMS ORDERED</span><strong>{data.summary.total_items || 0}</strong></article>
        <article><span>REVENUE</span><strong>AED {Number(data.summary.total_revenue || 0).toFixed(0)}</strong></article>
      </section>

      <section className="analytics-main-grid">
        <article className="analytics-panel-new demand-panel-new">
          <div className="analytics-panel-title"><div><span>01 / ITEM DEMAND</span><h2>What gets ordered?</h2></div>{top && <b>TOP: {top.item_name}</b>}</div>
          <div className="demand-chart-list">
            {data.demand.map((item, index) => {
              const percentage = (Number(item.quantity) / max) * 100;
              return <div className="demand-chart-row" key={item.item_id}><div className="demand-chart-label"><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item.item_name}</strong><small>{item.students} student{Number(item.students) === 1 ? "" : "s"}</small></div><b>{item.quantity}</b></div><div className="bar-track-new"><div className="bar-new" style={{ width: `${percentage}%` }} /></div></div>;
            })}
          </div>
        </article>

        <article className="analytics-panel-new daily-panel-new">
          <div className="analytics-panel-title"><div><span>02 / DAILY ACTIVITY</span><h2>Recent demand</h2></div></div>
          <div className="daily-list-new">
            {latestDays.length ? latestDays.map((day) => <div className="daily-row-new" key={String(day.order_date)}><div><strong>{String(day.order_date).slice(0, 10)}</strong><small>{day.students} students</small></div><span>{day.orders} orders</span><b>AED {Number(day.revenue).toFixed(0)}</b></div>) : <p className="empty-analytics">Orders will appear here after students place them.</p>}
          </div>
        </article>
      </section>
    </main>
  );
}

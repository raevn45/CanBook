import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, PackageCheck, UserRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { orderapi } from "../../api";

const statusCopy = {
  Pending: "Order received",
  Preparing: "Kitchen is preparing it",
  Ready: "Ready for pickup",
  Collected: "Collected",
  Cancelled: "Order cancelled",
};

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    orderapi.getone(id).then(setOrder).catch((err) => setError(err.message || "Unable to load this order."));
  }, [id]);

  if (error) return <main className="app-page"><section className="staff-error"><strong>Order couldn't load.</strong><span>{error}</span><Link to="/canteen/orders">Back to queue</Link></section></main>;
  if (!order) return <main className="app-page"><div className="loading-card">Loading order…</div></main>;

  const status = order.status || "Pending";

  return (
    <main className="app-page canteen-order-details-page">
      <div className="detail-back-row"><Link to="/canteen/orders" className="detail-back"><ArrowLeft size={16} /> Back to queue</Link><span>ORDER #{order.order_id}</span></div>
      <header className="order-detail-head"><div><span className="micro-label">CANBOOK / STAFF / ORDER DETAIL</span><h1>Order <em>#{order.order_id}.</em></h1><p>{statusCopy[status] || status}</p></div><div className={`detail-status status-${String(status).toLowerCase()}`}><Clock3 size={18} /> {status}</div></header>

      <section className="order-detail-grid">
        <article className="order-detail-ticket">
          <div className="detail-ticket-head"><span>CANTEEN TICKET</span><span>#{order.order_id}</span></div>
          <div className="detail-customer"><div className="detail-avatar"><UserRound size={21} /></div><div><small>STUDENT</small><strong>{order.name}</strong></div></div>
          <div className="detail-pickup-box"><div><CalendarDays size={19} /><span>PICKUP</span></div><strong>{order.pickup_slot || "Pickup time not set"}</strong></div>
          <div className="detail-items-list">{order.items.map((item, index) => <div className="detail-food-row" key={`${item.item_name}-${index}`}><div><strong>{item.item_name}</strong><span>× {item.quantity}</span></div><b>AED {(Number(item.price_at_order ?? item.price ?? 0) * Number(item.quantity || 0)).toFixed(2)}</b></div>)}</div>
          <div className="detail-total"><span>TOTAL</span><strong>AED {Number(order.total_amount || 0).toFixed(2)}</strong></div>
        </article>

        <aside className="detail-side-panel">
          <span className="micro-label">ORDER FLOW</span>
          <h2>Keep it<br /><em>moving.</em></h2>
          <div className="detail-flow"><div className={status === "Pending" ? "active" : "done"}><i><CheckCircle2 size={16} /></i><span>Received</span></div><div className={status === "Preparing" ? "active" : ["Ready", "Collected"].includes(status) ? "done" : ""}><i><PackageCheck size={16} /></i><span>Preparing</span></div><div className={status === "Ready" ? "active" : status === "Collected" ? "done" : ""}><i><CheckCircle2 size={16} /></i><span>Ready</span></div><div className={status === "Collected" ? "active" : ""}><i><PackageCheck size={16} /></i><span>Collected</span></div></div>
          <p>Use the queue controls to update the order. Students see the latest status in My Orders.</p>
        </aside>
      </section>
    </main>
  );
}

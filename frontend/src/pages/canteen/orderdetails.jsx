import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, CheckCircle2, ChevronRight, Clock3, PackageCheck, UserRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { canteenapi, orderapi } from "../../api";

const statusCopy = {
  Pending: "Order received — ready for the kitchen.",
  Preparing: "Kitchen is preparing this order.",
  Ready: "Order is ready for student pickup.",
  Collected: "Student has collected this order.",
  Cancelled: "Order cancelled.",
};

const STATUS_ACTIONS = {
  Pending: { label: "Start preparing", next: "Preparing", icon: Clock3 },
  Preparing: { label: "Mark ready", next: "Ready", icon: PackageCheck },
  Ready: { label: "Mark collected", next: "Collected", icon: CheckCircle2 },
};

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const loadOrder = () => {
    setError("");
    orderapi.getone(id).then(setOrder).catch((err) => setError(err.message || "Unable to load this order."));
  };

  useEffect(() => { loadOrder(); }, [id]);

  const updateStatus = async (nextStatus) => {
    setUpdating(true);
    setError("");
    try {
      await canteenapi.updateorder(id, nextStatus);
      await loadOrder();
    } catch (err) {
      setError(err.message || "Unable to update this order.");
    } finally {
      setUpdating(false);
    }
  };

  if (error) return <main className="app-page"><section className="staff-error"><strong>Order couldn't load.</strong><span>{error}</span><Link to="/canteen/orders" className="detail-back">← Back to queue</Link></section></main>;
  if (!order) return <main className="app-page"><div className="loading-card">Loading order…</div></main>;

  const status = order.status || "Pending";
  const steps = ["Received", "Preparing", "Ready", "Collected"];
  const currentIndex = status === "Pending" ? 0 : status === "Preparing" ? 1 : status === "Ready" ? 2 : status === "Collected" ? 3 : -1;
  const action = STATUS_ACTIONS[status];
  const ActionIcon = action?.icon;

  return (
    <main className="app-page canteen-order-details-page">
      <div className="detail-toolbar">
        <Link to="/canteen/orders" className="detail-back"><ArrowLeft size={17} /> <span>Back to live queue</span></Link>
        <span className="detail-order-number">ORDER #{order.order_id}</span>
      </div>

      <header className="order-detail-head">
        <div>
          <span className="micro-label">CANBOOK / STAFF / ORDER DETAIL</span>
          <h1>Order <em>#{order.order_id}.</em></h1>
          <p>{statusCopy[status] || status}</p>
        </div>
        <motion.div className={`detail-status status-${String(status).toLowerCase()}`} initial={{ scale: .9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Clock3 size={18} /> {status}
        </motion.div>
      </header>

      <section className="order-detail-grid">
        <motion.article className="order-detail-ticket" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 220, damping: 22 }}>
          <div className="detail-ticket-head"><span>CANTEEN TICKET</span><span>#{order.order_id}</span></div>
          <div className="detail-customer"><div className="detail-avatar"><UserRound size={21} /></div><div><small>STUDENT</small><strong>{order.name}</strong></div></div>
          <div className="detail-pickup-box"><div><CalendarDays size={19} /><span>PICKUP</span></div><strong>{order.pickup_slot || "Pickup time not set"}</strong></div>
          <div className="detail-items-list">{order.items.map((item, index) => <motion.div className="detail-food-row" key={`${item.item_name}-${index}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }}><div><strong>{item.item_name}</strong><span>× {item.quantity}</span></div><b>AED {(Number(item.price_at_order ?? item.price ?? 0) * Number(item.quantity || 0)).toFixed(2)}</b></motion.div>)}</div>
          <div className="detail-total"><span>TOTAL</span><strong>AED {Number(order.total_amount || 0).toFixed(2)}</strong></div>
        </motion.article>

        <motion.aside className="detail-side-panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 220, damping: 22, delay: .05 }}>
          <span className="micro-label">ORDER FLOW</span>
          <h2>Keep it<br /><em>moving.</em></h2>
          <div className="detail-flow">{steps.map((step, index) => <motion.div className={currentIndex === index ? "active" : currentIndex > index ? "done" : ""} key={step} animate={currentIndex === index ? { x: [0, 4, 0] } : { x: 0 }} transition={{ duration: .6 }}><i>{index === 0 ? <CheckCircle2 size={16} /> : <PackageCheck size={16} />}</i><span>{step}</span></motion.div>)}</div>

          {action && (
            <button type="button" className={`detail-primary-action ${status.toLowerCase()}`} onClick={() => updateStatus(action.next)} disabled={updating}>
              <ActionIcon size={19} />
              <span>{updating ? "Updating…" : action.label}</span>
              <ChevronRight size={19} />
            </button>
          )}
          {status === "Collected" && <div className="detail-collected-note"><CheckCircle2 size={18} /> Collected — this order is now in the completed bin.</div>}
          <p>Update the status as the kitchen moves. Once the student collects the order, it leaves the live queue automatically.</p>
        </motion.aside>
      </section>
    </main>
  );
}

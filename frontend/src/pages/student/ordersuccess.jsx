import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Check, Clock3 } from "lucide-react";

export default function OrderSuccess() {
  const order = JSON.parse(localStorage.getItem("canbook_current_order") || "null");
  const total = Number(order?.total || 0);
  const pickupDate = order?.pickup_date ? new Date(`${order.pickup_date}T00:00:00`) : null;
  const pickupDateLabel = pickupDate ? pickupDate.toLocaleDateString("en-AE", { weekday: "long", day: "numeric", month: "long" }) : "Your selected date";
  return <main className="success-page"><section className="success-card"><div className="success-check"><Check size={34} strokeWidth={3} /></div><span className="section-kicker">CANBOOK / CONFIRMED</span><h1>You're<br /><span>all set.</span></h1><p className="success-message">Your order has been sent to the canteen. Keep this page handy and come by for your pickup window.</p><div className="success-order-number"><span>ORDER NUMBER</span><strong>#{order?.id || "CANBOOK"}</strong></div>{order?.items?.length > 0 && <div className="success-items">{order.items.map((item) => <div className="success-item" key={item.id}><div><strong>{item.name}</strong><span>× {item.quantity}</span></div><strong>AED {(Number(item.price) * Number(item.quantity)).toFixed(2)}</strong></div>)}</div>}<div className="success-total"><span>Total</span><strong>AED {total.toFixed(2)}</strong></div><div className="success-pickup summary-pickup"><CalendarDays size={18} /><div><span>Pickup date</span><strong>{pickupDateLabel}</strong></div><Clock3 size={18} /><div><span>Pickup window</span><strong>{order?.pickup_slot || "Selected at checkout"}</strong></div></div><div className="success-actions"><Link to="/orders" className="hero-primary">View my orders <ArrowRight size={18} /></Link><Link to="/menu" className="hero-secondary">Order something else</Link></div></section></main>;
}

import { ArrowUpRight, CalendarDays, Check, Clock3 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const order = JSON.parse(localStorage.getItem("canbook_current_order") || "null");
  const orderNumber = params.get("id") || order?.id || "—";
  const total = Number(order?.total || 0);
  const pickup = order?.pickup || "Pickup details are in your order history.";

  return (
    <main className="success-page-new">
      <div className="success-confetti">✳　✦　✳　✦　✳</div>
      <section className="success-layout">
        <div className="success-copy"><span className="micro-label"><Check size={14} /> CANBOOK / CONFIRMED</span><h1>Lunch is<br /><em>locked in.</em></h1><p>Your order is now with the canteen. Keep this page handy or check your order history for status updates.</p><Link to="/orders" className="giant-submit inline-submit">Track my order <ArrowUpRight size={20} /></Link></div>
        <div className="receipt-card"><div className="receipt-head"><span>ORDER #{orderNumber}</span><b>CONFIRMED</b></div><div className="receipt-total"><small>TOTAL</small><strong>AED {total.toFixed(2)}</strong></div><div className="receipt-pickup"><div><CalendarDays size={19} /><span>Pickup</span></div><strong>{pickup}</strong></div><div className="receipt-items">{order?.items?.map((item) => <div key={item.id}><span>{item.name} × {item.quantity}</span><strong>AED {(Number(item.price) * Number(item.quantity)).toFixed(2)}</strong></div>)}</div><div className="receipt-footer"><Clock3 size={17} /><span>We'll update the order status as the canteen prepares it.</span></div></div>
      </section>
    </main>
  );
}

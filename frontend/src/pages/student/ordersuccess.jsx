import { ArrowUpRight, CalendarDays, Check, Clock3, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { orderapi } from "../../api";

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const stored = JSON.parse(localStorage.getItem("canbook_current_order") || "null");
  const orderNumber = params.get("id") || stored?.id || "—";
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(orderNumber && orderNumber !== "—"));
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    if (!orderNumber || orderNumber === "—") {
      setLoading(false);
      return undefined;
    }

    orderapi.getone(orderNumber)
      .then((data) => {
        if (active) {
          setOrder(data);
          setError("");
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Unable to refresh the confirmed order.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [orderNumber]);

  const total = Number(order?.total_amount ?? stored?.total ?? 0);
  const pickup = order?.pickup_slot || stored?.pickup || "Pickup details are in your order history.";
  const items = order?.items?.length ? order.items : (stored?.items || []);

  return (
    <main className="success-page-new">
      <div className="success-confetti">✳　✦　✳　✦　✳</div>
      <section className="success-layout">
        <div className="success-copy">
          <span className="micro-label"><Check size={14} /> CANBOOK / CONFIRMED</span>
          <h1>Lunch is<br /><em>locked in.</em></h1>
          <p>Your order is now with the canteen. Keep this page handy or check your order history for status updates.</p>
          <Link to="/orders" className="giant-submit inline-submit">View my orders <ArrowUpRight size={20} /></Link>
          {error && <small className="success-sync-error">{error}</small>}
        </div>

        <div className="receipt-card">
          <div className="receipt-head"><span>ORDER #{orderNumber}</span><b>CONFIRMED</b></div>
          <div className="receipt-total"><small>TOTAL</small><strong>AED {total.toFixed(2)}</strong></div>
          <div className="receipt-pickup"><div><CalendarDays size={19} /><span>Pickup</span></div><strong>{pickup}</strong></div>
          <div className="receipt-items">
            {items.map((item, index) => {
              const price = Number(item.price_at_order ?? item.price ?? 0);
              return <div key={`${item.item_id || item.id || item.item_name}-${index}`}><span>{item.item_name || item.name} × {item.quantity}</span><strong>AED {(price * Number(item.quantity || 0)).toFixed(2)}</strong></div>;
            })}
          </div>
          <div className="receipt-footer"><Clock3 size={17} /><span>{loading ? "Refreshing your confirmed order…" : "We'll update the order status as the canteen prepares it."}</span>{loading && <RefreshCw size={15} className="spin" />}</div>
        </div>
      </section>
    </main>
  );
}

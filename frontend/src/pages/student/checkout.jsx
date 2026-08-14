import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock3 } from "lucide-react";
import { useCart } from "../../context/cartcontext";
import { orderapi } from "../../api";

const pad = (value) => String(value).padStart(2, "0");
const dateKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

function buildDates() {
  const result = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  for (let i = 0; i < 14; i += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    result.push(date);
  }
  return result;
}

function buildSlots(date) {
  if ([0, 6].includes(date.getDay())) return [];
  const slots = [];
  for (let hour = 10; hour <= 13; hour += 1) {
    for (const minute of [0, 20, 40]) {
      if (hour === 13 && minute > 20) continue;
      const start = new Date(date);
      start.setHours(hour, minute, 0, 0);
      const end = new Date(start.getTime() + 20 * 60000);
      slots.push(`${pad(start.getHours())}:${pad(start.getMinutes())} - ${pad(end.getHours())}:${pad(end.getMinutes())}`);
    }
  }
  return slots;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();
  const dates = useMemo(buildDates, []);
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const slots = useMemo(() => buildSlots(selectedDate), [selectedDate]);

  const placeOrder = async () => {
    setError("");
    if (!cart.length) return setError("Your cart is empty.");
    if (!selectedSlot) return setError("Choose a pickup time.");
    setLoading(true);
    try {
      const data = await orderapi.create({ pickup_slot: `${dateKey(selectedDate)} ${selectedSlot}`, items: cart.map((item) => ({ item_id: item.item_id, quantity: item.quantity })) });
      localStorage.setItem("canbook_current_order", JSON.stringify({ id: data.order_id, total: data.total, pickup_date: dateKey(selectedDate), pickup_slot: selectedSlot, items: cart.map((item) => ({ id: item.item_id, name: item.item_name, quantity: item.quantity, price: Number(item.price) })) }));
      clearCart();
      navigate(`/success?id=${data.order_id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="checkout-page">
      <header className="checkout-nav"><Link to="/cart"><ArrowLeft size={17} /> Cart</Link><span>CANBOOK / CHECKOUT</span><Link to="/menu">Menu</Link></header>
      <section className="checkout-shell">
        <div className="checkout-main">
          <div className="checkout-kicker"><CalendarDays size={15} /> PICKUP PLANNER</div>
          <h1>When do you<br /><em>want it?</em></h1>
          <p className="checkout-subtitle">Choose a school day, then lock in a 20-minute collection window.</p>
          <div className="picker-section"><div className="picker-title"><div><span>01</span><h2>Pick a date</h2></div><small>Next 2 weeks</small></div><div className="date-scroller">{dates.map((date) => { const active = dateKey(date) === dateKey(selectedDate); const disabled = [0, 6].includes(date.getDay()); return <button key={dateKey(date)} disabled={disabled} onClick={() => { setSelectedDate(date); setSelectedSlot(""); }} className={`date-card ${active ? "active" : ""} ${disabled ? "disabled" : ""}`}><span>{date.toLocaleDateString("en-AE", { weekday: "short" })}</span><strong>{date.getDate()}</strong><small>{date.toLocaleDateString("en-AE", { month: "short" })}</small>{active && <i><Check size={11} /></i>}</button>; })}</div></div>
          <div className="picker-section"><div className="picker-title"><div><span>02</span><h2>Pick a time</h2></div><small>{selectedDate.toLocaleDateString("en-AE", { weekday: "long", day: "numeric", month: "long" })}</small></div><div className="time-grid">{slots.length ? slots.map((slot) => <button key={slot} className={`time-card ${selectedSlot === slot ? "active" : ""}`} onClick={() => setSelectedSlot(slot)}><Clock3 size={17} /><span>{slot}</span>{selectedSlot === slot && <Check size={15} />}</button>) : <div className="no-slots">No pickup slots on weekends. Choose a school day.</div>}</div></div>
          {error && <div className="form-error">{error}</div>}
        </div>
        <aside className="checkout-summary"><div className="summary-label">YOUR ORDER</div><div className="summary-items">{cart.map((item) => <div className="summary-item" key={item.item_id}><div><strong>{item.item_name}</strong><span>× {item.quantity}</span></div><b>AED {(Number(item.price) * item.quantity).toFixed(2)}</b></div>)}</div><div className="summary-pickup"><CalendarDays size={17} /><div><span>Pickup</span><strong>{selectedDate.toLocaleDateString("en-AE", { day: "numeric", month: "short" })} · {selectedSlot || "Choose a time"}</strong></div></div><div className="summary-total"><span>Total</span><strong>AED {total.toFixed(2)}</strong></div><button className="hero-primary" disabled={loading || !cart.length || !selectedSlot} onClick={placeOrder}>{loading ? "Placing..." : "Place order"}<ArrowRight size={18} /></button><small>You'll receive your order status from the canteen.</small></aside>
      </section>
    </main>
  );
}

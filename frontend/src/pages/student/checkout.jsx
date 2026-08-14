import { useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight, Clock3, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { orderapi } from "../../api";
import { pickupslots } from "../../constants";
import { useCart } from "../../context/cartcontext";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function startOfDay(date) { return new Date(date.getFullYear(), date.getMonth(), date.getDate()); }
function dateKey(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function displayDate(date) { return date.toLocaleDateString("en-AE", { weekday: "long", day: "numeric", month: "long", year: "numeric" }); }
function nextWeekday(from) { const date = new Date(from); while (date.getDay() === 0 || date.getDay() === 6) date.setDate(date.getDate() + 1); return startOfDay(date); }
function slotIsPast(slot, selectedDate) { if (!selectedDate) return false; const today = startOfDay(new Date()); if (selectedDate.getTime() !== today.getTime()) return false; const [start] = slot.split(" - "); const [hour, minute] = start.split(":").map(Number); const now = new Date(); return hour * 60 + minute <= now.getHours() * 60 + now.getMinutes() + 10; }

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();
  const today = useMemo(() => startOfDay(new Date()), []);
  const maxDate = useMemo(() => { const d = new Date(today); d.setDate(d.getDate() + 21); return d; }, [today]);
  const firstDate = useMemo(() => nextWeekday(today), [today]);
  const [selectedDate, setSelectedDate] = useState(firstDate);
  const [viewDate, setViewDate] = useState(firstDate);
  const [pickupSlot, setPickupSlot] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const calendarDays = useMemo(() => {
    const first = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const last = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
    const cells = [];
    for (let i = 0; i < first.getDay(); i += 1) cells.push(null);
    for (let day = 1; day <= last.getDate(); day += 1) cells.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
    return cells;
  }, [viewDate]);

  const dateDisabled = (date) => !date || date < today || date > maxDate || date.getDay() === 0 || date.getDay() === 6;
  const chooseDate = (date) => { if (dateDisabled(date)) return; setSelectedDate(date); setPickupSlot(""); };
  const changeMonth = (amount) => {
    const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + amount, 1);
    const firstAllowedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastAllowedMonth = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
    if (next < firstAllowedMonth || next > lastAllowedMonth) return;
    setViewDate(next);
  };

  const placeOrder = async () => {
    setError("");
    if (!cart.length) return setError("Your cart is empty.");
    if (!selectedDate || dateDisabled(selectedDate)) return setError("Choose a valid pickup date.");
    if (!pickupSlot || slotIsPast(pickupSlot, selectedDate)) return setError("Choose an available pickup time.");
    setLoading(true);
    try {
      const pickup = `${dateKey(selectedDate)} | ${pickupSlot}`;
      const data = await orderapi.create({ pickup_slot: pickup, items: cart.map((item) => ({ item_id: item.item_id, quantity: item.quantity })) });
      localStorage.setItem("canbook_current_order", JSON.stringify({ id: data.order_id, total: data.total, pickup, items: cart.map((item) => ({ id: item.item_id, name: item.item_name, price: item.price, quantity: item.quantity })) }));
      clearCart();
      navigate(`/success?id=${data.order_id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-page checkout-page-new">
      <header className="checkout-top"><Link to="/cart" className="ghost-link"><ArrowLeft size={16} /> Back to cart</Link><span className="micro-label"><Sparkles size={13} /> CANBOOK / PICKUP PLANNER</span><span className="checkout-total">AED {total.toFixed(2)}</span></header>

      <div className="checkout-heading"><div><span className="section-number">03</span><h1>When should we<br /><em>have it ready?</em></h1></div><p>Choose a school day and a 20-minute pickup window. Your selection is saved in the existing <code>pickup_slot</code> order field, so the Flask contract stays untouched.</p></div>

      <section className="pickup-planner">
        <div className="calendar-card">
          <div className="planner-card-head"><div><span>01 / DATE</span><h2>{MONTH_NAMES[viewDate.getMonth()]} <em>{viewDate.getFullYear()}</em></h2></div><div className="month-controls"><button onClick={() => changeMonth(-1)} aria-label="Previous month"><ChevronLeft size={18} /></button><button onClick={() => changeMonth(1)} aria-label="Next month"><ChevronRight size={18} /></button></div></div>
          <div className="weekday-row">{DAY_NAMES.map((day) => <span key={day}>{day}</span>)}</div>
          <div className="calendar-grid">{calendarDays.map((date, index) => { const disabled = dateDisabled(date); const selected = date && selectedDate && dateKey(date) === dateKey(selectedDate); const todayCell = date && dateKey(date) === dateKey(today); return <button key={`${date ? dateKey(date) : "blank"}-${index}`} className={`${selected ? "selected " : ""}${todayCell ? "today " : ""}${disabled ? "disabled" : ""}`} disabled={disabled} onClick={() => chooseDate(date)}>{date?.getDate()}</button>; })}</div>
          <div className="calendar-note"><CalendarDays size={16} /><span>Weekends are closed. Pickup dates are available for the next 21 days.</span></div>
        </div>

        <div className="slot-card">
          <div className="planner-card-head"><div><span>02 / TIME</span><h2>Choose a <em>window.</em></h2></div><Clock3 size={22} /></div>
          <div className="selected-date-banner"><span>YOUR DATE</span><strong>{displayDate(selectedDate)}</strong></div>
          <div className="slot-grid">{pickupslots.map((slot) => { const disabled = slotIsPast(slot, selectedDate); return <button key={slot} disabled={disabled} className={pickupSlot === slot ? "active" : ""} onClick={() => setPickupSlot(slot)}><span>{slot}</span><small>{disabled ? "passed" : "20 min pickup"}</small></button>; })}</div>
          <div className="planner-selection"><span>YOUR PICK</span><strong>{selectedDate && pickupSlot ? `${displayDate(selectedDate)} · ${pickupSlot}` : "Select a date and time"}</strong></div>
        </div>
      </section>

      <section className="checkout-bottom"><div className="checkout-recap"><span className="micro-label">ORDER SUMMARY</span>{cart.map((item) => <div key={item.item_id}><span>{item.item_name} × {item.quantity}</span><strong>AED {(Number(item.price) * item.quantity).toFixed(2)}</strong></div>)}<div className="recap-total"><span>Total</span><strong>AED {total.toFixed(2)}</strong></div></div><div className="checkout-action"><div className="action-note"><Sparkles size={17} /><span>Ready for pickup on<br /><strong>{selectedDate && pickupSlot ? `${displayDate(selectedDate)} · ${pickupSlot}` : "your chosen window"}</strong></span></div>{error && <div className="form-error">{error}</div>}<button className="giant-submit" onClick={placeOrder} disabled={loading || !cart.length}><span>{loading ? "Sending to canteen…" : "Place this order"}</span><ArrowUpRight size={22} /></button></div></section>
    </main>
  );
}

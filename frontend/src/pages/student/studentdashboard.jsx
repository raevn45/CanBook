import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarDays, Clock3, ShoppingBag, Sparkles, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";
import { orderapi } from "../../api";
import { useAuth } from "../../context/authcontext";
import { useCart } from "../../context/cartcontext";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { count, total } = useCart();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    orderapi.getall().then((data) => setOrders(data.orders || [])).catch(() => setOrders([]));
  }, []);

  const active = orders.find((order) => !["Collected", "Cancelled"].includes(order.status));

  return (
    <main className="app-page student-home-new">
      <header className="student-home-head"><div><span className="micro-label"><Sparkles size={13} /> CANBOOK / STUDENT HOME</span><h1>Hey, {user?.name?.split(" ")[0] || "there"}.<br /><em>What's good?</em></h1><p>Your next good lunch is a few clicks away.</p></div><Link to="/cart" className="floating-cart"><ShoppingBag size={18} /><span>Cart</span><b>{count}</b></Link></header>
      <section className="student-hero-grid"><Link to="/menu" className="student-main-card"><span>01 / LIVE MENU</span><div><h2>Find your<br /><em>lunch.</em></h2><ArrowUpRight size={32} /></div><p>Browse the canteen menu, filter by category and add your favourites.</p></Link><div className="student-side-stack"><div className="mini-stat-card"><span>IN CART</span><strong>{count}</strong><small>AED {total.toFixed(2)}</small></div><Link to="/orders" className="mini-stat-card accent-card"><span>ORDER HISTORY</span><strong>{orders.length}</strong><small>See every pickup</small><ArrowUpRight size={18} /></Link></div></section>
      <section className="student-order-strip"><div><span className="micro-label">YOUR NEXT PICKUP</span><h2>{active ? `Order #${active.order_id}` : "No active order"}</h2></div>{active ? <><div className="pickup-chip"><CalendarDays size={17} /><span>{active.pickup_slot}</span></div><div className="status-chip"><Clock3 size={17} /><span>{active.status}</span></div><Link to={`/orders`} className="circle-arrow"><ArrowUpRight size={18} /></Link></> : <Link to="/menu" className="giant-submit compact-submit">Order lunch <ArrowUpRight size={18} /></Link>}</section>
      <section className="student-how"><span className="section-number">02</span><div><h2>Good lunch,<br /><em>less queue.</em></h2><div className="student-how-grid"><article><UtensilsCrossed size={22} /><b>Choose</b><p>Pick food from the live menu.</p></article><article><CalendarDays size={22} /><b>Schedule</b><p>Choose your date and 20-minute window.</p></article><article><ShoppingBag size={22} /><b>Collect</b><p>Arrive when the canteen is ready.</p></article></div></div></section>
    </main>
  );
}

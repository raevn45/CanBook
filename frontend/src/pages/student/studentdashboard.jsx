import { ArrowUpRight, ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authcontext";
import { useCart } from "../../context/cartcontext";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { count, total } = useCart();

  return (
    <main className="app-page student-home-new">
      <header className="student-home-head">
        <div><span className="micro-label"><Sparkles size={13} /> CANBOOK / STUDENT HOME</span><h1>Hey, {user?.name?.split(" ")[0] || "there"}.<br /><em>What's good?</em></h1><p>Your next good lunch is a few clicks away.</p></div>
        <Link to="/cart" className="floating-cart"><ShoppingBag size={18} /><span>Cart</span><b>{count}</b></Link>
      </header>

      <section className="student-hero-grid">
        <Link to="/menu" className="student-main-card"><span>01 / LIVE MENU</span><div><h2>Find your<br /><em>lunch.</em></h2><ArrowUpRight size={32} /></div><p>Browse the canteen menu, filter by category and add your favourites.</p></Link>
        <div className="student-side-stack"><div className="mini-stat-card"><span>IN CART</span><strong>{count}</strong><small>AED {total.toFixed(2)}</small></div><Link to="/orders" className="mini-stat-card accent-card"><span>MY ORDERS</span><strong>→</strong><small>See your order history</small><ArrowUpRight size={18} /></Link></div>
      </section>

      <section className="student-how"><span className="section-number">02</span><div><h2>Good lunch,<br /><em>less queue.</em></h2><div className="student-how-grid"><article><span>01</span><b>Choose</b><p>Pick food from the live menu.</p></article><article><span>02</span><b>Schedule</b><p>Choose your date and 20-minute window.</p></article><article><span>03</span><b>Collect</b><p>Arrive when the canteen is ready.</p></article></div></div></section>
    </main>
  );
}

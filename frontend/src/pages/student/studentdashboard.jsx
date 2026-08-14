import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, ShoppingBag, Sparkles } from "lucide-react";
import { useAuth } from "../../context/authcontext";
import { useCart } from "../../context/cartcontext";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const { count, total } = useCart();
  const firstName = user?.name?.split(" ")[0] || "there";

  return <main className="student-home"><nav className="app-nav"><Link to="/student" className="app-brand"><span>CB</span><strong>CanBook</strong></Link><div><Link to="/orders">My orders</Link><button onClick={logout}>Log out</button></div></nav><section className="student-home-hero"><div><div className="eyebrow"><Sparkles size={14} /> WELCOME BACK</div><h1>Hey, {firstName}.<br /><em>What's for lunch?</em></h1><p>The canteen is ready. You just need to pick your food.</p><div className="home-actions"><Link to="/menu" className="hero-primary">Browse today's menu <ArrowRight size={18} /></Link><Link to="/orders" className="hero-secondary">See my orders</Link></div></div><div className="home-orbit"><span>🍗</span><span>🥪</span><span>🍰</span><div>🍱</div></div></section><section className="home-cards"><Link to="/menu" className="home-card card-orange"><span>01</span><ShoppingBag size={23} /><h2>Build your order.</h2><p>Choose from the live canteen menu with AED prices.</p><b>Browse menu <ArrowRight size={15} /></b></Link><Link to="/checkout" className="home-card card-yellow"><span>02</span><CalendarDays size={23} /><h2>Pick your slot.</h2><p>Choose a date and 20-minute pickup window at checkout.</p><b>Go to checkout <ArrowRight size={15} /></b></Link><div className="home-card card-purple"><span>03</span><strong className="home-cart-number">{count}</strong><h2>In your cart.</h2><p>AED {total.toFixed(2)} ready for your next order.</p><Link to="/cart">Review cart <ArrowRight size={15} /></Link></div></section></main>;
}

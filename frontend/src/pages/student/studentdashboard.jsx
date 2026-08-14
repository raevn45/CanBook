import { motion } from "motion/react";
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
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}><span className="micro-label"><Sparkles size={13} /> CANBOOK / STUDENT HOME</span><h1>Hey, {user?.name?.split(" ")[0] || "there"}.<br /><em>What's good?</em></h1><p>Your next good lunch is a few clicks away.</p></motion.div>
        <motion.div whileHover={{ y: -4 }} whileTap={{ scale: .96 }}><Link to="/cart" className="floating-cart"><ShoppingBag size={18} /><span>Cart</span><b>{count}</b></Link></motion.div>
      </header>

      <section className="student-hero-grid">
        <motion.div whileHover={{ y: -8 }} whileTap={{ scale: .99 }}><Link to="/menu" className="student-main-card"><span>01 / LIVE MENU</span><div><h2>Find your<br /><em>lunch.</em></h2><ArrowUpRight size={32} /></div><p>Browse the live canteen menu, filter by category and add your favourites.</p></Link></motion.div>
        <div className="student-side-stack">
          <motion.div className="mini-stat-card" whileHover={{ y: -7, rotate: -.5 }}><span>IN CART</span><strong>{count}</strong><small>AED {total.toFixed(2)}</small></motion.div>
          <motion.div whileHover={{ y: -7, rotate: .5 }} whileTap={{ scale: .99 }}><Link to="/orders" className="mini-stat-card accent-card"><span>MY ORDERS</span><strong>→</strong><small>See your order history</small><ArrowUpRight size={18} /></Link></motion.div>
        </div>
      </section>

      <section className="student-signal-row"><motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 15 }} viewport={{ once: true }}><span>LIVE MENU</span><strong>9 school favourites</strong></motion.div><motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 15 }} viewport={{ once: true }} transition={{ delay: .08 }}><span>PICKUP</span><strong>20-minute windows</strong></motion.div><motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 15 }} viewport={{ once: true }} transition={{ delay: .16 }}><span>PRICES</span><strong>AED student pricing</strong></motion.div></section>
    </main>
  );
}

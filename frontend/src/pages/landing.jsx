import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, CalendarDays, Clock3, MoveRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { menuapi } from "../api";
import { menuFallback } from "../constants";

const notes = ["NO QUEUE", "AED PRICING", "LIVE MENU", "20 MIN WINDOWS"];
const legacyNames = new Set(["cheese pizza", "fresh juice", "french fries", "chocolate cookie"]);

function usableMenu(items) {
  const live = Array.isArray(items) ? items.filter((item) => item?.available !== false) : [];
  const hasCurrentMenu = live.some((item) => menuFallback.some((fallback) => fallback.item_name === item.item_name));
  if (!hasCurrentMenu) return menuFallback;
  return live.filter((item) => !legacyNames.has(String(item.item_name || "").toLowerCase()));
}

const ease = [0.22, 1, 0.36, 1];

export default function Landing() {
  const [items, setItems] = useState(menuFallback);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    menuapi.get().then((data) => setItems(usableMenu(data.items))).catch(() => setItems(menuFallback));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setFeaturedIndex((current) => (current + 1) % Math.max(items.length, 1)), 3000);
    return () => window.clearInterval(timer);
  }, [items.length]);

  const preview = useMemo(() => items.slice(0, 9), [items]);
  const featured = preview[featuredIndex % Math.max(preview.length, 1)] || menuFallback[0];

  return (
    <main className="landing-new">
      <nav className="landing-nav">
        <Link to="/" className="brand-lockup" aria-label="CanBook home">CAN<span>BOOK</span><small>GIIS CANTEEN</small></Link>
        <div className="landing-nav-links"><a href="#menu">Menu</a><Link to="/login">Login</Link></div>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }}><Link to="/login" className="nav-pill">Start ordering <ArrowUpRight size={17} /></Link></motion.div>
      </nav>

      <section className="landing-hero">
        <div className="hero-copy-new">
          <motion.div className="hero-tag" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease }}><Sparkles size={14} /> SCHOOL LUNCH / REIMAGINED</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: .08, ease }}>Lunch,<br /><span>without</span><br />the queue.</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .35, duration: .7 }}>Browse the live canteen menu, build your order, choose the exact pickup date and time, and walk in when your food is ready.</motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .45, duration: .65 }}>
            <motion.div whileHover={{ y: -4 }} whileTap={{ scale: .97 }}><Link to="/login" className="hero-cta">Order lunch <ArrowUpRight size={19} /></Link></motion.div>
            <motion.div whileHover={{ x: 5 }} whileTap={{ scale: .97 }}><a href="#menu" className="hero-secondary">See the menu <ArrowDownRight size={18} /></a></motion.div>
          </motion.div>
          <div className="hero-meta"><span><b>{String(items.length).padStart(2, "0")}</b> menu favourites</span><span><b>20m</b> pickup windows</span><span><b>AED</b> student pricing</span></div>
        </div>

        <motion.div className="hero-collage" initial={{ opacity: 0, scale: .96, rotate: 1 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1, delay: .2, ease }} aria-label="Featured CanBook menu item">
          <div className="collage-back">CAN<br />BOOK</div>
          <motion.div className="order-ticket featured-ticket" whileHover={{ rotate: 1, y: -8, scale: 1.015 }} transition={{ type: "spring", stiffness: 240, damping: 18 }}>
            <div className="ticket-top"><span>CANBOOK / LIVE MENU</span><span>LIVE</span></div>
            <div className="ticket-main">
              <small>WHAT'S GOOD TODAY</small>
              <AnimatePresence mode="wait">
                <motion.h2 key={featured.item_name} initial={{ opacity: 0, y: 18, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -18, filter: "blur(6px)" }} transition={{ duration: .35, ease }}>{featured.item_name}</motion.h2>
              </AnimatePresence>
              <AnimatePresence mode="wait"><motion.div key={`price-${featured.item_name}`} className="ticket-price" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>AED {Number(featured.price).toFixed(2)}</motion.div></AnimatePresence>
            </div>
            <div className="ticket-line" />
            <div className="ticket-row"><span><CalendarDays size={15} /> School day</span><strong>PLAN</strong></div>
            <div className="ticket-row"><span><Clock3 size={15} /> Pickup window</span><strong>20 MIN</strong></div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }}><Link to="/login" className="ticket-button">Build your order <MoveRight size={17} /></Link></motion.div>
          </motion.div>
          <motion.div className="sticker sticker-a" whileHover={{ rotate: 0, scale: 1.08 }}>FRESH<br />TODAY</motion.div>
          <motion.div className="sticker sticker-b" whileHover={{ rotate: 0, scale: 1.08 }}>NO<br />QUEUE</motion.div>
        </motion.div>
      </section>

      <div className="ticker-strip">{notes.map((note, index) => <motion.span key={note} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }}>{note} <b>✳</b></motion.span>)}</div>

      <section className="menu-showcase" id="menu">
        <div className="section-intro"><div><span className="section-number">01</span><h2>What's<br /><em>good</em> today?</h2></div><p>The same AED menu follows students from the homepage into ordering. Hover, tap, and explore — then sign in to build the real cart.</p></div>
        <div className="menu-wall">
          {preview.map((item, index) => (
            <motion.div key={item.item_id} layout className={`menu-tile tile-${(index % 9) + 1}`} onHoverStart={() => setHoveredItem(item.item_id)} onHoverEnd={() => setHoveredItem(null)} whileHover={{ y: -8, x: -4 }} whileTap={{ scale: .98 }}>
              <Link to="/login" aria-label={`Order ${item.item_name}`} className="menu-tile-link" />
              <span className="tile-index">{String(index + 1).padStart(2, "0")}</span>
              <div><small>{item.category}</small><h3>{item.item_name}</h3></div>
              <strong>AED {Number(item.price).toFixed(2)}</strong>
              <motion.div className="tile-arrow-wrap" animate={{ rotate: hoveredItem === item.item_id ? 45 : 0, scale: hoveredItem === item.item_id ? 1.12 : 1 }}><ArrowUpRight className="tile-arrow" size={20} /></motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="landing-pickup-band"><div><span className="section-number">02</span><h2>Pick the day.<br /><em>Pick the moment.</em></h2></div><div className="pickup-band-copy"><p>Checkout gives you a full calendar and 20-minute pickup windows. No vague “later”. No guessing.</p><motion.div whileHover={{ y: -4 }} whileTap={{ scale: .98 }}><Link to="/login" className="hero-cta">Continue to CanBook <ArrowUpRight size={19} /></Link></motion.div></div></section>

      <footer className="landing-footer"><div><Link to="/" className="brand-lockup">CAN<span>BOOK</span><small>GIIS CANTEEN</small></Link><p>Less queue. Better lunch.</p></div><motion.div whileHover={{ x: 4 }}><Link to="/login" className="footer-cta">Login <ArrowUpRight size={18} /></Link></motion.div></footer>
    </main>
  );
}

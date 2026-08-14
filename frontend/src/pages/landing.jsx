import { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, CalendarDays, Clock3, MoveRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { menuapi } from "../api";
import { menuFallback } from "../constants";

const notes = ["NO QUEUE", "AED PRICING", "LIVE STATUS", "SMART PICKUP"];
const legacyNames = new Set(["cheese pizza", "fresh juice", "french fries", "chocolate cookie"]);

function usableMenu(items) {
  const live = Array.isArray(items) ? items.filter((item) => item?.available !== false) : [];
  const hasCurrentMenu = live.some((item) => menuFallback.some((fallback) => fallback.item_name === item.item_name));
  if (!hasCurrentMenu) return menuFallback;
  return live.filter((item) => !legacyNames.has(String(item.item_name || "").toLowerCase()));
}

export default function Landing() {
  const [items, setItems] = useState(menuFallback);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    menuapi.get().then((data) => setItems(usableMenu(data.items))).catch(() => setItems(menuFallback));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFeaturedIndex((current) => (current + 1) % Math.max(items.length, 1));
    }, 2600);
    return () => window.clearInterval(timer);
  }, [items.length]);

  const preview = useMemo(() => items.slice(0, 9), [items]);
  const featured = preview[featuredIndex % Math.max(preview.length, 1)] || menuFallback[0];

  return (
    <main className="landing-new">
      <nav className="landing-nav">
        <Link to="/" className="brand-lockup" aria-label="CanBook home">CAN<span>BOOK</span><small>GIIS CANTEEN</small></Link>
        <div className="landing-nav-links"><a href="#menu">Menu</a><Link to="/login">Login</Link></div>
        <Link to="/login" className="nav-pill">Start ordering <ArrowUpRight size={17} /></Link>
      </nav>

      <section className="landing-hero">
        <div className="hero-copy-new">
          <div className="hero-tag"><Sparkles size={14} /> SCHOOL LUNCH / REIMAGINED</div>
          <h1>Lunch,<br /><span>without</span><br />the queue.</h1>
          <p>Browse the canteen menu, build your order, choose the exact pickup date and time, and walk in when your food is ready.</p>
          <div className="hero-actions"><Link to="/login" className="hero-cta">Order lunch <ArrowUpRight size={19} /></Link><a href="#menu" className="hero-secondary">See the menu <ArrowDownRight size={18} /></a></div>
          <div className="hero-meta"><span><b>{String(items.length).padStart(2, "0")}</b> menu favourites</span><span><b>20m</b> pickup windows</span><span><b>AED</b> student pricing</span></div>
        </div>

        <div className="hero-collage" aria-label="Featured CanBook menu item">
          <div className="collage-back">CAN<br />BOOK</div>
          <div className="order-ticket featured-ticket">
            <div className="ticket-top"><span>CANBOOK / LIVE MENU</span><span>LIVE</span></div>
            <div className="ticket-main">
              <small>WHAT'S GOOD TODAY</small>
              <h2 key={featured.item_name}>{featured.item_name}</h2>
              <div className="ticket-price">AED {Number(featured.price).toFixed(2)}</div>
            </div>
            <div className="ticket-line" />
            <div className="ticket-row"><span><CalendarDays size={15} /> School day</span><strong>PLAN</strong></div>
            <div className="ticket-row"><span><Clock3 size={15} /> Pickup window</span><strong>20 MIN</strong></div>
            <Link to="/login" className="ticket-button">Build your order <MoveRight size={17} /></Link>
          </div>
          <div className="sticker sticker-a">FRESH<br />TODAY</div>
          <div className="sticker sticker-b">NO<br />QUEUE</div>
        </div>
      </section>

      <div className="ticker-strip">{notes.map((note) => <span key={note}>{note} <b>✳</b></span>)}</div>

      <section className="menu-showcase" id="menu">
        <div className="section-intro"><div><span className="section-number">01</span><h2>What's<br /><em>good</em> today?</h2></div><p>The same AED menu follows students from the homepage into ordering. The canteen can change availability without deleting order history.</p></div>
        <div className="menu-wall">
          {preview.map((item, index) => <Link to="/login" className={`menu-tile tile-${(index % 9) + 1}`} key={item.item_id}><span className="tile-index">{String(index + 1).padStart(2, "0")}</span><div><small>{item.category}</small><h3>{item.item_name}</h3></div><strong>AED {Number(item.price).toFixed(2)}</strong><ArrowUpRight className="tile-arrow" size={20} /></Link>)}
        </div>
      </section>

      <section className="landing-pickup-band"><div><span className="section-number">02</span><h2>Pick the day.<br /><em>Pick the moment.</em></h2></div><div className="pickup-band-copy"><p>Once you're signed in, checkout gives you a full calendar and 20-minute pickup windows. No vague “later”. No guessing.</p><Link to="/login" className="hero-cta">Continue to CanBook <ArrowUpRight size={19} /></Link></div></section>

      <footer className="landing-footer"><div><Link to="/" className="brand-lockup">CAN<span>BOOK</span><small>GIIS CANTEEN</small></Link><p>Less queue. Better lunch.</p></div><Link to="/login" className="footer-cta">Login <ArrowUpRight size={18} /></Link></footer>
    </main>
  );
}

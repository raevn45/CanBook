import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock3, Plus, Sparkles, Zap } from "lucide-react";

const menu = [
  ["01", "Chicken Manchurian + Fried Rice", 12, "MEAL", "🍗"],
  ["02", "Veg Manchurian + Fried Rice", 10, "MEAL", "🥢"],
  ["03", "Puff", 5, "SNACK", "🥐"],
  ["04", "Chai Cake", 3, "SWEET", "🍰"],
  ["05", "Chole Puri", 10, "MEAL", "🍛"],
  ["06", "Boiled Egg", 2, "SNACK", "🥚"],
  ["07", "Veg Sandwich", 7, "SANDWICH", "🥪"],
  ["08", "Chicken Sandwich", 7, "SANDWICH", "🥪"],
  ["09", "Aalo Paratha", 10, "MEAL", "🫓"],
];

export default function Landing() {
  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <Link to="/" className="brand"><span className="brand-mark">CB</span><span><strong>CanBook</strong><small>GIIS Canteen</small></span></Link>
        <div className="nav-links"><a href="#menu-preview">Menu</a><a href="#how-it-works">How it works</a><a href="#pickup">Pickup</a></div>
        <div className="nav-actions"><Link to="/login" className="nav-login">Log in</Link><Link to="/register" className="nav-order">Order now <ArrowRight size={16} /></Link></div>
      </nav>

      <section className="landing-hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> SCHOOL CANTEEN / LIVE <Sparkles size={14} /></div>
          <h1>Lunch without<br /><span>the queue.</span></h1>
          <p className="hero-description">See what's cooking, build your order, choose a real pickup date and time, then walk in when it's ready.</p>
          <div className="hero-cta-row"><Link to="/register" className="hero-primary">Start ordering <ArrowRight size={18} /></Link><a href="#menu-preview" className="hero-secondary">See today's menu ↓</a></div>
          <div className="hero-proof"><span><Zap size={14} /> Live menu</span><span><CalendarDays size={14} /> Date picker</span><span><Clock3 size={14} /> 20-min slots</span></div>
        </div>
        <div className="hero-visual">
          <div className="hero-orbit orbit-a" /><div className="hero-orbit orbit-b" />
          <div className="hero-sticker sticker-a">AED<br /><strong>12</strong></div>
          <div className="hero-sticker sticker-b">NO<br /><strong>QUEUE</strong></div>
          <div className="hero-order-card">
            <div className="floating-card-top"><span>YOUR NEXT PICKUP</span><span className="live-pill"><i /> Live</span></div>
            <div className="pickup-big"><div className="pickup-icon">🍱</div><div><small>Chicken Manchurian + Fried Rice</small><strong>AED 12</strong></div></div>
            <div className="pickup-line"><CalendarDays size={17} /><span>Tuesday · 12 Mar</span><b>12:20 PM</b></div>
            <div className="pickup-progress"><span /><span /><span /><span /></div>
            <div className="pickup-ready"><strong>READY WHEN YOU ARE.</strong><small>Order ahead. Grab. Go.</small></div>
          </div>
        </div>
      </section>

      <section className="marquee-section"><div className="marquee-static">ORDER AHEAD <b>✦</b> LIVE MENU <b>✦</b> AED PRICES <b>✦</b> PICKUP SLOTS <b>✦</b> LESS QUEUE <b>✦</b> MORE LUNCH <b>✦</b></div></section>

      <section className="how-section" id="how-it-works">
        <div className="section-heading"><div><span className="section-kicker">HOW IT WORKS</span><h2>Three moves.<br /><em>That's lunch.</em></h2></div><p>CanBook keeps the ordering flow simple while giving students and the canteen exactly the information they need.</p></div>
        <div className="steps-grid">
          <article className="step-card step-orange"><span className="step-number">01</span><div className="step-icon">👀</div><h3>Pick your food.</h3><p>Browse the live school menu with AED prices and availability.</p></article>
          <article className="step-card step-yellow"><span className="step-number">02</span><div className="step-icon">📅</div><h3>Book your slot.</h3><p>Choose a date and a 20-minute pickup window that works for you.</p></article>
          <article className="step-card step-purple"><span className="step-number">03</span><div className="step-icon">🏃</div><h3>Grab & go.</h3><p>Watch your order status and collect it when the kitchen is ready.</p></article>
        </div>
      </section>

      <section className="menu-preview-section" id="menu-preview">
        <div className="menu-preview-header"><div><span className="section-kicker">TODAY'S MENU</span><h2>What's cooking?</h2></div><div className="menu-live"><span /> Kitchen menu</div></div>
        <div className="landing-menu-grid">{menu.map(([number, name, price, category, emoji]) => <article className="landing-menu-card" key={number}><div className="landing-menu-top"><span>{number}</span><i>{emoji}</i><b>AED {price}</b></div><small>{category}</small><h3>{name}</h3><Link to="/register">Add to order <Plus size={15} /></Link></article>)}</div>
      </section>

      <section className="why-section" id="pickup">
        <div className="why-card"><div className="why-copy"><span className="section-kicker">PICKUP, SORTED</span><h2>Know exactly<br /><span>when to go.</span></h2><p>The checkout gives you a proper school-day calendar and clear pickup windows. No mystery slot. No queue roulette.</p><div className="why-list"><div>✓ Choose a date</div><div>✓ Choose a 20-minute window</div><div>✓ See the selection in your order summary</div><div>✓ Existing Flask order API stays in charge</div></div><Link to="/register" className="why-button">Build an order <ArrowRight size={17} /></Link></div><div className="why-visual"><div className="calendar-art"><span>MON</span><strong>12</strong><small>MAR</small></div><div className="slot-art"><Clock3 size={18} /><strong>12:20 — 12:40</strong><small>Pickup window</small></div></div></div>
      </section>

      <section className="final-cta"><span className="section-kicker">HUNGRY?</span><h2>Go make your<br /><em>lunch happen.</em></h2><Link to="/register" className="hero-primary">Start ordering <ArrowRight size={18} /></Link></section>
      <footer className="landing-footer"><span>CANBOOK</span><span>School canteen ordering</span><span>AED · LIVE · PICKUP</span></footer>
    </main>
  );
}

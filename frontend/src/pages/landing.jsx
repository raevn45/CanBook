import { ArrowDownRight, ArrowUpRight, CalendarDays, Clock3, MoveRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { menuFallback } from "../constants";

const notes = ["NO QUEUE", "AED PRICING", "LIVE STATUS", "PICKUP SMART"];

export default function Landing() {
  return (
    <main className="landing-new">
      <nav className="landing-nav">
        <Link to="/" className="brand-lockup">CAN<span>BOOK</span><small>GIIS CANTEEN</small></Link>
        <div className="landing-nav-links"><a href="#menu">Menu</a><a href="#flow">How it works</a><Link to="/login">Sign in</Link></div>
        <Link to="/register" className="nav-pill">Start ordering <ArrowUpRight size={17} /></Link>
      </nav>

      <section className="landing-hero">
        <div className="hero-copy-new">
          <div className="hero-tag"><Sparkles size={14} /> SCHOOL LUNCH, REIMAGINED</div>
          <h1>Eat well.<br /><span>Wait less.</span></h1>
          <p>CanBook turns the school canteen into a tiny, delightful ordering system — pick your food, choose your pickup date and time, then go.</p>
          <div className="hero-actions"><Link to="/register" className="hero-cta">Order lunch <ArrowUpRight size={19} /></Link><a href="#menu" className="hero-secondary">See the menu <ArrowDownRight size={18} /></a></div>
          <div className="hero-meta"><span><b>09</b> menu favourites</span><span><b>20m</b> pickup windows</span><span><b>AED</b> student pricing</span></div>
        </div>

        <div className="hero-collage">
          <div className="collage-back">CAN<br />BOOK</div>
          <div className="order-ticket">
            <div className="ticket-top"><span>ORDER / 0148</span><span>LIVE</span></div>
            <div className="ticket-main"><small>TODAY'S PICK</small><h2>Chicken<br />Manchurian</h2><div className="ticket-price">AED 12</div></div>
            <div className="ticket-line" />
            <div className="ticket-row"><span><CalendarDays size={15} /> Tue · 17 Sep</span><strong>12:20</strong></div>
            <div className="ticket-row"><span><Clock3 size={15} /> Pickup window</span><strong>20 MIN</strong></div>
            <Link to="/register" className="ticket-button">Build this order <MoveRight size={17} /></Link>
          </div>
          <div className="sticker sticker-a">FRESH<br />TODAY</div>
          <div className="sticker sticker-b">NO<br />QUEUE</div>
        </div>
      </section>

      <div className="ticker-strip">{notes.map((note) => <span key={note}>{note} <b>✳</b></span>)}</div>

      <section className="menu-showcase" id="menu">
        <div className="section-intro"><div><span className="section-number">01</span><h2>What's<br /><em>good</em> today?</h2></div><p>All your canteen staples, clearly priced in AED. The live menu comes straight from the Flask backend, so availability stays real.</p></div>
        <div className="menu-wall">{menuFallback.map((item, index) => <Link to="/register" className={`menu-tile tile-${index + 1}`} key={item.item_id}><span className="tile-index">0{index + 1}</span><div><small>{item.category}</small><h3>{item.item_name}</h3></div><strong>AED {item.price}</strong><ArrowUpRight className="tile-arrow" size={20} /></Link>)}</div>
      </section>

      <section className="flow-section" id="flow">
        <div className="flow-heading"><span className="section-number">02</span><h2>Three moves.<br /><em>That's lunch.</em></h2></div>
        <div className="flow-grid"><article><span>01</span><CalendarDays size={28} /><h3>Pick a day</h3><p>Use the proper calendar instead of guessing what “today” means.</p></article><article><span>02</span><Clock3 size={28} /><h3>Pick a window</h3><p>Choose a 20-minute pickup slot that works for your school day.</p></article><article><span>03</span><MoveRight size={28} /><h3>Grab & go</h3><p>Your order lands in the canteen queue before you arrive.</p></article></div>
      </section>

      <footer className="landing-footer"><div><span className="brand-lockup">CAN<span>BOOK</span><small>GIIS CANTEEN</small></span><p>Less queue. Better lunch.</p></div><Link to="/register" className="footer-cta">Get started <ArrowUpRight size={18} /></Link></footer>
    </main>
  );
}

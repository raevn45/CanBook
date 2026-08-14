import { ArrowDownRight, ArrowUpRight, CalendarDays, Clock3, MoveRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { menuFallback } from "../constants";

const notes = ["NO QUEUE", "AED PRICING", "LIVE STATUS", "SMART PICKUP"];

export default function Landing() {
  return (
    <main className="landing-new">
      <nav className="landing-nav">
        <Link to="/" className="brand-lockup">
          CAN<span>BOOK</span>
          <small>GIIS CANTEEN</small>
        </Link>

        <div className="landing-nav-links">
          <a href="#menu">Menu</a>
          <Link to="/login">Login</Link>
        </div>

        <Link to="/login" className="nav-pill">
          Start ordering <ArrowUpRight size={17} />
        </Link>
      </nav>

      <section className="landing-hero">
        <div className="hero-copy-new">
          <div className="hero-tag"><Sparkles size={14} /> SCHOOL LUNCH / REIMAGINED</div>
          <h1>Lunch,<br /><span>without</span><br />the queue.</h1>
          <p>Browse the canteen menu, build your order, choose the exact pickup date and time, and walk in when your food is ready.</p>
          <div className="hero-actions">
            <Link to="/login" className="hero-cta">Order lunch <ArrowUpRight size={19} /></Link>
            <a href="#menu" className="hero-secondary">See the menu <ArrowDownRight size={18} /></a>
          </div>
          <div className="hero-meta">
            <span><b>09</b> canteen favourites</span>
            <span><b>20m</b> pickup windows</span>
            <span><b>AED</b> student pricing</span>
          </div>
        </div>

        <div className="hero-collage" aria-hidden="true">
          <div className="collage-back">CAN<br />BOOK</div>
          <div className="order-ticket">
            <div className="ticket-top"><span>CANBOOK / PICKUP</span><span>LIVE</span></div>
            <div className="ticket-main">
              <small>TODAY'S PICK</small>
              <h2>Chicken<br />Manchurian</h2>
              <div className="ticket-price">AED 12</div>
            </div>
            <div className="ticket-line" />
            <div className="ticket-row"><span><CalendarDays size={15} /> School day</span><strong>12:20</strong></div>
            <div className="ticket-row"><span><Clock3 size={15} /> Pickup window</span><strong>20 MIN</strong></div>
            <Link to="/login" className="ticket-button">Build your order <MoveRight size={17} /></Link>
          </div>
          <div className="sticker sticker-a">FRESH<br />TODAY</div>
          <div className="sticker sticker-b">NO<br />QUEUE</div>
        </div>
      </section>

      <div className="ticker-strip">
        {notes.map((note) => <span key={note}>{note} <b>✳</b></span>)}
      </div>

      <section className="menu-showcase" id="menu">
        <div className="section-intro">
          <div><span className="section-number">01</span><h2>What's<br /><em>good</em> today?</h2></div>
          <p>Your school canteen staples, clearly priced in AED. Log in to add anything to your cart and continue to pickup planning.</p>
        </div>
        <div className="menu-wall">
          {menuFallback.map((item, index) => (
            <Link to="/login" className={`menu-tile tile-${index + 1}`} key={item.item_id}>
              <span className="tile-index">0{index + 1}</span>
              <div><small>{item.category}</small><h3>{item.item_name}</h3></div>
              <strong>AED {item.price}</strong>
              <ArrowUpRight className="tile-arrow" size={20} />
            </Link>
          ))}
        </div>
      </section>

      <section className="landing-pickup-band">
        <div><span className="section-number">02</span><h2>Pick the day.<br /><em>Pick the moment.</em></h2></div>
        <div className="pickup-band-copy">
          <p>Once you're signed in, checkout gives you a full calendar and 20-minute pickup windows. No vague “later”. No guessing.</p>
          <Link to="/login" className="hero-cta">Continue to CanBook <ArrowUpRight size={19} /></Link>
        </div>
      </section>

      <footer className="landing-footer">
        <div><span className="brand-lockup">CAN<span>BOOK</span><small>GIIS CANTEEN</small></span><p>Less queue. Better lunch.</p></div>
        <Link to="/login" className="footer-cta">Login <ArrowUpRight size={18} /></Link>
      </footer>
    </main>
  );
}

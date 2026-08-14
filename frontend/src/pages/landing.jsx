import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  Clock3,
  Flame,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

export default function Landing() {
  const marqueeRef = useRef(null);

  useEffect(() => {
    const marquee = marqueeRef.current;

    if (!marquee) return;

    let animationFrame;
    let position = 0;

    const animate = () => {
      position -= 0.45;

      if (Math.abs(position) >= marquee.scrollWidth / 2) {
        position = 0;
      }

      marquee.style.transform = `translate3d(${position}px, 0, 0)`;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <main className="landing-page">
      <div className="landing-noise" />

      <div className="landing-orb orb-orange" />
      <div className="landing-orb orb-pink" />
      <div className="landing-orb orb-purple" />
      <div className="landing-orb orb-yellow" />

      <nav className="landing-nav">
        <Link to="/" className="brand">
          <span className="brand-mark">CB</span>

          <span className="brand-copy">
            <strong>CanBook</strong>
            <small>GIIS Canteen</small>
          </span>
        </Link>

        <div className="nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#menu-preview">Today's menu</a>
          <a href="#why-canbook">Why CanBook</a>
        </div>

        <div className="nav-actions">
          <Link to="/login" className="nav-login">
            Staff
          </Link>

          <Link to="/register" className="nav-order">
            Order now
            <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="hero-decoration hero-decoration-one">✦</div>
        <div className="hero-decoration hero-decoration-two">+</div>
        <div className="hero-decoration hero-decoration-three">✷</div>

        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            THE GIIS CANTEEN, BUT BETTER
            <Sparkles size={15} />
          </div>

          <h1>
            Lunch should be
            <span className="hero-highlight"> exciting.</span>
          </h1>

          <p className="hero-description">
            Browse what’s cooking, build your order, beat the queue and grab
            your food when it’s ready.
          </p>

          <div className="hero-cta-row">
            <Link to="/register" className="hero-primary">
              <span>Start ordering</span>
              <ArrowRight size={19} />
            </Link>

            <a href="#how-it-works" className="hero-secondary">
              See how it works
              <ArrowDownRight size={17} />
            </a>
          </div>

          <div className="hero-proof">
            <div className="proof-avatars">
              <span>😎</span>
              <span>🍜</span>
              <span>🧋</span>
              <span>✨</span>
            </div>

            <div>
              <div className="proof-stars">
                <Star size={13} fill="currentColor" />
                <Star size={13} fill="currentColor" />
                <Star size={13} fill="currentColor" />
                <Star size={13} fill="currentColor" />
                <Star size={13} fill="currentColor" />
              </div>

              <p>Loved by hungry students.</p>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-spark spark-a">✦</div>
          <div className="visual-spark spark-b">✧</div>
          <div className="visual-spark spark-c">+</div>

          <div className="menu-floating-card">
            <div className="floating-card-top">
              <span>LIVE MENU</span>
              <span className="live-pill">
                <i />
                Live
              </span>
            </div>

            <div className="mini-food-row">
              <div className="mini-food-icon orange">🍜</div>
              <div>
                <strong>Hakka Noodles</strong>
                <span>Popular today</span>
              </div>
              <b>₹90</b>
            </div>

            <div className="mini-food-row">
              <div className="mini-food-icon yellow">🥪</div>
              <div>
                <strong>Cheese Sandwich</strong>
                <span>Freshly made</span>
              </div>
              <b>₹60</b>
            </div>

            <div className="mini-food-row">
              <div className="mini-food-icon purple">🧋</div>
              <div>
                <strong>Cold Coffee</strong>
                <span>Student favourite</span>
              </div>
              <b>₹70</b>
            </div>
          </div>

          <div className="hero-phone">
            <div className="phone-notch" />

            <div className="phone-topbar">
              <div>
                <span>Wednesday</span>
                <strong>Today's lunch</strong>
              </div>

              <div className="phone-avatar">🍴</div>
            </div>

            <div className="phone-greeting">
              <span>Hey, hungry human 👋</span>
              <strong>What are we eating?</strong>
            </div>

            <div className="phone-search">
              <span>⌕</span>
              Search the menu...
            </div>

            <div className="phone-category-row">
              <span className="active">All</span>
              <span>Meals</span>
              <span>Snacks</span>
              <span>Drinks</span>
            </div>

            <div className="phone-featured">
              <div className="featured-copy">
                <span>🔥 MOST ORDERED</span>
                <strong>Hakka<br />Noodles</strong>
                <small>₹90 · 8 min</small>
              </div>

              <div className="featured-food">🍜</div>
            </div>

            <div className="phone-section-title">
              <strong>Popular today</strong>
              <span>See all</span>
            </div>

            <div className="phone-food-grid">
              <div className="phone-food-card">
                <span className="phone-food-emoji">🥪</span>
                <strong>Cheese Sandwich</strong>
                <small>₹60</small>
              </div>

              <div className="phone-food-card">
                <span className="phone-food-emoji">🧋</span>
                <strong>Cold Coffee</strong>
                <small>₹70</small>
              </div>
            </div>

            <div className="phone-cart">
              <div>
                <span>2 items</span>
                <strong>₹150</strong>
              </div>

              <button>
                View cart
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <div className="order-status-card">
            <div className="status-icon">
              <Check size={18} />
            </div>

            <div>
              <span>ORDER READY</span>
              <strong>#CB2048 · Counter 02</strong>
            </div>

            <div className="status-time">
              <Clock3 size={14} />
              2 min
            </div>
          </div>

          <div className="floating-price">
            <span>YOUR LUNCH</span>
            <strong>₹150</strong>
            <small>saved your seat in the queue ✨</small>
          </div>
        </div>
      </section>

      <section className="marquee-section">
        <div className="marquee-track" ref={marqueeRef}>
          <div className="marquee-set">
            <span>NO QUEUE</span>
            <i>✦</i>
            <span>REAL-TIME MENU</span>
            <i>✦</i>
            <span>QUICK PICKUP</span>
            <i>✦</i>
            <span>LESS CHAOS</span>
            <i>✦</i>
            <span>MORE LUNCH</span>
            <i>✦</i>
            <span>NO QUEUE</span>
            <i>✦</i>
            <span>REAL-TIME MENU</span>
            <i>✦</i>
            <span>QUICK PICKUP</span>
            <i>✦</i>
            <span>LESS CHAOS</span>
            <i>✦</i>
            <span>MORE LUNCH</span>
            <i>✦</i>
          </div>
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="section-heading">
          <div>
            <span className="section-kicker">HOW IT WORKS</span>
            <h2>
              Three clicks.
              <br />
              <em>Zero queue.</em>
            </h2>
          </div>

          <p>
            CanBook takes the boring bits out of buying lunch so you can spend
            your break actually taking a break.
          </p>
        </div>

        <div className="steps-grid">
          <article className="step-card step-orange">
            <span className="step-number">01</span>
            <div className="step-icon">👀</div>
            <h3>Pick your food.</h3>
            <p>
              See what's available right now. No guessing. No walking to the
              canteen just to discover your favourite is gone.
            </p>
            <span className="step-arrow">
              <ArrowRight size={18} />
            </span>
          </article>

          <article className="step-card step-yellow">
            <span className="step-number">02</span>
            <div className="step-icon">🛒</div>
            <h3>Book your order.</h3>
            <p>
              Add your favourites, choose your pickup time and lock it in
              before the lunch rush hits.
            </p>
            <span className="step-arrow">
              <ArrowRight size={18} />
            </span>
          </article>

          <article className="step-card step-purple">
            <span className="step-number">03</span>
            <div className="step-icon">🏃</div>
            <h3>Grab & go.</h3>
            <p>
              Get your order number, watch the live status and collect it when
              the kitchen says GO.
            </p>
            <span className="step-arrow">
              <ArrowRight size={18} />
            </span>
          </article>
        </div>
      </section>

      <section className="menu-preview-section" id="menu-preview">
        <div className="menu-preview-header">
          <div>
            <span className="section-kicker">RIGHT NOW</span>
            <h2>What's cooking?</h2>
          </div>

          <div className="menu-live">
            <span />
            Kitchen is live
          </div>
        </div>

        <div className="food-showcase">
          <article className="big-food-card food-card-orange">
            <div className="food-card-top">
              <span className="food-tag">
                <Flame size={13} />
                Bestseller
              </span>
              <span>₹90</span>
            </div>

            <div className="big-food-emoji">🍜</div>

            <div className="big-food-info">
              <span>MAIN COURSE</span>
              <h3>Hakka Noodles</h3>
              <p>Wok-tossed noodles with veggies and just the right kick.</p>
            </div>

            <Link to="/register" className="food-add">
              Add to order
              <ArrowRight size={16} />
            </Link>
          </article>

          <article className="big-food-card food-card-yellow">
            <div className="food-card-top">
              <span className="food-tag">Fresh today</span>
              <span>₹60</span>
            </div>

            <div className="big-food-emoji">🥪</div>

            <div className="big-food-info">
              <span>SNACK</span>
              <h3>Cheese Sandwich</h3>
              <p>Toasty, cheesy and made for a very important lunch break.</p>
            </div>

            <Link to="/register" className="food-add">
              Add to order
              <ArrowRight size={16} />
            </Link>
          </article>

          <article className="big-food-card food-card-purple">
            <div className="food-card-top">
              <span className="food-tag">Student pick</span>
              <span>₹70</span>
            </div>

            <div className="big-food-emoji">🧋</div>

            <div className="big-food-info">
              <span>DRINK</span>
              <h3>Cold Coffee</h3>
              <p>Cold, creamy, caffeinated. Basically a personality trait.</p>
            </div>

            <Link to="/register" className="food-add">
              Add to order
              <ArrowRight size={16} />
            </Link>
          </article>
        </div>
      </section>

      <section className="why-section" id="why-canbook">
        <div className="why-card">
          <div className="why-copy">
            <span className="section-kicker">WHY CANBOOK?</span>

            <h2>
              Your lunch break
              <span> deserves better.</span>
            </h2>

            <p>
              CanBook isn't trying to make school feel like a corporate
              cafeteria. It's built around one simple idea: ordering food
              should be fast, fun and ridiculously easy.
            </p>

            <div className="why-list">
              <div>
                <Check size={17} />
                <span>Live kitchen status</span>
              </div>

              <div>
                <Check size={17} />
                <span>Pickup time estimates</span>
              </div>

              <div>
                <Check size={17} />
                <span>Simple student ordering</span>
              </div>

              <div>
                <Check size={17} />
                <span>Less queue chaos for staff</span>
              </div>
            </div>

            <Link to="/register" className="why-button">
              I want in
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="why-visual">
            <div className="why-circle">
              <Zap size={42} fill="currentColor" />
            </div>

            <div className="why-stat stat-one">
              <strong>5 min</strong>
              <span>avg. pickup</span>
            </div>

            <div className="why-stat stat-two">
              <strong>LIVE</strong>
              <span>kitchen updates</span>
            </div>

            <div className="why-sticker">
              <span>HUNGRY?</span>
              <strong>WE GOT<br />YOU.</strong>
              <span>🍟 ✦ 🍜</span>
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="final-stars">✦　✧　✦</div>

        <span className="section-kicker">READY?</span>

        <h2>
          Stop waiting.
          <br />
          <em>Start eating.</em>
        </h2>

        <p>Your next lunch break just got a whole lot better.</p>

        <Link to="/register" className="final-button">
          Start ordering
          <ArrowRight size={19} />
        </Link>
      </section>

      <footer className="landing-footer">
        <div className="footer-brand">
          <span className="brand-mark">CB</span>
          <strong>CanBook</strong>
        </div>

        <span>Made for GIIS students & canteen staff.</span>

        <Link to="/login">
          Staff login
          <ArrowRight size={14} />
        </Link>
      </footer>
    </main>
  );
}
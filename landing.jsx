import { Navigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/authcontext";
import GlowOrb from "../components/effects/gloworb";
import FloatingPixels from "../components/effects/floatingpixels";

export default function Landing() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return (
      <Navigate
        to={user.role === "canteen" ? "/canteen" : "/student"}
        replace
      />
    );
  }

  return (
    <div className="landing">
      <GlowOrb />
      <FloatingPixels />

      <section className="hero container">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="pixel-label">school food / zero queue</div>
          <h1 className="hero-title">
            lunch
            <br />
            without
            <br />
            the <span>wait.</span>
          </h1>
          <p className="hero-description">
            canbook lets students order ahead, choose a pickup slot, and
            collect their food without standing in the canteen queue.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="pixel-button">
              get started →
            </Link>
            <Link to="/login" className="secondary-button">
              sign in
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="hero-terminal"
          initial={{ opacity: 0, scale: 0.8, rotate: 3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <div className="terminal-top">
            <span>canbook.exe</span>
            <span>● ● ●</span>
          </div>
          <div className="terminal-body">
            <span className="terminal-green">SYSTEM ONLINE</span>
            <h2>NEXT PICKUP</h2>
            <div className="terminal-time">11:20</div>
            <div className="terminal-food">
              <span>pizza</span>
              <span>x1</span>
            </div>
            <div className="terminal-food">
              <span>juice</span>
              <span>x1</span>
            </div>
            <button className="pixel-button">ready</button>
          </div>
        </motion.div>
      </section>

      <section className="feature-strip container">
        <div>
          <strong>01</strong>
          order ahead
        </div>
        <div>
          <strong>02</strong>
          choose pickup
        </div>
        <div>
          <strong>03</strong>
          skip the queue
        </div>
        <div>
          <strong>04</strong>
          smarter demand
        </div>
      </section>
    </div>
  );
}
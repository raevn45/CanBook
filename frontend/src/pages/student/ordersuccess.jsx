import { Link, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="success-page">
      <motion.div
        className="success-card"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring" }}
      >
        <div className="success-icon">✓</div>
        <div className="pixel-label">order confirmed</div>
        <h1>you're booked.</h1>
        <p>order #{orderId} has been sent to the canteen.</p>

        <div className="success-actions">
          <Link to="/orders" className="pixel-button">
            view order
          </Link>
          <Link to="/menu" className="secondary-button">
            order more
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

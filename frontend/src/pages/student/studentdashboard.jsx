import { Link } from "react-router-dom";
import { useAuth } from "../../context/authcontext";
import { useCart } from "../../context/cartcontext";
import GlowOrb from "../../components/effects/gloworb";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { count } = useCart();

  return (
    <div className="dashboard-page">
      <GlowOrb />

      <div className="page-container">
        <div className="dashboard-hero">
          <div>
            <div className="pixel-label">student / online</div>
            <h1>hey, {user?.name}.</h1>
            <p>hungry? let's fix that.</p>
          </div>

          <Link to="/menu" className="pixel-button">
            browse menu →
          </Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span>cart items</span>
            <strong>{count}</strong>
          </div>

          <div className="stat-card">
            <span>pickup</span>
            <strong>01</strong>
          </div>

          <div className="stat-card">
            <span>status</span>
            <strong>live</strong>
          </div>
        </div>

        <div className="dashboard-actions">
          <Link to="/menu" className="big-action">
            <span>🍱</span>
            <strong>order food</strong>
            <small>browse today's menu</small>
          </Link>

          <Link to="/orders" className="big-action">
            <span>📦</span>
            <strong>my orders</strong>
            <small>track your orders</small>
          </Link>
        </div>
      </div>
    </div>
  );
}

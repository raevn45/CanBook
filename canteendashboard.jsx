import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { canteenapi } from "../../api";

export default function CanteenDashboard() {
  const [data, setData] = useState({
    total_orders: 0,
    revenue: 0,
    demand: [],
    orders: [],
  });

  useEffect(() => {
    canteenapi.dashboard().then(setData);
  }, []);

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <div className="pixel-label">canteen / control center</div>
          <h1>good morning.</h1>
          <p>here's what today's demand looks like.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>today's orders</span>
          <strong>{data.total_orders}</strong>
        </div>

        <div className="stat-card">
          <span>expected revenue</span>
          <strong>AED {Number(data.revenue).toFixed(0)}</strong>
        </div>

        <div className="stat-card">
          <span>top item</span>
          <strong>{data.demand[0]?.item_name || "—"}</strong>
        </div>
      </div>

      <div className="canteen-grid">
        <div className="dashboard-panel">
          <div className="panel-heading">
            <h2>today's demand</h2>
            <Link to="/canteen/analytics">full analytics →</Link>
          </div>

          {data.demand.map((item, index) => (
            <motion.div
              key={item.item_name}
              className="demand-row"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <span>{item.item_name}</span>
              <strong>{item.quantity}</strong>
            </motion.div>
          ))}
        </div>

        <div className="dashboard-panel">
          <div className="panel-heading">
            <h2>recent orders</h2>
            <Link to="/canteen/orders">view all →</Link>
          </div>

          {data.orders.slice(0, 5).map((order) => (
            <div className="mini-order" key={order.order_id}>
              <span>#{order.order_id}</span>
              <strong>{order.name}</strong>
              <small>{order.status}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { orderapi } from "../../api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    orderapi.getall().then((data) => setOrders(data.orders));
  }, []);

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <div className="pixel-label">canbook / history</div>
          <h1>your orders.</h1>
        </div>
      </div>

      <div className="order-list">
        {orders.length === 0 && (
          <div className="empty-card">no orders yet.</div>
        )}

        {orders.map((order, index) => (
          <motion.div
            key={order.order_id}
            className="order-row"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div>
              <span className="order-number">#{order.order_id}</span>
              <strong>AED {Number(order.total_amount).toFixed(2)}</strong>
            </div>

            <div>
              <span>pickup</span>
              <strong>{order.pickup_slot}</strong>
            </div>

            <div>
              <span>status</span>
              <strong className="cyan">{order.status}</strong>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

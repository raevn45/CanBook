import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { orderapi } from "../../api";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    orderapi.getone(id).then(setOrder);
  }, [id]);

  if (!order) {
    return <div className="loading">loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="pixel-label">order #{order.order_id}</div>
      <h1 className="profile-title">order details.</h1>

      <div className="dashboard-panel">
        <h2>{order.name}</h2>
        <p>pickup: {order.pickup_slot}</p>
        <p>status: {order.status}</p>

        <div className="order-detail-items">
          {order.items.map((item) => (
            <div key={item.item_name} className="detail-item">
              <span>{item.item_name}</span>
              <span>x{item.quantity}</span>
              <strong>AED {Number(item.price_at_order).toFixed(2)}</strong>
            </div>
          ))}
        </div>

        <div className="final-total">
          <span>total</span>
          <strong>AED {Number(order.total_amount).toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
}

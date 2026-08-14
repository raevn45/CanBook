import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { canteenapi } from "../../api";

export default function Orders() {
  const [data, setData] = useState({ orders: [] });

  const loadOrders = () => {
    canteenapi.dashboard().then(setData);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await canteenapi.updateorder(id, status);
    loadOrders();
  };

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <div className="pixel-label">canteen / orders</div>
          <h1>today's queue.</h1>
        </div>
      </div>

      <div className="order-list">
        {data.orders.map((order) => (
          <div className="canteen-order" key={order.order_id}>
            <div>
              <span>order</span>
              <strong>#{order.order_id}</strong>
            </div>

            <div>
              <span>student</span>
              <strong>{order.name}</strong>
            </div>

            <div>
              <span>pickup</span>
              <strong>{order.pickup_slot}</strong>
            </div>

            <div>
              <span>total</span>
              <strong>AED {Number(order.total_amount).toFixed(2)}</strong>
            </div>

            <select
              value={order.status}
              onChange={(event) =>
                updateStatus(order.order_id, event.target.value)
              }
            >
              <option>Pending</option>
              <option>Preparing</option>
              <option>Ready</option>
              <option>Collected</option>
              <option>Cancelled</option>
            </select>

            <Link
              to={`/canteen/orders/${order.order_id}`}
              className="arrow-button"
            >
              →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

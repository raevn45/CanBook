import { useEffect, useState } from "react";
import { canteenapi } from "../../api";

export default function MenuManagement() {
  const [items, setItems] = useState([]);

  const load = () => {
    canteenapi.menu().then((data) => setItems(data.items));
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (item) => {
    await canteenapi.toggleitem(item.item_id, !item.available);
    load();
  };

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <div className="pixel-label">canteen / menu</div>
          <h1>menu control.</h1>
        </div>
      </div>

      <div className="menu-management">
        {items.map((item) => (
          <div className="management-row" key={item.item_id}>
            <div>
              <strong>{item.item_name}</strong>
              <span>{item.category}</span>
            </div>

            <strong>AED {Number(item.price).toFixed(2)}</strong>

            <button
              className={
                item.available
                  ? "availability available"
                  : "availability"
              }
              onClick={() => toggle(item)}
            >
              {item.available ? "available" : "unavailable"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

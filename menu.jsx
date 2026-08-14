import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { menuapi } from "../../api";
import { useCart } from "../../context/cartcontext";
import { categories } from "../../constants";

export default function Menu() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("all");
  const { addToCart, count } = useCart();

  useEffect(() => {
    menuapi.get().then((data) => setItems(data.items));
  }, []);

  const filteredItems =
    category === "all"
      ? items
      : items.filter((item) => item.category === category);

  return (
    <div className="page-container">
      <section className="page-heading">
        <div>
          <div className="pixel-label">canteen / live menu</div>
          <h1>pick your fuel.</h1>
          <p>order now. collect later.</p>
        </div>

        <Link to="/cart" className="pixel-button">
          cart ({count})
        </Link>
      </section>

      <div className="category-bar">
        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? "category active" : "category"}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.item_id}
            className="menu-card"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ y: -7 }}
          >
            <div className="food-icon">🍱</div>
            <div className="menu-category">{item.category}</div>
            <h2>{item.item_name}</h2>
            <p>{item.description}</p>
            <div className="menu-bottom">
              <strong>AED {Number(item.price).toFixed(2)}</strong>
              <button
                className="small-button"
                onClick={() => addToCart(item)}
              >
                + add
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

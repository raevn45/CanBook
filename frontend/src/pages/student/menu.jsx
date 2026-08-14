import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Search, ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { menuapi } from "../../api";
import { useCart } from "../../context/cartcontext";
import { categories, menuFallback } from "../../constants";

const legacyNames = new Set(["cheese pizza", "fresh juice", "french fries", "chocolate cookie"]);

function usableMenu(items) {
  const live = Array.isArray(items) ? items.filter((item) => item?.available !== false) : [];
  const hasCurrentMenu = live.some((item) => menuFallback.some((fallback) => fallback.item_name === item.item_name));
  if (!hasCurrentMenu) return menuFallback;
  return live.filter((item) => !legacyNames.has(String(item.item_name || "").toLowerCase()));
}

export default function Menu() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);
  const { addToCart, count } = useCart();

  useEffect(() => {
    menuapi.get().then((data) => setItems(usableMenu(data.items))).catch(() => setItems(menuFallback)).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const name = (item.item_name || "").toLowerCase();
      const description = (item.description || "").toLowerCase();
      return matchesCategory && (!query || name.includes(query) || description.includes(query));
    });
  }, [items, category, search]);

  const add = (item) => {
    addToCart(item);
    setAddedId(item.item_id);
    window.setTimeout(() => setAddedId(null), 850);
  };

  return (
    <main className="app-page menu-page-new">
      <header className="shop-header">
        <div><span className="micro-label"><Sparkles size={13} /> CANBOOK / LIVE MENU</span><h1>Pick your <em>fuel.</em></h1><p>Every item below comes from the current school canteen menu. Prices are in AED.</p></div>
        <motion.div whileHover={{ y: -4 }} whileTap={{ scale: .96 }}><Link to="/cart" className="floating-cart"><ShoppingBag size={18} /><span>Cart</span><b>{count}</b></Link></motion.div>
      </header>

      <div className="menu-toolbar">
        <div className="category-pills" role="tablist" aria-label="Menu categories">
          {categories.map((item) => (
            <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>
              {category === item && <motion.span layoutId="category-pill" className="category-pill-highlight" />}
              <span>{item}</span>
            </button>
          ))}
        </div>
        <label className="search-box"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search lunch…" /></label>
      </div>

      {loading ? <div className="loading-card">Loading today's menu…</div> : <motion.div layout className="live-menu-grid">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, index) => (
            <motion.article
              layout
              key={item.item_id}
              className="live-menu-card"
              initial={{ opacity: 0, y: 25, scale: .96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: .9 }}
              transition={{ delay: Math.min(index * .045, .35), type: "spring", stiffness: 240, damping: 22 }}
              whileHover={{ y: -9, rotate: index % 2 ? .35 : -.35 }}
              whileTap={{ scale: .985 }}
            >
              <div className="menu-card-top"><span>{String(index + 1).padStart(2, "0")}</span><small>{item.category || "canteen"}</small></div>
              <motion.div className="food-mark" whileHover={{ rotate: 10, scale: 1.14 }}>{String(item.item_name).slice(0, 1)}</motion.div>
              <h2>{item.item_name}</h2>
              <p>{item.description || "Freshly prepared at the school canteen."}</p>
              <div className="live-menu-bottom">
                <strong>AED {Number(item.price).toFixed(2)}</strong>
                <motion.button onClick={() => add(item)} disabled={item.available === false} whileTap={{ scale: .9 }}>
                  <AnimatePresence mode="wait" initial={false}>
                    {addedId === item.item_id ? <motion.span key="added" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>Added <Check size={16} /></motion.span> : <motion.span key="add" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>Add <ArrowUpRight size={16} /></motion.span>}
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>}
      {!loading && !filtered.length && <motion.div className="empty-state-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><h2>Nothing on that shelf.</h2><p>Try another search or switch categories.</p></motion.div>}
    </main>
  );
}

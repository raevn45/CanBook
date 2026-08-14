import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Search, ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
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

  return (
    <main className="app-page menu-page-new">
      <header className="shop-header">
        <div><span className="micro-label"><Sparkles size={13} /> CANBOOK / LIVE MENU</span><h1>Pick your <em>fuel.</em></h1><p>Chicken Manchurian, Puff, Chai Cake and the rest of the actual school menu. Prices are in AED.</p></div>
        <Link to="/cart" className="floating-cart"><ShoppingBag size={18} /><span>Cart</span><b>{count}</b></Link>
      </header>
      <div className="menu-toolbar"><div className="category-pills">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="search-box"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search lunch…" /></label></div>
      {loading ? <div className="loading-card">Loading today's menu…</div> : <motion.div layout className="live-menu-grid">{filtered.map((item, index) => <motion.article layout key={item.item_id} className="live-menu-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.045, 0.35), layout: { duration: 0.35 } }}><div className="menu-card-top"><span>{String(index + 1).padStart(2, "0")}</span><small>{item.category || "canteen"}</small></div><div className="food-mark">{String(item.item_name).slice(0, 1)}</div><h2>{item.item_name}</h2><p>{item.description || "Freshly prepared at the school canteen."}</p><div className="live-menu-bottom"><strong>AED {Number(item.price).toFixed(2)}</strong><button onClick={() => addToCart(item)} disabled={item.available === false}>Add <ArrowUpRight size={16} /></button></div></motion.article>)}</motion.div>}
      {!loading && !filtered.length && <div className="empty-state-card"><h2>Nothing on that shelf.</h2><p>Try another search or switch categories.</p></div>}
    </main>
  );
}

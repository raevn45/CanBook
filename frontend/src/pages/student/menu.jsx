import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, ShoppingBag, Sparkles } from "lucide-react";
import { menuapi } from "../../api";
import { useCart } from "../../context/cartcontext";

const emoji = { meal: "🍛", meals: "🍛", sandwich: "🥪", sandwiches: "🥪", snack: "🥐", snacks: "🥐", sweet: "🍰", drinks: "🥤" };

export default function Menu() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart, count } = useCart();

  useEffect(() => { menuapi.get().then((data) => setItems(data.items || [])).catch((err) => setError(err.message)).finally(() => setLoading(false)); }, []);

  const categories = useMemo(() => ["all", ...new Set(items.map((item) => String(item.category || "other").toLowerCase()))], [items]);
  const filtered = useMemo(() => items.filter((item) => { const matchesCategory = category === "all" || String(item.category).toLowerCase() === category; const text = `${item.item_name} ${item.description || ""}`.toLowerCase(); return matchesCategory && text.includes(query.toLowerCase()); }), [items, category, query]);

  return (
    <main className="student-page">
      <nav className="app-nav"><Link to="/student" className="app-brand"><span>CB</span><strong>CanBook</strong></Link><div><Link to="/orders">My orders</Link><Link to="/cart" className="nav-cart"><ShoppingBag size={17} /> Cart <b>{count}</b></Link></div></nav>
      <section className="menu-hero"><div><div className="eyebrow"><Sparkles size={14} /> LIVE CANTEEN MENU</div><h1>Pick your<br /><em>thing.</em></h1><p>Fresh menu, clear AED prices, no queue drama.</p></div><Link to="/cart" className="floating-cart"><ShoppingBag size={19} /><span><small>Your cart</small><strong>{count} item{count === 1 ? "" : "s"}</strong></span><ArrowRight size={17} /></Link></section>
      <section className="menu-controls"><div className="category-row">{categories.map((item) => <button key={item} className={category === item ? "category-chip active" : "category-chip"} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="menu-search"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search chicken sandwich, puff..." /></label></section>
      {loading ? <div className="loading-state"><div>✦</div><p>Loading today's food...</p></div> : error ? <div className="empty-state"><h2>Couldn't load the menu.</h2><p>{error}</p></div> : <section className="menu-grid-modern">{filtered.map((item, index) => <article className="modern-menu-card" key={item.item_id} style={{ "--card-index": index }}><div className="food-visual">{emoji[String(item.category || "").toLowerCase()] || "🍽️"}</div><div className="modern-menu-meta"><span>{String(item.category || "canteen").toUpperCase()}</span><b>AED {Number(item.price).toFixed(0)}</b></div><h2>{item.item_name}</h2><p>{item.description || "Freshly prepared at the school canteen."}</p><button onClick={() => addToCart(item)}>Add to cart <ArrowRight size={16} /></button></article>)}</section>}
    </main>
  );
}

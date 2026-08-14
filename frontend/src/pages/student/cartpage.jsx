import { ArrowUpRight, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useCart } from "../../context/cartcontext";

export default function CartPage() {
  const { cart, total, count, updateQuantity, removeFromCart } = useCart();

  if (!cart.length) return <main className="app-page empty-cart-page"><span className="micro-label">CANBOOK / CART</span><h1>Your cart is <em>quiet.</em></h1><p>Find something good before the bell rings.</p><Link to="/menu" className="giant-submit inline-submit">Browse the menu <ArrowUpRight size={20} /></Link></main>;

  return (
    <main className="app-page cart-page-new">
      <header className="simple-page-head"><div><span className="micro-label">CANBOOK / CART</span><h1>Your <em>order.</em></h1><p>{count} item{count === 1 ? "" : "s"} · AED {total.toFixed(2)}</p></div><Link to="/menu" className="ghost-link">← Keep browsing</Link></header>
      <section className="cart-layout-new">
        <div className="cart-list-new">{cart.map((item, index) => <motion.article layout key={item.item_id} className="cart-row-new"><div className="cart-index">0{index + 1}</div><div className="cart-copy"><h2>{item.item_name}</h2><span>AED {Number(item.price).toFixed(2)} each</span></div><div className="cart-quantity"><button onClick={() => updateQuantity(item.item_id, item.quantity - 1)}><Minus size={15} /></button><b>{item.quantity}</b><button onClick={() => updateQuantity(item.item_id, item.quantity + 1)}><Plus size={15} /></button></div><strong className="cart-subtotal">AED {(Number(item.price) * item.quantity).toFixed(2)}</strong><button className="trash-button" onClick={() => removeFromCart(item.item_id)} aria-label={`Remove ${item.item_name}`}><Trash2 size={17} /></button></motion.article>)}</div>
        <aside className="cart-summary-new"><span className="micro-label">READY WHEN YOU ARE</span><h2>One last<br /><em>choice.</em></h2><div className="summary-line"><span>Food</span><strong>AED {total.toFixed(2)}</strong></div><div className="summary-line"><span>Pickup fee</span><strong>AED 0.00</strong></div><div className="summary-total"><span>Total</span><strong>AED {total.toFixed(2)}</strong></div><Link to="/checkout" className="giant-submit inline-submit">Choose pickup <ArrowUpRight size={20} /></Link></aside>
      </section>
    </main>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock3, Package, RefreshCw } from "lucide-react";
import { orderapi } from "../../api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try { const data = await orderapi.getall(); setOrders(data.orders || []); } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  return <main className="orders-page"><div className="orders-page-inner"><header className="orders-header"><Link to="/student" className="back-link"><ArrowLeft size={17} /> Back</Link><div><span className="section-kicker">CANBOOK / STUDENT</span><h1>My orders.</h1><p>Everything you've ordered, straight from the canteen.</p></div><button className="back-link" onClick={load}><RefreshCw size={15} /> Refresh</button></header>{loading ? <div className="loading-state">Loading your orders...</div> : error ? <div className="empty-state"><h2>Couldn't load orders.</h2><p>{error}</p></div> : orders.length === 0 ? <section className="empty-state"><Package size={38} /><h2>No orders yet.</h2><p>Hungry? Let's fix that.</p><Link to="/menu" className="hero-primary">Start ordering</Link></section> : <section className="orders-list">{orders.map((order) => { const status = String(order.status || "Pending"); return <article className="order-card" key={order.order_id}><div className="order-card-top"><div><span className="order-label">ORDER</span><h2>#{order.order_id}</h2></div><div className="order-status"><Clock3 size={15} /> {status}</div></div><div className="order-card-bottom"><div><span>Total</span><strong>AED {Number(order.total_amount || 0).toFixed(2)}</strong></div><div><span>Pickup</span><strong>{order.pickup_slot}</strong></div><span className="order-time">{order.order_date || "Today"}</span></div></article>; })}</section>}</div></main>;
}

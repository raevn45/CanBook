import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowUpRight, CheckCircle2, ChevronRight, Clock3, PackageCheck, RefreshCw, Trash2, UtensilsCrossed, X } from "lucide-react";
import { Link } from "react-router-dom";
import { canteenapi, orderapi } from "../../api";

const STATUS_ACTIONS = {
  Pending: { label: "Start preparing", next: "Preparing", icon: Clock3 },
  Preparing: { label: "Mark ready", next: "Ready", icon: PackageCheck },
  Ready: { label: "Collected", next: "Collected", icon: CheckCircle2 },
};

const statusClass = (status) => String(status || "Pending").toLowerCase();

export default function Orders() {
  const [data, setData] = useState({ orders: [], completed_today: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      setData(await canteenapi.orders());
    } catch (err) {
      setError(err.message || "Unable to load today's orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    setError("");
    try {
      await canteenapi.updateorder(id, status);
      await loadOrders();
    } catch (err) {
      setError(err.message || "Unable to update this order.");
      setUpdating(null);
    }
  };

  const deleteExistingOrder = async (id) => {
    setDeleting(id);
    setError("");
    try {
      await orderapi.remove(id);
      setData((current) => ({
        ...current,
        orders: current.orders.filter((order) => order.order_id !== id),
      }));
      setConfirmDelete(null);
    } catch (err) {
      setError(err.message || "Unable to delete this order.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <main className="app-page canteen-orders-page">
      <header className="canteen-hero-head queue-head">
        <div>
          <span className="micro-label"><UtensilsCrossed size={13} /> CANBOOK / STAFF / LIVE QUEUE</span>
          <h1>Today's <em>orders.</em></h1>
          <p>Run the kitchen from one clean queue. Move each order from received to ready, then hand it to the student.</p>
        </div>
        <div className="queue-header-actions">
          <div className="queue-completed-pill"><CheckCircle2 size={15} /> {data.completed_today || 0} collected today</div>
          <motion.button type="button" className="dashboard-refresh" onClick={loadOrders} disabled={loading} whileHover={{ y: -3 }} whileTap={{ scale: .96 }}>
            <RefreshCw size={17} className={loading ? "spin" : ""} /> {loading ? "Syncing" : "Refresh queue"}
          </motion.button>
        </div>
      </header>

      {error && (
        <section className="staff-error">
          <strong>Queue couldn't load.</strong>
          <span>{error}</span>
          <button type="button" onClick={loadOrders}>Try again</button>
        </section>
      )}

      {!loading && !error && data.orders.length === 0 && (
        <motion.section className="staff-empty-hero" initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }}>
          <div><span>QUEUE / CLEAR</span><h2>Nothing waiting.<br /><em>For now.</em></h2><p>New student orders will appear here as they arrive.</p></div>
          <div className="empty-queue-mark"><CheckCircle2 size={44} /></div>
        </motion.section>
      )}

      {!error && data.orders.length > 0 && (
        <section className="queue-board">
          <div className="queue-board-head"><span>{data.orders.length} active order{data.orders.length === 1 ? "" : "s"}</span><span>LIVE CANTEEN BOARD</span></div>
          <motion.div layout className="queue-grid">
            <AnimatePresence mode="popLayout">
              {data.orders.map((order, index) => {
                const isConfirming = confirmDelete === order.order_id;
                const action = STATUS_ACTIONS[order.status] || null;
                const ActionIcon = action?.icon;
                return (
                  <motion.article layout key={order.order_id} className={`queue-card status-${statusClass(order.status)}`} initial={{ opacity: 0, y: 25, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: .88 }} transition={{ delay: Math.min(index * .05, .25), type: "spring", stiffness: 240, damping: 22 }} whileHover={{ y: -7 }}>
                    <div className="queue-card-top"><span className="queue-number">#{order.order_id}</span><span className={`queue-status ${statusClass(order.status)}`}><Clock3 size={13} /> {order.status}</span></div>
                    <div className="queue-card-title"><span>STUDENT</span><h2>{order.name}</h2></div>
                    <div className="queue-pickup"><small>PICKUP</small><strong>{order.pickup_slot || "Pickup time not set"}</strong></div>
                    <div className="queue-money"><span>TOTAL</span><strong>AED {Number(order.total_amount || 0).toFixed(2)}</strong></div>

                    {action && (
                      <button type="button" className={`queue-primary-action ${statusClass(action.next)}`} onClick={() => updateStatus(order.order_id, action.next)} disabled={updating === order.order_id}>
                        <ActionIcon size={17} />
                        <span>{updating === order.order_id ? "Updating…" : action.label}</span>
                        <ChevronRight size={17} />
                      </button>
                    )}

                    <div className="queue-actions">
                      <Link to={`/canteen/orders/${order.order_id}`} className="queue-open">Open order <ArrowUpRight size={16} /></Link>
                    </div>
                    <div className="queue-delete-row">
                      <AnimatePresence mode="wait" initial={false}>
                        {isConfirming ? (
                          <motion.div className="order-delete-confirm" initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .94 }}>
                            <span>Delete?</span>
                            <button type="button" onClick={() => deleteExistingOrder(order.order_id)} disabled={deleting === order.order_id}>{deleting === order.order_id ? "Deleting…" : "Delete order"}</button>
                            <button type="button" onClick={() => setConfirmDelete(null)} aria-label="Cancel delete"><X size={15} /></button>
                          </motion.div>
                        ) : (
                          <motion.button type="button" className="order-delete-button" onClick={() => setConfirmDelete(order.order_id)} whileHover={{ y: -2 }} whileTap={{ scale: .94 }} aria-label={`Delete order ${order.order_id}`}><Trash2 size={16} /></motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </section>
      )}
    </main>
  );
}

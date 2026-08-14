import { useEffect, useState } from "react";
import { Check, EyeOff, Plus, Trash2, UtensilsCrossed, X } from "lucide-react";
import { canteenapi } from "../../api";

const emptyForm = { item_name: "", description: "", category: "meals", price: "" };

export default function MenuManagement() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await canteenapi.menu();
      setItems(data.items || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggle = async (item) => {
    try {
      await canteenapi.toggleitem(item.item_id, !item.available);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await canteenapi.additem({ ...form, price: Number(form.price) });
      setForm(emptyForm);
      setShowAdd(false);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const active = items.filter((item) => item.available);
  const hidden = items.filter((item) => !item.available);

  return (
    <main className="app-page canteen-menu-page">
      <header className="canteen-section-head">
        <div>
          <span className="micro-label"><UtensilsCrossed size={13} /> CANTEEN / MENU CONTROL</span>
          <h1>What's <em>on?</em></h1>
          <p>The live menu students see. Add something new or remove an item from ordering without deleting its history.</p>
        </div>
        <button className="giant-submit menu-add-button" onClick={() => setShowAdd(true)}><Plus size={20} /> Add item</button>
      </header>

      {error && <div className="form-error menu-error">{error}</div>}

      <section className="menu-control-summary">
        <div><span>LIVE ITEMS</span><strong>{active.length}</strong></div>
        <div><span>REMOVED FROM MENU</span><strong>{hidden.length}</strong></div>
        <div><span>STUDENT PRICING</span><strong>AED</strong></div>
      </section>

      {loading ? <div className="loading-card">Loading menu…</div> : (
        <div className="canteen-menu-list">
          {items.map((item, index) => (
            <article className={`canteen-menu-row ${item.available ? "" : "is-hidden"}`} key={item.item_id}>
              <span className="menu-row-number">{String(index + 1).padStart(2, "0")}</span>
              <div className="menu-row-copy"><small>{item.category}</small><h2>{item.item_name}</h2><p>{item.description || "No description yet."}</p></div>
              <strong className="menu-row-price">AED {Number(item.price).toFixed(2)}</strong>
              <button className={`menu-remove ${item.available ? "" : "restore"}`} onClick={() => toggle(item)} title={item.available ? "Remove from student menu" : "Put back on student menu"}>
                {item.available ? <><Trash2 size={16} /> Remove</> : <><Check size={16} /> Restore</>}
              </button>
            </article>
          ))}
        </div>
      )}

      {showAdd && <div className="menu-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setShowAdd(false)}><form className="menu-modal" onSubmit={submit}>
        <button type="button" className="modal-close" onClick={() => setShowAdd(false)} aria-label="Close"><X size={19} /></button>
        <span className="micro-label">CANTEEN / NEW ITEM</span>
        <h2>Add to the menu.</h2>
        <p>Students will see this item immediately after you save it.</p>
        <label>Item name<input required value={form.item_name} onChange={(e) => setForm({ ...form, item_name: e.target.value })} placeholder="Chicken Sandwich" /></label>
        <label>Description<input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Freshly prepared…" /></label>
        <div className="menu-form-grid"><label>Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="meals">Meals</option><option value="snacks">Snacks</option><option value="sandwiches">Sandwiches</option><option value="desserts">Desserts</option><option value="drinks">Drinks</option></select></label><label>Price (AED)<input required min="0" step="0.01" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="7" /></label></div>
        <button className="giant-submit" disabled={saving}>{saving ? "Saving…" : "Add item"} <Plus size={19} /></button>
      </form></div>}
    </main>
  );
}

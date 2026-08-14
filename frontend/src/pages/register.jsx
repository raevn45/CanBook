import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import { useAuth } from "../context/authcontext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");

    setLoading(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      navigate("/login", { replace: true, state: { registered: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError("");
  };

  return (
    <main className="auth-shell register-shell">
      <div className="auth-orbit orbit-three" />
      <div className="auth-noise" />
      <Link to="/" className="floating-brand">CAN<span>BOOK</span></Link>

      <section className="register-layout-new">
        <div className="register-story">
          <p className="kicker"><Sparkles size={15} /> FIRST BITE / FIRST ORDER</p>
          <h1>Make lunch the <em>easy</em> part.</h1>
          <p>Create your student account and get a calmer canteen day: live menu, cart, pickup date and time, then a clean order trail.</p>
          <div className="feature-stack">
            {[
              "Live menu with AED pricing",
              "A real calendar for pickup dates",
              "20-minute pickup windows",
              "Order history and status updates",
            ].map((item) => <div key={item}><span><Check size={15} /></span>{item}</div>)}
          </div>
        </div>

        <div className="auth-panel register-panel">
          <div className="auth-panel-top"><div><span className="micro-label">CANBOOK / CREATE</span><h2>Let's get you in.</h2></div><div className="auth-index">02 / 02</div></div>
          <form onSubmit={submit} className="auth-form two-column-form">
            <label className="wide-field"><span>Full name</span><div className="field-shell"><input name="name" value={form.name} onChange={update} placeholder="Your name" autoComplete="name" required /></div></label>
            <label className="wide-field"><span>Email</span><div className="field-shell"><input name="email" type="email" value={form.email} onChange={update} placeholder="you@school.com" autoComplete="email" required /></div></label>
            <label><span>Password</span><div className="field-shell"><input name="password" type="password" value={form.password} onChange={update} placeholder="6+ characters" autoComplete="new-password" required /></div></label>
            <label><span>Confirm</span><div className="field-shell"><input name="confirmPassword" type="password" value={form.confirmPassword} onChange={update} placeholder="Repeat it" autoComplete="new-password" required /></div></label>
            {error && <div className="form-error wide-field">{error}</div>}
            <button className="giant-submit wide-field" type="submit" disabled={loading}><span>{loading ? "Creating…" : "Create my account"}</span><ArrowUpRight size={22} /></button>
          </form>
          <div className="auth-bottom"><span>Already have an account?</span><Link to="/login">Log in <ArrowUpRight size={15} /></Link></div>
        </div>
      </section>
    </main>
  );
}

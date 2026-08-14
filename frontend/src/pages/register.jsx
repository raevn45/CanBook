import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useAuth } from "../context/authcontext";

export default function Register() {
  const navigate = useNavigate();
  const { register, login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      const data = await login(form.email.trim(), form.password);
      navigate(data.user.role === "canteen" ? "/canteen" : "/student");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page register-page">
      <div className="auth-glow auth-glow-a" /><div className="auth-glow auth-glow-b" />
      <Link to="/" className="auth-brand">CAN<span>BOOK</span></Link>
      <section className="auth-layout">
        <div className="auth-intro">
          <div className="eyebrow"><Sparkles size={14} /> YOUR SCHOOL CANTEEN</div>
          <h1>Lunch starts<br /><em>here.</em></h1>
          <p>Create your account once. Then browse the live menu, choose a pickup slot, and skip the queue.</p>
          <div className="register-perks"><div><Check size={15} /> Live AED menu</div><div><Check size={15} /> Full date + time pickup</div><div><Check size={15} /> Order tracking</div></div>
        </div>
        <section className="auth-card">
          <div className="auth-card-heading"><span>CANBOOK / JOIN</span><h2>Make lunch easier.</h2><p>It only takes a minute.</p></div>
          <form onSubmit={handleSubmit} className="auth-form">
            <label>Full name<input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" autoComplete="name" required /></label>
            <label>Email<input name="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" autoComplete="email" required /></label>
            <div className="form-two"><label>Password<input name="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="6+ characters" autoComplete="new-password" required /></label><label>Confirm<input name="confirmPassword" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Again" autoComplete="new-password" required /></label></div>
            {error && <div className="form-error">{error}</div>}
            <button className="hero-primary auth-submit" disabled={loading}>{loading ? "Creating account..." : "Start ordering"}<ArrowRight size={18} /></button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
        </section>
      </section>
    </main>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, Sparkles } from "lucide-react";
import { useAuth } from "../context/authcontext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email.trim(), password);
      navigate(data.user.role === "canteen" ? "/canteen" : "/student");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-glow auth-glow-a" />
      <div className="auth-glow auth-glow-b" />
      <Link to="/" className="auth-brand">CAN<span>BOOK</span></Link>

      <section className="auth-layout">
        <div className="auth-intro">
          <div className="eyebrow"><Sparkles size={14} /> CANTEEN ACCESS</div>
          <h1>Welcome<br /><em>back.</em></h1>
          <p>Sign in and get straight to the food. Your next lunch is closer than you think.</p>
          <div className="auth-note">LIVE MENU <span /> REAL PICKUP SLOTS <span /> AED PRICING</div>
        </div>

        <section className="auth-card">
          <div className="auth-card-heading">
            <span>CANBOOK / LOGIN</span>
            <h2>Let's get you fed.</h2>
            <p>Use the account you created for CanBook.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Email
              <div className="input-wrap"><Mail size={18} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required /></div>
            </label>
            <label>
              Password
              <div className="input-wrap"><Lock size={18} /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" autoComplete="current-password" required /></div>
            </label>
            {error && <div className="form-error">{error}</div>}
            <button className="hero-primary auth-submit" disabled={loading}>{loading ? "Signing you in..." : "Enter CanBook"}<ArrowRight size={18} /></button>
          </form>

          <p className="auth-switch">New here? <Link to="/register">Create an account</Link></p>
        </section>
      </section>
    </main>
  );
}

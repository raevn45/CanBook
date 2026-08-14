import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { useAuth } from "../context/authcontext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate(user.role === "canteen" ? "/canteen" : "/student", { replace: true });
  }, [user, navigate]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email.trim(), password);
      navigate(data.user.role === "canteen" ? "/canteen" : "/student", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <div className="auth-orbit orbit-one" />
      <div className="auth-orbit orbit-two" />
      <div className="auth-noise" />

      <Link to="/" className="floating-brand">CAN<span>BOOK</span></Link>

      <section className="auth-layout">
        <div className="auth-story">
          <p className="kicker"><Sparkles size={15} /> SCHOOL CANTEEN / 2026</p>
          <h1>Back to the <em>good stuff.</em></h1>
          <p className="auth-lede">Your canteen, your cart, your pickup time. Everything stays in one place.</p>
          <div className="auth-marquee"><span>NO QUEUE</span><b>•</b><span>FRESH FOOD</span><b>•</b><span>SMART PICKUP</span></div>
        </div>

        <div className="auth-panel">
          <div className="auth-panel-top">
            <div>
              <span className="micro-label">CANBOOK / LOGIN</span>
              <h2>Welcome back.</h2>
            </div>
            <div className="auth-index">01 / 02</div>
          </div>

          {location.state?.registered && <div className="success-note">Account created. Log in to start ordering.</div>}

          <form onSubmit={submit} className="auth-form">
            <label>
              <span>Email</span>
              <div className="field-shell"><Mail size={18} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.com" autoComplete="email" required /></div>
            </label>
            <label>
              <span>Password</span>
              <div className="field-shell"><LockKeyhole size={18} /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" autoComplete="current-password" required /></div>
            </label>

            {error && <div className="form-error">{error}</div>}

            <button className="giant-submit" type="submit" disabled={loading}>
              <span>{loading ? "Signing in…" : "Enter CanBook"}</span>
              <ArrowUpRight size={22} />
            </button>
          </form>

          <div className="auth-bottom"><span>New here?</span><Link to="/register">Create an account <ArrowUpRight size={15} /></Link></div>
        </div>
      </section>
    </main>
  );
}

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, LockKeyhole, Mail, Sparkles, UsersRound, UtensilsCrossed } from "lucide-react";
import { useAuth } from "../context/authcontext";

const ROLES = {
  student: {
    label: "Student",
    icon: UsersRound,
    title: "Order your lunch.",
    description: "Browse the canteen, build your cart, and choose your pickup slot.",
  },
  staff: {
    label: "Staff",
    icon: UtensilsCrossed,
    title: "Run the canteen.",
    description: "See incoming orders and keep the canteen moving.",
  },
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, logout } = useAuth();
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate(user.role === "canteen" ? "/canteen" : "/student", { replace: true });
  }, [user, navigate]);

  const selectRole = (nextRole) => {
    setRole(nextRole);
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email.trim(), password);
      const expectedRole = role === "staff" ? "canteen" : "student";

      if (data.user.role !== expectedRole) {
        await logout();
        setError(role === "staff"
          ? "That account is a student account. Switch to Student or use a staff account."
          : "That account is a staff account. Switch to Staff to continue.");
        return;
      }

      navigate(expectedRole === "canteen" ? "/canteen" : "/student", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selected = ROLES[role];
  const RoleIcon = selected.icon;

  return (
    <main className="auth-shell login-shell">
      <div className="auth-orbit orbit-one" />
      <div className="auth-orbit orbit-two" />
      <div className="auth-noise" />

      <Link to="/" className="floating-brand">CAN<span>BOOK</span></Link>

      <section className="auth-layout">
        <div className="auth-story">
          <p className="kicker"><Sparkles size={15} /> SCHOOL CANTEEN / 2026</p>
          <h1>{selected.title.split(" ")[0]} <em>{selected.title.split(" ").slice(1).join(" ")}</em></h1>
          <p className="auth-lede">{selected.description}</p>
          <div className="auth-marquee"><span>NO QUEUE</span><b>•</b><span>FRESH FOOD</span><b>•</b><span>SMART PICKUP</span></div>
        </div>

        <div className="auth-panel">
          <div className="auth-panel-top">
            <div>
              <span className="micro-label">CANBOOK / LOGIN</span>
              <h2>Welcome back.</h2>
            </div>
            <div className="auth-index">LOGIN</div>
          </div>

          <div className="role-switch" role="tablist" aria-label="Login type">
            {Object.entries(ROLES).map(([key, option]) => {
              const Icon = option.icon;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={role === key}
                  className={role === key ? "active" : ""}
                  onClick={() => selectRole(key)}
                >
                  <Icon size={17} />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>

          <div className="role-context"><RoleIcon size={18} /><span>{selected.description}</span></div>

          {location.state?.registered && <div className="success-note">Account created. Log in to start ordering.</div>}

          <form onSubmit={submit} className="auth-form">
            <label>
              <span>Email</span>
              <div className="field-shell"><Mail size={18} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={role === "staff" ? "staff@school.com" : "you@school.com"} autoComplete="email" required /></div>
            </label>
            <label>
              <span>Password</span>
              <div className="field-shell"><LockKeyhole size={18} /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" autoComplete="current-password" required /></div>
            </label>

            {error && <div className="form-error">{error}</div>}

            <button className="giant-submit" type="submit" disabled={loading}>
              <span>{loading ? "Signing in…" : `Continue as ${selected.label}`}</span>
              <ArrowUpRight size={22} />
            </button>
          </form>

          <div className="auth-bottom">
            <span>Student account?</span>
            <Link to="/register">Create one <ArrowUpRight size={15} /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}

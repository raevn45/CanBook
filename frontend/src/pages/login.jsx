import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, LockKeyhole, Mail, Sparkles, UsersRound, UtensilsCrossed } from "lucide-react";
import { useAuth } from "../context/authcontext";

const ROLES = {
  student: { label: "Student", icon: UsersRound, title: "Order your lunch.", description: "Browse the canteen, build your cart, and choose your pickup slot." },
  staff: { label: "Staff", icon: UtensilsCrossed, title: "Run the canteen.", description: "See incoming orders, manage the menu, and watch demand." },
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

  useEffect(() => { if (user) navigate(user.role === "canteen" ? "/canteen" : "/student", { replace: true }); }, [user, navigate]);

  const selectRole = (nextRole) => { setRole(nextRole); setError(""); };

  const submit = async (event) => {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const data = await login(email.trim(), password);
      const expectedRole = role === "staff" ? "canteen" : "student";
      if (data.user.role !== expectedRole) {
        await logout();
        setError(role === "staff" ? "That account is a student account. Switch to Student or use a staff account." : "That account is a staff account. Switch to Staff to continue.");
        return;
      }
      navigate(expectedRole === "canteen" ? "/canteen" : "/student", { replace: true });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const selected = ROLES[role];
  const RoleIcon = selected.icon;

  return (
    <main className="auth-shell login-shell">
      <div className="auth-orbit orbit-one" /><div className="auth-orbit orbit-two" /><div className="auth-noise" />
      <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}><Link to="/" className="floating-brand">CAN<span>BOOK</span></Link></motion.div>
      <section className="auth-layout">
        <motion.div className="auth-story" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
          <p className="kicker"><Sparkles size={15} /> SCHOOL CANTEEN / 2026</p>
          <AnimatePresence mode="wait"><motion.h1 key={role} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: .25 }}>{selected.title.split(" ")[0]} <em>{selected.title.split(" ").slice(1).join(" ")}</em></motion.h1></AnimatePresence>
          <p className="auth-lede">{selected.description}</p>
          <div className="auth-marquee"><span>NO QUEUE</span><b>•</b><span>FRESH FOOD</span><b>•</b><span>LIVE STATUS</span></div>
        </motion.div>

        <motion.div className="auth-panel" initial={{ opacity: 0, y: 30, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 22 }}>
          <div className="auth-panel-top"><div><span className="micro-label">CANBOOK / LOGIN</span><h2>Welcome back.</h2></div><div className="auth-index">LOGIN</div></div>
          <div className="role-switch" role="tablist" aria-label="Login type">
            {Object.entries(ROLES).map(([key, option]) => { const Icon = option.icon; const active = role === key; return <motion.button key={key} type="button" role="tab" aria-selected={active} className={active ? "active" : ""} onClick={() => selectRole(key)} whileTap={{ scale: .96 }}><Icon size={17} /><span>{option.label}</span></motion.button>; })}
          </div>
          <div className="role-context"><RoleIcon size={18} /><span>{selected.description}</span></div>
          {location.state?.registered && <div className="success-note">Account created. Log in to start ordering.</div>}
          <form onSubmit={submit} className="auth-form">
            <label><span>Email</span><div className="field-shell"><Mail size={18} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={role === "staff" ? "canteen@canbook.com" : "you@school.com"} autoComplete="email" required /></div></label>
            <label><span>Password</span><div className="field-shell"><LockKeyhole size={18} /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" autoComplete="current-password" required /></div></label>
            {error && <motion.div className="form-error" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>{error}</motion.div>}
            <motion.button className="giant-submit" type="submit" disabled={loading} whileHover={{ y: -3 }} whileTap={{ scale: .98 }}><span>{loading ? "Signing in…" : `Continue as ${selected.label}`}</span><ArrowUpRight size={22} /></motion.button>
          </form>
          <div className="auth-bottom"><span>Need a student account?</span><Link to="/register">Create one <ArrowUpRight size={15} /></Link></div>
        </motion.div>
      </section>
    </main>
  );
}

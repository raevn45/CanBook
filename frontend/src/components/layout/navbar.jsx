import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { BarChart3, ClipboardList, Home, LogOut, Menu as MenuIcon, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { useAuth } from "../../context/authcontext";
import { useCart } from "../../context/cartcontext";
import InstallApp from "../pwa/installapp";

const studentLinks = [
  { to: "/student", label: "Dashboard", icon: Home },
  { to: "/menu", label: "Menu", icon: MenuIcon },
  { to: "/orders", label: "Orders", icon: ClipboardList },
  { to: "/cart", label: "Cart", icon: ShoppingBag },
];

const staffLinks = [
  { to: "/canteen", label: "Dashboard", icon: Home },
  { to: "/canteen/orders", label: "Orders", icon: ClipboardList },
  { to: "/canteen/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/canteen/menu", label: "Menu", icon: UtensilsCrossed },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const links = user?.role === "canteen" ? staffLinks : studentLinks;

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <style>{`.install-app-button{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:10px 12px;background:var(--acid);color:var(--ink);border:1px solid var(--ink);box-shadow:3px 3px 0 var(--coral);font:10px var(--mono);letter-spacing:.07em;text-transform:uppercase;cursor:pointer;transition:.16s ease}.install-app-button:hover{transform:translate(2px,2px);box-shadow:1px 1px 0 var(--coral)}.mobile-app-nav .install-app-button{min-width:0;padding:7px 8px;box-shadow:none;background:var(--acid);font-size:7px}.install-help-backdrop{position:fixed;inset:0;z-index:9000;display:grid;place-items:center;padding:20px;background:rgba(23,23,22,.58);backdrop-filter:blur(10px)}.install-help-card{position:relative;width:min(500px,100%);padding:34px;background:var(--cream);border:2px solid var(--ink);box-shadow:10px 10px 0 var(--coral)}.install-help-close{position:absolute;right:14px;top:14px;width:38px;height:38px;display:grid;place-items:center;border:1px solid var(--ink);border-radius:50%;background:white;cursor:pointer}.install-help-icon{width:56px;height:56px;display:grid;place-items:center;margin-bottom:22px;background:var(--acid);border:1px solid var(--ink);box-shadow:4px 4px 0 var(--ink)}.install-help-card h2{margin:8px 0 14px;font:700 clamp(38px,7vw,58px)/.9 var(--display);letter-spacing:-.06em}.install-help-copy{max-width:430px;margin:0;color:var(--muted);font-size:14px;line-height:1.6}.install-help-done{margin-top:24px}@media(max-width:760px){.install-app-button span{display:none}.mobile-app-nav .install-app-button span{display:block}.install-help-card{padding:28px 22px}.install-help-card h2{font-size:42px}}`}</style>
      <motion.header
        className="navbar interactive-navbar"
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <Link to="/" className="brand brand-home-button" aria-label="CanBook home" title="CanBook home">
          <motion.span className="brand-mark" whileHover={{ rotate: 6, scale: 1.08 }} whileTap={{ scale: 0.92 }}>
            <span>C</span><b>B</b>
          </motion.span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className={location.pathname === to ? "active" : ""}>
              <Icon size={14} />
              <span>{label.toLowerCase()}</span>
              {label === "Cart" && count > 0 && <span className="cart-count">{count}</span>}
            </Link>
          ))}
          <InstallApp />
          <motion.button className="nav-logout" onClick={handleLogout} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} title="Sign out">
            <LogOut size={15} />
            <span>logout</span>
          </motion.button>
        </nav>
      </motion.header>

      <motion.nav className="mobile-app-nav" initial={{ y: 80 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 25 }} aria-label="Mobile navigation">
        {links.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to || (to !== "/student" && location.pathname.startsWith(`${to}/`));
          return (
            <Link key={to} to={to} className={active ? "active" : ""} aria-label={label}>
              {active && <motion.span className="mobile-nav-active" layoutId="mobile-nav-active" />}
              <Icon size={19} />
              <span>{label}</span>
              {label === "Cart" && count > 0 && <b>{count}</b>}
            </Link>
          );
        })}
        <InstallApp />
        <button type="button" onClick={handleLogout} aria-label="Sign out"><LogOut size={19} /><span>Sign out</span></button>
      </motion.nav>
    </>
  );
}

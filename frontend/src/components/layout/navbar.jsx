import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { BarChart3, ClipboardList, Home, LogOut, Menu as MenuIcon, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { useAuth } from "../../context/authcontext";
import { useCart } from "../../context/cartcontext";

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
        <button type="button" onClick={handleLogout} aria-label="Sign out"><LogOut size={19} /><span>Sign out</span></button>
      </motion.nav>
    </>
  );
}

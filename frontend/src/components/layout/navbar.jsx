import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight, Home, LogOut, ShoppingBag } from "lucide-react";
import { useAuth } from "../../context/authcontext";
import { useCart } from "../../context/cartcontext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <motion.header
      className="navbar interactive-navbar"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Link to="/" className="brand brand-home-button" aria-label="CanBook home" title="Back to CanBook home">
        <span className="brand-mark"><span>C</span><b>B</b></span>
        <span className="brand-home-label"><Home size={13} /> home</span>
      </Link>

      <nav className="desktop-nav">
        {user?.role === "student" && (
          <>
            <Link to="/student">dashboard</Link>
            <Link to="/menu">menu</Link>
            <Link to="/orders">orders</Link>
            <Link to="/cart" className="nav-cart-link"><ShoppingBag size={14} /> cart {count > 0 && <span className="cart-count">{count}</span>}</Link>
            <button className="nav-logout" onClick={handleLogout}><LogOut size={14} /> logout</button>
          </>
        )}

        {user?.role === "canteen" && (
          <>
            <Link to="/canteen">dashboard</Link>
            <Link to="/canteen/orders">orders</Link>
            <Link to="/canteen/analytics">analytics</Link>
            <Link to="/canteen/menu">menu</Link>
            <button className="nav-logout" onClick={handleLogout}><LogOut size={14} /> logout</button>
          </>
        )}
      </nav>
    </motion.header>
  );
}

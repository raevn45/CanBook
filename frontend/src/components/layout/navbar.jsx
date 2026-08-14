import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
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
      className="navbar"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Link to="/" className="brand">
        <span className="brand-mark">cb</span>
        <span>canbook</span>
      </Link>

      <nav className="desktop-nav">
        {!user && (
          <>
            <Link to="/">home</Link>
            <Link to="/login">login</Link>
          </>
        )}

        {user?.role === "student" && (
          <>
            <Link to="/student">dashboard</Link>
            <Link to="/menu">menu</Link>
            <Link to="/orders">orders</Link>
            <Link to="/cart">
              cart {count > 0 && <span className="cart-count">{count}</span>}
            </Link>
            <button className="nav-logout" onClick={handleLogout}>logout</button>
          </>
        )}

        {user?.role === "canteen" && (
          <>
            <Link to="/canteen">dashboard</Link>
            <Link to="/canteen/orders">orders</Link>
            <Link to="/canteen/analytics">analytics</Link>
            <Link to="/canteen/menu">menu</Link>
            <button className="nav-logout" onClick={handleLogout}>logout</button>
          </>
        )}
      </nav>
    </motion.header>
  );
}
import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import {
  ArrowRight,
  Clock,
  Zap,
  ShoppingBag,
  Plus,
  Minus,
  X,
  Menu,
} from "lucide-react";

const menuItems = [
  { id: 1, name: "Chicken Manchurian + Fried Rice", price: 12 },
  { id: 2, name: "Veg Manchurian + Fried Rice", price: 10 },
  { id: 3, name: "Puff", price: 5 },
  { id: 4, name: "Chai Cake", price: 3 },
  { id: 5, name: "Chole Puri", price: 10 },
  { id: 6, name: "Boiled Egg", price: 2 },
  { id: 7, name: "Veg Sandwich", price: 7 },
  { id: 8, name: "Chicken Sandwich", price: 7 },
  { id: 9, name: "Aalo Paratha", price: 10 },
];

function Landing() {
  return (
    <main className="landing-page">
      <nav className="navbar">
        <Link to="/" className="logo">
          CAN<span>BOOK</span>
        </Link>

        <div className="nav-links">
          <a href="#menu">Menu</a>
          <a href="#how">How it works</a>
          <Link to="/login">Staff Login</Link>
        </div>

        <Link to="/register" className="nav-order">
          Order now <ArrowRight size={17} />
        </Link>
      </nav>

      <section className="hero">
        <div className="hero-left">
          <p className="eyebrow">GIIS CANTEEN / 2026</p>

          <h1 className="hero-title">
            Lunch,
            <br />
            <span>without</span>
            <br />
            the queue.
          </h1>

          <p className="hero-subtitle">
            Browse today's canteen menu, place your order, and pick it up
            without standing around waiting.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">
              Start ordering <ArrowRight size={18} />
            </Link>

            <a href="#menu" className="btn-secondary">
              See today's menu
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <Clock size={21} />
              <div>
                <strong>Quick</strong>
                <span>Pickup focused</span>
              </div>
            </div>

            <div className="stat-card">
              <Zap size={21} />
              <div>
                <strong>Live</strong>
                <span>Order updates</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="menu-preview">
            <div className="preview-top">
              <span>TODAY'S MENU</span>
              <span>9 ITEMS</span>
            </div>

            {menuItems.slice(0, 4).map((item) => (
              <div className="preview-item" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <small>Available today</small>
                </div>
                <b>AED {item.price}</b>
              </div>
            ))}

            <Link to="/register" className="preview-button">
              View full menu <ArrowRight size={16} />
            </Link>
          </div>

          <div className="floating-note note-one">NO QUEUE</div>
          <div className="floating-note note-two">AED</div>
        </div>
      </section>

      <section className="menu-section" id="menu">
        <div className="section-heading">
          <div>
            <p className="eyebrow">WHAT'S COOKING</p>
            <h2>Today's menu.</h2>
          </div>

          <Link to="/register">
            Order from the menu <ArrowRight size={17} />
          </Link>
        </div>

        <div className="menu-grid">
          {menuItems.map((item, index) => (
            <div className="menu-card" key={item.id}>
              <span className="menu-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="menu-card-content">
                <h3>{item.name}</h3>
                <p>Freshly prepared at the GIIS canteen</p>
              </div>

              <div className="menu-price">AED {item.price}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="how-section" id="how">
        <p className="eyebrow">HOW IT WORKS</p>
        <h2>Three steps. That's it.</h2>

        <div className="steps">
          <div>
            <span>01</span>
            <h3>Pick your food</h3>
            <p>Choose exactly what you want from today's menu.</p>
          </div>

          <div>
            <span>02</span>
            <h3>Place your order</h3>
            <p>Confirm your order before heading to the canteen.</p>
          </div>

          <div>
            <span>03</span>
            <h3>Pick it up</h3>
            <p>Get your food when it's ready instead of waiting in line.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submit = (event) => {
    event.preventDefault();

    localStorage.setItem(
      "canbook_user",
      JSON.stringify({
        name: form.name,
        email: form.email,
      })
    );

    navigate("/order");
  };

  return (
    <main className="auth-page">
      <Link to="/" className="auth-logo">
        CAN<span>BOOK</span>
      </Link>

      <div className="auth-card">
        <p className="eyebrow">WELCOME TO CANBOOK</p>
        <h1>Create your account.</h1>
        <p>Register once and start ordering from the canteen.</p>

        <form onSubmit={submit}>
          <label>
            Name
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="Your name"
            />
          </label>

          <label>
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              placeholder="Create a password"
            />
          </label>

          <button type="submit" className="btn-primary auth-submit">
            Continue to menu <ArrowRight size={18} />
          </button>
        </form>

        <p className="auth-switch">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (event) => {
    event.preventDefault();

    if (
      email === "canteen@canbook.com" &&
      password === "giiscanteen"
    ) {
      localStorage.setItem("canbook_staff", "true");
      navigate("/staff");
      return;
    }

    alert("Invalid staff login.");
  };

  return (
    <main className="auth-page">
      <Link to="/" className="auth-logo">
        CAN<span>BOOK</span>
      </Link>

      <div className="auth-card">
        <p className="eyebrow">CANTEEN STAFF</p>
        <h1>Staff login.</h1>
        <p>Manage incoming orders and keep the canteen moving.</p>

        <form onSubmit={submit}>
          <label>
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="canteen@canbook.com"
            />
          </label>

          <label>
            Password
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </label>

          <button type="submit" className="btn-primary auth-submit">
            Enter staff dashboard <ArrowRight size={18} />
          </button>
        </form>

        <p className="auth-switch">
          <Link to="/">Back to CanBook</Link>
        </p>
      </div>
    </main>
  );
}

function Order() {
  const [cart, setCart] = useState({});

  const add = (id) => {
    setCart((current) => ({
      ...current,
      [id]: (current[id] || 0) + 1,
    }));
  };

  const remove = (id) => {
    setCart((current) => {
      const next = { ...current };

      if (!next[id]) return current;

      if (next[id] === 1) {
        delete next[id];
      } else {
        next[id] -= 1;
      }

      return next;
    });
  };

  const total = menuItems.reduce(
    (sum, item) => sum + item.price * (cart[item.id] || 0),
    0
  );

  const count = Object.values(cart).reduce((sum, value) => sum + value, 0);

  return (
    <main className="order-page">
      <nav className="navbar">
        <Link to="/" className="logo">
          CAN<span>BOOK</span>
        </Link>

        <Link to="/" className="btn-secondary">
          Exit
        </Link>
      </nav>

      <section className="order-header">
        <p className="eyebrow">GIIS CANTEEN / ORDER</p>
        <h1>What are you having?</h1>
        <p>Select your food and build your order.</p>
      </section>

      <section className="order-layout">
        <div className="order-menu">
          {menuItems.map((item) => (
            <div className="order-item" key={item.id}>
              <div>
                <span className="menu-number">
                  {String(item.id).padStart(2, "0")}
                </span>
                <h3>{item.name}</h3>
                <strong>AED {item.price}</strong>
              </div>

              <div className="quantity">
                <button onClick={() => remove(item.id)} type="button">
                  <Minus size={16} />
                </button>

                <span>{cart[item.id] || 0}</span>

                <button onClick={() => add(item.id)} type="button">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="cart">
          <div className="cart-heading">
            <h2>Your order</h2>
            <ShoppingBag size={21} />
          </div>

          {count === 0 ? (
            <p className="empty-cart">Your order is empty.</p>
          ) : (
            <>
              {menuItems
                .filter((item) => cart[item.id])
                .map((item) => (
                  <div className="cart-row" key={item.id}>
                    <span>
                      {item.name} × {cart[item.id]}
                    </span>
                    <b>AED {item.price * cart[item.id]}</b>
                  </div>
                ))}

              <div className="cart-total">
                <span>Total</span>
                <strong>AED {total}</strong>
              </div>

              <button
                className="btn-primary checkout"
                type="button"
                onClick={() => alert("Order placed successfully!")}
              >
                Place order <ArrowRight size={18} />
              </button>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}

function Staff() {
  const orders = JSON.parse(localStorage.getItem("canbook_orders") || "[]");

  return (
    <main className="staff-page">
      <nav className="navbar">
        <Link to="/" className="logo">
          CAN<span>BOOK</span>
        </Link>

        <Link to="/" className="btn-secondary">
          Log out
        </Link>
      </nav>

      <section className="staff-header">
        <div>
          <p className="eyebrow">CANTEEN CONTROL</p>
          <h1>Orders dashboard.</h1>
          <p>Keep track of incoming CanBook orders.</p>
        </div>

        <div className="staff-status">
          <span />
          Kitchen online
        </div>
      </section>

      <section className="staff-grid">
        <div className="dashboard-card">
          <span>Total orders</span>
          <strong>{orders.length}</strong>
        </div>

        <div className="dashboard-card">
          <span>Today's menu</span>
          <strong>{menuItems.length}</strong>
        </div>

        <div className="dashboard-card">
          <span>Status</span>
          <strong>LIVE</strong>
        </div>
      </section>

      <section className="orders-panel">
        <div className="panel-heading">
          <h2>Incoming orders</h2>
          <span>{orders.length} orders</span>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <h3>No orders yet.</h3>
            <p>New student orders will appear here.</p>
          </div>
        ) : (
          orders.map((order, index) => (
            <div className="staff-order" key={index}>
              <strong>Order #{index + 1}</strong>
              <span>{order.name || "Student"}</span>
              <span>AED {order.total}</span>
            </div>
          ))
        )}
      </section>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/order" element={<Order />} />
        <Route path="/staff" element={<Staff />} />
      </Routes>
    </BrowserRouter>
  );
}
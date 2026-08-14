import { useEffect, useMemo, useState } from "react";
import "../styles/global.css";
import "../styles/animation.css";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:5000";

const fallbackMenu = [
  {
    id: 1,
    name: "Masala Dosa",
    description: "Crispy dosa served with sambar and chutney.",
    category: "Breakfast",
    price: 45,
    available: true,
    emoji: "🥞",
  },
  {
    id: 2,
    name: "Veg Sandwich",
    description: "Fresh vegetables, cheese and house sauce.",
    category: "Snacks",
    price: 40,
    available: true,
    emoji: "🥪",
  },
  {
    id: 3,
    name: "Paneer Roll",
    description: "Spiced paneer wrapped in a soft roti.",
    category: "Snacks",
    price: 55,
    available: true,
    emoji: "🌯",
  },
  {
    id: 4,
    name: "Fried Rice",
    description: "Indo-Chinese style vegetable fried rice.",
    category: "Lunch",
    price: 60,
    available: true,
    emoji: "🍚",
  },
  {
    id: 5,
    name: "Cold Coffee",
    description: "Chilled creamy coffee.",
    category: "Drinks",
    price: 50,
    available: true,
    emoji: "🥤",
  },
  {
    id: 6,
    name: "Fresh Lime Soda",
    description: "Refreshing sweet and salty lime soda.",
    category: "Drinks",
    price: 35,
    available: true,
    emoji: "🍋",
  },
];

function StudentDashboard({ user, onLogout }) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState("");
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    loadMenu();
    loadOrders();
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 2800);

    return () => clearTimeout(timer);
  }, [toast]);

  async function loadMenu() {
    try {
      const response = await fetch(`${API_BASE}/api/menu`);

      if (!response.ok) {
        throw new Error("Menu request failed");
      }

      const data = await response.json();

      const receivedMenu = Array.isArray(data)
        ? data
        : data.menu || data.items || [];

      setMenu(
        receivedMenu.length > 0
          ? receivedMenu.map((item, index) => ({
              id: item.id ?? index + 1,
              name: item.name ?? item.item_name ?? "Menu Item",
              description:
                item.description ??
                "Freshly prepared at the school canteen.",
              category: item.category ?? "Other",
              price: Number(item.price ?? 0),
              available:
                item.available !== false &&
                item.is_available !== false,
              emoji: item.emoji ?? "🍽️",
            }))
          : fallbackMenu
      );
    } catch (error) {
      setMenu(fallbackMenu);
    } finally {
      setLoading(false);
    }
  }

  async function loadOrders() {
    const studentId =
      user?.id ||
      user?.student_id ||
      user?.username ||
      user?.email;

    if (!studentId) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/orders?student_id=${encodeURIComponent(
          studentId
        )}`
      );

      if (!response.ok) return;

      const data = await response.json();

      const receivedOrders = Array.isArray(data)
        ? data
        : data.orders || [];

      setOrders(receivedOrders);
    } catch {
      setOrders([]);
    }
  }

  const categories = useMemo(() => {
    const unique = [
      "All",
      ...menu
        .map((item) => item.category)
        .filter(Boolean),
    ];

    return [...new Set(unique)];
  }, [menu]);

  const filteredMenu = useMemo(() => {
    const query = search.trim().toLowerCase();

    return menu.filter((item) => {
      const matchesCategory =
        activeCategory === "All" ||
        item.category === activeCategory;

      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [menu, activeCategory, search]);

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, quantity]) => {
        const item = menu.find(
          (menuItem) => String(menuItem.id) === String(id)
        );

        if (!item) return null;

        return {
          ...item,
          quantity,
          subtotal: item.price * quantity,
        };
      })
      .filter(Boolean);
  }, [cart, menu]);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.subtotal,
    0
  );

  function addToCart(item) {
    if (!item.available) {
      setToast(`${item.name} is currently unavailable.`);
      return;
    }

    setCart((current) => ({
      ...current,
      [item.id]: (current[item.id] || 0) + 1,
    }));

    setToast(`${item.name} added to your order ✨`);
  }

  function removeFromCart(item) {
    setCart((current) => {
      const next = { ...current };

      if (!next[item.id]) {
        return next;
      }

      if (next[item.id] <= 1) {
        delete next[item.id];
      } else {
        next[item.id] -= 1;
      }

      return next;
    });
  }

  async function placeOrder() {
    if (cartItems.length === 0) {
      setToast("Your cart is empty.");
      return;
    }

    const studentId =
      user?.id ||
      user?.student_id ||
      user?.username ||
      user?.email;

    const payload = {
      student_id: studentId,
      student_name:
        user?.name ||
        user?.student_name ||
        user?.username ||
        "Student",
      items: cartItems.map((item) => ({
        menu_item_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: cartTotal,
    };

    try {
      const response = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Order request failed");
      }

      setCart({});
      setShowCart(false);
      await loadOrders();

      setToast("Order placed successfully! 🎉");
    } catch {
      /*
       * This keeps the frontend pleasant during development
       * even if the backend endpoint has not been connected yet.
       */
      const localOrder = {
        id: `CB-${Date.now()}`,
        created_at: new Date().toISOString(),
        status: "Pending",
        total: cartTotal,
        items: cartItems,
      };

      setOrders((current) => [
        localOrder,
        ...current,
      ]);

      setCart({});
      setShowCart(false);

      setToast(
        "Order saved locally for now. Connect the backend to make it live."
      );
    }
  }

  function formatDate(value) {
    if (!value) return "Just now";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString([], {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function getOrderItems(order) {
    if (Array.isArray(order.items)) {
      return order.items;
    }

    if (typeof order.items === "string") {
      try {
        return JSON.parse(order.items);
      } catch {
        return [];
      }
    }

    return [];
  }

  return (
    <div className="student-dashboard page-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">CB</div>

          <div>
            <div className="brand-name">CanBook</div>
            <div className="brand-tagline">
              school canteen, but smarter.
            </div>
          </div>
        </div>

        <div className="topbar-actions">
          <button
            className="icon-button"
            onClick={() => setShowOrders(true)}
            aria-label="View orders"
          >
            <span>◷</span>
            <span className="button-label">
              My orders
            </span>
          </button>

          <button
            className="cart-button"
            onClick={() => setShowCart(true)}
          >
            <span>🛒</span>
            <span>
              Cart
              {cartCount > 0 && (
                <strong className="cart-count">
                  {cartCount}
                </strong>
              )}
            </span>
          </button>

          <button
            className="logout-button"
            onClick={onLogout}
          >
            Log out
          </button>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">WELCOME BACK ✦</p>

            <h1>
              What are you
              <span> craving?</span>
            </h1>

            <p className="hero-description">
              Skip the queue. Pick your food. Grab it when
              it's ready.
            </p>

            <div className="hero-mini-row">
              <div className="mini-pill">
                <span>⚡</span>
                Faster pickup
              </div>

              <div className="mini-pill">
                <span>♡</span>
                No queue stress
              </div>

              <div className="mini-pill">
                <span>✦</span>
                Made for school
              </div>
            </div>
          </div>

          <div className="hero-orbit" aria-hidden="true">
            <div className="orbit-circle orbit-one" />
            <div className="orbit-circle orbit-two" />
            <div className="orbit-food food-one">🍕</div>
            <div className="orbit-food food-two">🍜</div>
            <div className="orbit-food food-three">🥤</div>

            <div className="hero-card">
              <span>today's mood</span>
              <strong>hungry.</strong>
              <div>very hungry.</div>
            </div>
          </div>
        </section>

        <section className="menu-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE MENU</p>
              <h2>Pick your thing.</h2>
            </div>

            <div className="search-wrapper">
              <span>⌕</span>

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search the menu..."
              />
            </div>
          </div>

          <div className="category-row">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-chip ${
                  activeCategory === category
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveCategory(category)
                }
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-orbit">✦</div>
              <p>Getting today's food...</p>
            </div>
          ) : filteredMenu.length === 0 ? (
            <div className="empty-state">
              <div>🍽️</div>
              <h3>Nothing here yet.</h3>
              <p>
                Try another search or category.
              </p>
            </div>
          ) : (
            <div className="menu-grid">
              {filteredMenu.map((item, index) => {
                const quantity = cart[item.id] || 0;

                return (
                  <article
                    key={item.id}
                    className={`menu-card ${
                      !item.available
                        ? "unavailable"
                        : ""
                    }`}
                    style={{
                      "--card-index": index,
                    }}
                    onMouseEnter={() =>
                      setHoveredItem(item.id)
                    }
                    onMouseLeave={() =>
                      setHoveredItem(null)
                    }
                  >
                    <div className="menu-card-top">
                      <div
                        className={`food-visual ${
                          hoveredItem === item.id
                            ? "floating"
                            : ""
                        }`}
                      >
                        {item.emoji}
                      </div>

                      <span className="category-label">
                        {item.category}
                      </span>
                    </div>

                    <div className="menu-card-body">
                      <h3>{item.name}</h3>

                      <p>{item.description}</p>

                      <div className="menu-card-bottom">
                        <div className="price">
                          ₹{item.price}
                        </div>

                        {item.available ? (
                          quantity === 0 ? (
                            <button
                              className="add-button"
                              onClick={() =>
                                addToCart(item)
                              }
                            >
                              <span>+</span>
                              Add
                            </button>
                          ) : (
                            <div className="quantity-control">
                              <button
                                onClick={() =>
                                  removeFromCart(item)
                                }
                                aria-label={`Remove ${item.name}`}
                              >
                                −
                              </button>

                              <strong>
                                {quantity}
                              </strong>

                              <button
                                onClick={() =>
                                  addToCart(item)
                                }
                                aria-label={`Add another ${item.name}`}
                              >
                                +
                              </button>
                            </div>
                          )
                        ) : (
                          <span className="sold-out">
                            Sold out
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="bottom-marquee">
          <div>
            CANBOOK <span>✦</span> ORDER AHEAD{" "}
            <span>✦</span> SKIP THE QUEUE{" "}
            <span>✦</span> EAT HAPPY{" "}
            <span>✦</span>
          </div>
        </section>
      </main>

      {showCart && (
        <div
          className="modal-backdrop"
          onClick={() => setShowCart(false)}
        >
          <aside
            className="side-panel"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="panel-header">
              <div>
                <p className="eyebrow">YOUR ORDER</p>
                <h2>Cart.</h2>
              </div>

              <button
                className="close-button"
                onClick={() => setShowCart(false)}
              >
                ×
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="panel-empty">
                <div className="big-emoji">🛒</div>
                <h3>Your cart is empty.</h3>
                <p>
                  Go find something ridiculously
                  delicious.
                </p>

                <button
                  className="primary-button"
                  onClick={() =>
                    setShowCart(false)
                  }
                >
                  Browse menu
                </button>
              </div>
            ) : (
              <>
                <div className="cart-list">
                  {cartItems.map((item) => (
                    <div
                      className="cart-item"
                      key={item.id}
                    >
                      <div className="cart-item-emoji">
                        {item.emoji}
                      </div>

                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <p>
                          ₹{item.price} ×{" "}
                          {item.quantity}
                        </p>
                      </div>

                      <strong>
                        ₹{item.subtotal}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div>
                    <span>Items</span>
                    <strong>{cartCount}</strong>
                  </div>

                  <div className="total-row">
                    <span>Total</span>
                    <strong>₹{cartTotal}</strong>
                  </div>

                  <button
                    className="checkout-button"
                    onClick={placeOrder}
                  >
                    Place order
                    <span>→</span>
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {showOrders && (
        <div
          className="modal-backdrop"
          onClick={() => setShowOrders(false)}
        >
          <aside
            className="side-panel orders-panel"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="panel-header">
              <div>
                <p className="eyebrow">YOUR HISTORY</p>
                <h2>Orders.</h2>
              </div>

              <button
                className="close-button"
                onClick={() =>
                  setShowOrders(false)
                }
              >
                ×
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="panel-empty">
                <div className="big-emoji">✨</div>
                <h3>No orders yet.</h3>
                <p>
                  Your first canteen adventure
                  belongs here.
                </p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order, index) => {
                  const orderItems =
                    getOrderItems(order);

                  return (
                    <div
                      className="order-card"
                      key={
                        order.id ||
                        order.order_id ||
                        index
                      }
                    >
                      <div className="order-card-heading">
                        <div>
                          <span>
                            ORDER #
                            {order.id ||
                              order.order_id ||
                              index + 1}
                          </span>

                          <strong>
                            {formatDate(
                              order.created_at ||
                                order.date ||
                                order.createdAt
                            )}
                          </strong>
                        </div>

                        <span
                          className={`status-pill ${String(
                            order.status ||
                              "Pending"
                          )
                            .toLowerCase()
                            .replace(
                              /\s+/g,
                              "-"
                            )}`}
                        >
                          {order.status ||
                            "Pending"}
                        </span>
                      </div>

                      <div className="order-card-items">
                        {orderItems.map(
                          (item, itemIndex) => (
                            <div
                              key={itemIndex}
                            >
                              <span>
                                {item.quantity ||
                                  1}
                                ×{" "}
                                {item.name ||
                                  "Item"}
                              </span>

                              <strong>
                                ₹
                                {Number(
                                  item.price ||
                                    0
                                ) *
                                  Number(
                                    item.quantity ||
                                      1
                                  )}
                              </strong>
                            </div>
                          )
                        )}
                      </div>

                      <div className="order-total">
                        <span>Total</span>
                        <strong>
                          ₹
                          {order.total ||
                            order.amount ||
                            0}
                        </strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </aside>
        </div>
      )}

      {toast && (
        <div className="toast-message">
          <span>✦</span>
          {toast}
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/authcontext";
import { CartProvider } from "./context/cartcontext";
import App from "./app.jsx";
import "./styles/global.css";
import "./styles/app.css";
import "./styles/interactions.css";
import "./styles/motionui.css";
import "./styles/staffui.css";
import "./styles/refinements.css";
import "./styles/navbarfix.css";
import "./styles/install-mobile-fix.css";

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);

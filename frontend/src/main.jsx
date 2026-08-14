import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/authcontext";
import { CartProvider } from "./context/cartcontext";
import App from "./app.jsx";
import "./styles/global.css";
import "./styles/app.css";
import "./styles/interactions.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);

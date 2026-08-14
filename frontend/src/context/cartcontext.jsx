import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    if (!item || item.item_id === undefined || item.item_id === null) {
      console.error("addToCart called with invalid item:", item);
      return;
    }

    setCart((current) => {
      const existing = current.find(
        (cartitem) => cartitem.item_id === item.item_id
      );

      if (existing) {
        return current.map((cartitem) =>
          cartitem.item_id === item.item_id
            ? { ...cartitem, quantity: cartitem.quantity + 1 }
            : cartitem
        );
      }

      return [...current, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((current) => current.filter((item) => item.item_id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((current) =>
      current.map((item) =>
        item.item_id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, total, count, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
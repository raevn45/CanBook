import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/authcontext";
import { CartProvider } from "./context/cartcontext";
import AppRoutes from "./pages/routes/approutes";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

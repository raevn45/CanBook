import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./pages/routes/approutes";
import Navbar from "./components/layout/navbar";

function AppShell() {
  const location = useLocation();
  const isPublic = ["/", "/login", "/register"].includes(location.pathname);

  return (
    <>
      {!isPublic && <Navbar />}
      <AppRoutes />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

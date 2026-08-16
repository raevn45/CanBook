import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./pages/routes/approutes";
import Navbar from "./components/layout/navbar";
import InteractiveExperience from "./components/effects/interactiveexperience";
import "./styles/staff-ui.css";
import "./styles/force-menu-delete.css";
import "./styles/menu-edit.css";

function AppShell() {
  const location = useLocation();
  const isPublic = ["/", "/login", "/register"].includes(location.pathname);
  return <><InteractiveExperience />{!isPublic && <Navbar />}<AppRoutes /></>;
}
export default function App() { return <BrowserRouter><AppShell /></BrowserRouter>; }

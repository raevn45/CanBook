import AppRoutes from "./pages/routes/approutes";
import Navbar from "./components/layout/navbar";
import BackgroundGrid from "./components/effects/backgroundgrid";
import Scanlines from "./components/effects/scanlines";

export default function App() {
  return (
    <>
      <BackgroundGrid />
      <Scanlines />
      <Navbar />
      <main className="app-main">
        <AppRoutes />
      </main>
    </>
  );
}

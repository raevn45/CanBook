import { Routes, Route } from "react-router-dom";
import Landing from "../landing";
import Login from "../login";
import Register from "../register";
import StudentDashboard from "../student/studentdashboard";
import Menu from "../student/menu";
import CartPage from "../student/cartpage";
import Checkout from "../student/checkout";
import OrderSuccess from "../student/ordersuccess";
import MyOrders from "../student/myorders";
import Profile from "../student/profile";
import CanteenDashboard from "../canteen/canteendashboard";
import Orders from "../canteen/orders";
import DemandAnalytics from "../canteen/demandanalytics";
import MenuManagement from "../canteen/menumanagement";
import OrderDetails from "../canteen/orderdetails";
import ProtectedRoute from "./protectedroute";
import CanteenRoute from "./canteenroute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/student"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/menu"
        element={
          <ProtectedRoute>
            <Menu />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/success"
        element={
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/canteen"
        element={
          <CanteenRoute>
            <CanteenDashboard />
          </CanteenRoute>
        }
      />
      <Route
        path="/canteen/orders"
        element={
          <CanteenRoute>
            <Orders />
          </CanteenRoute>
        }
      />
      <Route
        path="/canteen/analytics"
        element={
          <CanteenRoute>
            <DemandAnalytics />
          </CanteenRoute>
        }
      />
      <Route
        path="/canteen/menu"
        element={
          <CanteenRoute>
            <MenuManagement />
          </CanteenRoute>
        }
      />
      <Route
        path="/canteen/orders/:id"
        element={
          <CanteenRoute>
            <OrderDetails />
          </CanteenRoute>
        }
      />
    </Routes>
  );
}

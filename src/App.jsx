import "./App.css";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Navbar from "./pages/components/Navbar";
import Footer from "./pages/components/Footer";
import SalesReport from "./pages/SalesReport";
import HomePage from "./pages/MainPage";
import AddCustomer from "./pages/AddCustomers";
import AddVendor from "./pages/AddVendore";
import AddProduct from "./pages/AddProduct";
import BillSettings from "./pages/BillSettings";
import DataBackup from "./pages/DataBackup";
import ProfilePage from "./pages/ProfilePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import PurchaseEntry from "./pages/PurchaseEntry";
import AddSale from "./pages/AddSale";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/main" element={<Index />} />
        <Route path="/sales" element={<SalesReport />} />
        <Route path="/add-sale-2" element={<PurchaseEntry />} />
        <Route path="/add-sale" element={<AddSale />} />
        <Route path="/add-customer" element={<AddCustomer />} />
        <Route path="/add-vendor" element={<AddVendor />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/bill-settings" element={<BillSettings />} />
        <Route path="/data-backup" element={<DataBackup />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

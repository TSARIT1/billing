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
import UploadProduct from "./pages/UploadProduct";
import SalesList from "./pages/SalesList";
import ContactUs from "./pages/components/ContactUs";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import PlanExpiredPage from "./pages/PlanExpired";
import TicketRaisePage from "./pages/TicketRaise";
import AdminFeedbackPanel from "./admin/AdminFeedbackPanel.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/main" element={<Index />} />
        <Route path="/sales" element={<SalesReport />} />
        <Route path="/add-sale" element={<PurchaseEntry />} />
        <Route path="/sale-list" element={<SalesList />} />
        <Route path="/add-sale-2" element={<AddSale />} />
        <Route path="/add-customer" element={<AddCustomer />} />
        <Route path="/add-vendor" element={<AddVendor />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/bill-settings" element={<BillSettings />} />
        <Route path="/data-backup" element={<DataBackup />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<UploadProduct />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/ticket-raise" element={<TicketRaisePage />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/admin/feedback" element={<AdminFeedbackPanel />} />

        <Route path="/expired" element={<PlanExpiredPage />} />

      </Routes>
      <Footer />
    </>
  );
}

export default App;



// Key Secret : CLYIdraH2UYkuwZWXwKFOQUD
// key id :  rzp_live_nLA9QGo9irYCMN
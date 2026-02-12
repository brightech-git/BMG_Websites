import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Account from "./pages/Account";
import FAQ from "./components/layouts/faq";
import { faqContent, languages } from "./components/layouts/faqContent";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Comingsoon from "./pages/Comingsoon";
import Contact from "./pages/Contact";
import ContactStore from "./pages/ContactStore";
import Error from "./pages/Error";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetailPage from "./pages/productDetail";
import ProductsPage from "./pages/productsPage";
import Wishlist from "./pages/Wishlist";

import PrivacyPolicy from "./pages/Policies/Privacy";
import CancellationReturnPolicy from "./pages/Policies/CancellationReturnPolicy";
import RefundPolicy from "./pages/Policies/RefundPolicy";
import TermsConditions from "./pages/Policies/TermsConditions";
import DeliveryShippingPolicy from "./pages/Policies/DeliveryAndShipping";
import WhyChooseUs from "./pages/Policies/WhyChooseUs";

import ForgotPassword from "./pages/ForgotPassword";
import Appointment from "./pages/virtualShop/Appointment";
import BangleSizeGuide from "./pages/SizeGuide/BangleSize";
import RingSizeGuide from "./pages/SizeGuide/RingSize";
import PaymentPage from "./pages/payment/Payment";
import PaymentStatus from "./pages/paymentStatus";

import SchemePrivacyPolicy from "./pages/SchemePrivacyPolicy";
import SupportPage from "./pages/SchemeSupport";
import Success from "./pages/Success";

import AccountPage from "./components/sections/account/Content";
import ChangePassword from "./components/sections/account/ChangePassword/ChangePassword";
import Orders from "./components/sections/account/Order/Order";
import OrderDetail from "./components/sections/account/OrderDetails/OrderDetails";
import AddressManager from "./components/sections/account/Address/AddressManager";
import Dashboard from "./components/sections/account/Dashboard/Dashboard";

import SchemePage from "./pages/scheme/Scheme";

import ScrollToTop from "./components/layouts/ScrolltoTop";
import NotificationModal from "./pages/notificationModal/NotificationModal";
import { OrderNotification } from "./components/layouts/ProductOrdersModal";
import PolicyPage from './pages/Policies/Risk Mitigation & Compliance Policy';
import PrivateRoute from "./route/UserPrivateRoute";
import MainHeaderLayout from "./component/layout/MainHeaderLayout";

import "./App.css";

function App() {
  const [showHome, setShowHome] = useState(true);

  return (
    <>
      <ScrollToTop />

      {showHome && (
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/scheme" element={<SchemePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/products-page" element={<ProductsPage />} />
          <Route path="/product-detail/:tagKey" element={<ProductDetailPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contactstore" element={<ContactStore />} />
          <Route path="/contactstore/success" element={<Success />} />
          <Route path="/coming-soon" element={<Comingsoon />} />

          <Route
            path="/faq"
            element={<FAQ languages={languages} content={faqContent} />}
          />

          {/* POLICY ROUTES */}
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/cancellation-return-policy" element={<CancellationReturnPolicy />} />
          <Route path="/risk-compliance-policy" element={<PolicyPage />} />

          <Route path="/delivery&shipping" element={<DeliveryShippingPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/why-choose-us" element={<WhyChooseUs />} />
          <Route path="/scheme-privacy" element={<SchemePrivacyPolicy />} />
          <Route path="/scheme-support" element={<SupportPage />} />

          {/* SIZE GUIDES */}
          <Route path="/bangle-size-guide" element={<BangleSizeGuide />} />
          <Route path="/ring-size-guide" element={<RingSizeGuide />} />

          {/* APPOINTMENT */}
          <Route path="/appointment" element={<Appointment />} />

          {/* 🔐 PROTECTED ROUTES */}
          <Route element={<PrivateRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/payment/:orderId" element={<PaymentPage />} />
            <Route path="/payment-success" element={<PaymentStatus />} />

          

              <Route path="/account" element={<AccountPage />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="orders" element={<Orders />} />
                <Route path="orderdetails/:id" element={<OrderDetail />} />
                <Route path="address" element={<AddressManager />} />
                <Route path="change-password" element={<ChangePassword />} />
              </Route>


          </Route>

          {/* 404 */}
          <Route path="*" element={<Error />} />
        </Routes>
      )}
    </>
  );
}

export default App;

import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./features/home/components/Home";
import About from "./features/about/components/About";
import FAQ from "./features/faq/components/FaqScreen";
import { faqContent, languages } from "./features/faq/constants/faqContent";
import Cart from "./features/cart/components/Cart";
import Checkout from "./features/checkout/components/Checkout";
import Contact from "./features/contact/components/Contact";
import ContactStore from "./features/contact/components/ContactStore";
import Error from "./features/error/components/Error";
import Login from "./features/auth/components/Login";
import Register from "./features/auth/components/Register";
import ProductDetailPage from "./features/catalog/components/productDetail";
import ProductsPage from "./features/catalog/components/productsPage";
import Wishlist from "./features/wishlist/components/Wishlist";

import PrivacyPolicy from "./features/policies/components/Privacy";
import CancellationReturnPolicy from "./features/policies/components/CancellationReturnPolicy";
import RefundPolicy from "./features/policies/components/RefundPolicy";
import TermsConditions from "./features/policies/components/TermsConditions";
import DeliveryShippingPolicy from "./features/policies/components/DeliveryAndShipping";
import WhyChooseUs from "./features/policies/components/WhyChooseUs";

import ForgotPassword from "./features/auth/components/ForgotPassword";
import Appointment from "./features/virtual-shopping/components/Appointment";
import BangleSizeGuide from "./features/size-guide/components/BangleSize";
import RingSizeGuide from "./features/size-guide/components/RingSize";
import PaymentPage from "./features/payment/components/Payment";
import PaymentStatus from "./features/payment/components/paymentStatus";

import SchemePrivacyPolicy from "./features/scheme/components/SchemePrivacyPolicy";
import SupportPage from "./features/scheme/components/SchemeSupport";
import Success from "./features/contact/components/Success";

import AccountPage from "./features/account/components/account/Content";
import ChangePassword from "./features/account/components/account/ChangePassword/ChangePassword";
import Orders from "./features/account/components/account/Order/Order";
import OrderDetail from "./features/account/components/account/OrderDetails/OrderDetails";
import AddressManager from "./features/account/components/account/Address/AddressManager";
import Dashboard from "./features/account/components/account/Dashboard/Dashboard";

import SchemePage from "./features/scheme/components/Scheme";

import ScrollToTop from "./components/layouts/ScrolltoTop";
import PolicyPage from './features/policies/components/Risk Mitigation & Compliance Policy';
import PrivateRoute from "./route/UserPrivateRoute";

import "./App.css";
import ReturnReplaceFlow from "./features/orders/components/return/Return";

function App() {
  return (
    <>
      <ScrollToTop />

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
          <Route path="/products-page/:tagKey" element={<ProductDetailPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contactstore" element={<ContactStore />} />
          <Route path="/contactstore/success" element={<Success />} />

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

              <Route path="/return" element={<ReturnReplaceFlow/>} />


          </Route>

          {/* 404 */}
          <Route path="*" element={<Error />} />
        </Routes>
    </>
  );
}

export default App;

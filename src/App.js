import React, { useEffect ,useState} from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Preloader
import Preloader from './components/layouts/Preloader';
// Pages
import Home from './components/pages/Home';
import About from './components/pages/About';
import Account from './components/pages/Account';
import Blogdetail from './components/pages/Blogdetail';
import Bloggrid from './components/pages/Bloggrid';
import Bloggridsidebar from './components/pages/Bloggridsidebar';
import Bloglist from './components/pages/Bloglist';
import Cart from './components/pages/Cart';
import Checkout from './components/pages/Checkout';
import Classification from './components/pages/Classification';
import Comingsoon from './components/pages/Comingsoon';
import Contact from './components/pages/Contact';
import Error from './components/pages/Error';
import Gallery from './components/pages/Gallery';
import Gallerytwo from './components/pages/Gallerytwo';
import Legal from './components/pages/Legal';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Shopdetail from './components/pages/Shopdetail';
import Shopleft from './components/pages/Shopleft';
import Team from './components/pages/Team';
import Typography from './components/pages/Typography';
import Wishlist from './components/pages/Wishlist';
import PrivacyPolicy from './components/pages/Policies/Privacy';
import PaymentPage from './components/pages/payment/Payment';

import CancellationReturnPolicy from './components/pages/Policies/CancellationReturnPolicy';
import RefundPolicy from './components/pages/Policies/RefundPolicy';
import TermsConditions from './components/pages/Policies/TermsConditions';
import PrivateRoute from './route/UserPrivateRoute';
import DeliveryShippingPolicy from './components/pages/Policies/DeliveryAndShipping';
import ForgotPassword from './components/pages/ForgotPassword';
import PaymentSuccess from './components/pages/PaymentSuccess';
import WhyChooseUs from "./components/pages/Policies/WhyChooseUs";
import Appointment from './components/pages/virtualShop/Appointment';
import BangleSizeGuide from './components/pages/SizeGuide/BangleSize';
import RingSizeGuide from './components/pages/SizeGuide/RingSize';
import RouteTracker from './routes/RouteTracker';
import ScrollToTop from './components/layouts/ScrolltoTop';
import AccountPage from './components/sections/account/Content';
import PolicyPage from './components/pages/Policies/Risk Mitigation & Compliance Policy';
import ReturnOrderFlow from './components/sections/account/orderReturn/ReturnOrder';
import NotificationModal from './components/pages/notificationModal/NotificationModal';


import MaintenanceLogin from './components/pages/MaintenanceLogin';
import PaymentFailure from './components/pages/PaymentFailure';
import PaymentStatus from './components/pages/paymentStatus';

function ScrollWatcher() {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('lastVisited', location.pathname);
    }
  }, [location, isAuthenticated]);

  return null;
}

function App() {

  const [showNotifModal, setShowNotifModal] = useState(false);
  const [notifData, setNotifData] = useState({ title: "", message: "" });

  const [hasAccess, setHasAccess] = useState(false);

  // 🔑 Function to trigger modal from anywhere
   const askNotification = (title, message) => {
    if (Notification.permission === "default") {
      setNotifData({ title, message });
      setShowNotifModal(true);
    }
  };



  useEffect(() => {
    const access = localStorage.getItem("maintenance_access");
    if (access === "true") {
      setHasAccess(true);
    }
  }, []);

  if (!hasAccess) {
    return <MaintenanceLogin onAccess={() => setHasAccess(true)} />;
  }
  
  return (
    <Router basename="/">
      {/* <Preloader /> */}
      <ScrollWatcher />
      <ScrollToTop />
      <NotificationModal
        show={showNotifModal}
        title={notifData.title}
        message={notifData.message}
        onClose={() => setShowNotifModal(false)}
      />
      <Switch>

        <Route exact path="/" component={Home} />
        <Route exact path="/home" component={Home} />
       
        <Route exact path="/about" component={About} />
        <PrivateRoute exact path="/account" component={Account} />
        <Route exact path="/blog-detail" component={Blogdetail} />
        <Route exact path="/blog-grid" component={Bloggrid} />
        <Route exact path="/blog-grid-sidebar" component={Bloggridsidebar} />
        <Route exact path="/blog-list" component={Bloglist} />
        <PrivateRoute exact path="/cart" component={Cart} />
        <PrivateRoute exact path="/checkout" component={Checkout} />
        <Route exact path="/classification" component={Classification} />
        <Route exact path="/coming-soon" component={Comingsoon} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/gallery" component={Gallery} />
        <Route exact path="/gallery-two" component={Gallerytwo} />
        <Route exact path="/legal" component={Legal} />


        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/forgot-password" component={ForgotPassword} />




        <Route exact path="/shop-detail/:sno" component={Shopdetail} />
        <Route exact path="/shop-left" component={Shopleft} />
        <Route exact path="/team" component={Team} />
        <Route exact path="/typography" component={Typography} />

        <PrivateRoute exact path="/wishlist" component={Wishlist} />

   
        <PrivateRoute exact path="/payment/:orderId" component={PaymentPage} />

        {/* <Route exact path="/AddressManager" component={AddressManager} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/orders" component={Order} />
        <Route exact path="/orderdetail/:orderId" component={OrderDetail} />
        <Route exact path="/change-password" component={ChangePassword} /> */}
        <Route path="/account" component={AccountPage} />
        <Route path="/return" component={ReturnOrderFlow} />


        <Route exact path="/privacypolicy" component={PrivacyPolicy} />
        <Route exact path="/risk-compliance policy" component={PolicyPage} />
        <Route exact path="/cancellation-return-policy" component={CancellationReturnPolicy} />
        <Route exact path="/delivery&shipping" component={DeliveryShippingPolicy} />
        <Route exact path="/refund-policy" component={RefundPolicy} />
        <Route exact path="/terms-conditions" component={TermsConditions} />
        <Route exact path="/why-choose-us" component={WhyChooseUs} />
        <Route exact path="/bangle-size-guide" component={BangleSizeGuide} />
        <Route exact path="/ring-size-guide" component={RingSizeGuide} />

        <Route exact path="/payment-success" component={PaymentStatus} />
        <Route exact path="/payment-failure" component={PaymentFailure} />
        <Route exact path="/appointment" component={Appointment} />
        
        {/* Catch-all route for 404 errors */}
        
        <Route component={Error} />
        <RouteTracker />
        
      </Switch>
    </Router>
  );
}

export default App;

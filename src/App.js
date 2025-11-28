import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// import Preloader from './components/layouts/Preloader';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Account from './components/pages/Account';
import FAQ from './components/layouts/faq';
import { faqContent, languages } from './components/layouts/faqContent';
// import Bloggrid from './components/pages/Bloggrid';
// import Bloggridsidebar from './components/pages/Bloggridsidebar';
// import Bloglist from './components/pages/Bloglist';
import Cart from './components/pages/Cart';
import Checkout from './components/pages/Checkout';
// import Classification from './components/pages/Classification';
import Comingsoon from './components/pages/Comingsoon';
import Contact from './components/pages/Contact';
import ContactStore from './components/pages/ContactStore';
import Error from './components/pages/Error';
// import Gallery from './components/pages/Gallery';
// import Gallerytwo from './components/pages/Gallerytwo';
// import Legal from './components/pages/Legal';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Shopdetail from './components/pages/Shopdetail';
import Shopleft from './components/pages/Shopleft';
// import Team from './components/pages/Team';
// import Typography from './components/pages/Typography';
import Wishlist from './components/pages/Wishlist';
import PrivacyPolicy from './components/pages/Policies/Privacy';
import PaymentPage from './components/pages/payment/Payment';
import CancellationReturnPolicy from './components/pages/Policies/CancellationReturnPolicy';
import RefundPolicy from './components/pages/Policies/RefundPolicy';
import TermsConditions from './components/pages/Policies/TermsConditions';
import PrivateRoute from './route/UserPrivateRoute';
import DeliveryShippingPolicy from './components/pages/Policies/DeliveryAndShipping';
import ForgotPassword from './components/pages/ForgotPassword';
// import PaymentSuccess from './components/pages/PaymentSuccess';
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
import Logo from "./assets/img/logo1.jpg";
import './App.css';
// import PageTransition from './components/layouts/PageTransition';
// import ProductOrdersModal from './components/layouts/ProductOrdersModal';
import { useAllOrders } from './hook/order/useOrderHistoryQuery';
import { OrderNotification } from './components/layouts/ProductOrdersModal';
import EnchantedHero from './assets/videos/EnchantedHero';
import UpdateMobileModal from './components/layouts/UpdateMobileModal';
import Success from './components/pages/Success';

function ScrollWatcher() {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.setItem('lastVisited', location.pathname);
    }
  }, [location, isAuthenticated]);

  return null;
}


function App() {
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [notifData, setNotifData] = useState({ title: "", message: "" });
  const [showHome, setShowHome] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // const [hasAccess, setHasAccess] = useState(false); // track maintenance login access
  // Order notification states
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [showOrderNotification, setShowOrderNotification] = useState(false);
  const [flattenedOrders, setFlattenedOrders] = useState([]);

  const { data: allOrders } = useAllOrders();


  // Flatten orders when allOrders changes
  useEffect(() => {
    if (allOrders?.orders) {
      const flattened = allOrders.orders.flatMap(order =>
        (Array.isArray(order.orderItems) ? order.orderItems : []).map(item => ({
          ...item,
          customerName: order.customerName,
          orderTime: order.orderTime
        }))
      );
      setFlattenedOrders(flattened);
    }
  }, [allOrders]);

  // Order notification cycle
  useEffect(() => {
    if (!flattenedOrders.length) return;

    let showTimer;
    let hideTimer;

    const startNotificationCycle = () => {
      // Show current order for 3 seconds
      setShowOrderNotification(true);

      showTimer = setTimeout(() => {
        // Hide for 5 seconds
        setShowOrderNotification(false);

        hideTimer = setTimeout(() => {
          // Move to next order
          setCurrentOrderIndex(prev => {
            const nextIndex = prev + 1;
            if (nextIndex >= flattenedOrders.length) {
              return 0; // Reset to first order
            }
            return nextIndex;
          });
        }, 10000); // 5 seconds hidden
      }, 3000); // 3 seconds visible
    };

    // Start the cycle
    startNotificationCycle();

    // Set up interval for continuous cycling
    const cycleInterval = setInterval(() => {
      if (flattenedOrders.length > 1) {
        startNotificationCycle();
      }
    }, 20000); // 8 seconds per complete cycle (3s show + 5s hide)

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearInterval(cycleInterval);
    };
  }, [flattenedOrders]);

  // Splash screen effect (your existing code)
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('splashShown');

    if (!alreadyShown) {
      setShowModal(true);
      const timer = setTimeout(() => {
        setShowModal(false);
        setShowHome(true);
        
        sessionStorage.setItem('splashShown', 'true');
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setShowHome(true);
    }
  }, []);

  const currentOrder = flattenedOrders[currentOrderIndex];

  // const handleAccess = () => {
  //   setHasAccess(true);
  // };

  // if (!hasAccess) {
  //   return <MaintenanceLogin onAccess={handleAccess} />;
  // }

  return (
    <Router basename="/">
      <UpdateMobileModal />
      <ScrollWatcher />
      <ScrollToTop />
      <NotificationModal
        show={showNotifModal}
        title={notifData.title}
        message={notifData.message}
        onClose={() => setShowNotifModal(false)}
      />

      {/* Order Notification */}
      <OrderNotification
        order={currentOrder}
        visible={showOrderNotification}
        onClose={() => setShowOrderNotification(false)}
      />

      {/* Splash screen only once */}
      {showModal && (
        <div className="splash-modal">
          <div className="splash-content">
            <img src={Logo} alt="Logo" className="splash-logo" />
            <div className="splash-loader"></div>
          </div>
        </div>
      )}

      {showHome && (
        // <PageTransition animation="fade">
          <Switch>

            {/* Your existing routes */}
            <Route exact path="/" component={Home} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/about" component={About} />
            <PrivateRoute exact path="/account" component={Account} />
          <Route path="/ContactUs" component={Contact} />

            {/* <Route exact path="/blog-detail" component={Blogdetail} />
            <Route exact path="/blog-grid" component={Bloggrid} />
            <Route exact path="/blog-grid-sidebar" component={Bloggridsidebar} />
            <Route exact path="/blog-list" component={Bloglist} /> */}


         

            {/* <Route exact path="/classification" component={Classification} /> */}
            {/* <Route exact path="/gallery" component={Gallery} />
            <Route exact path="/gallery-two" component={Gallerytwo} /> */}
            {/* <Route exact path="/legal" component={Legal} /> */}
          {/* <Route exact path="/team" component={Team} /> */}
          {/* <Route exact path="/typography" component={Typography} /> */}

          <PrivateRoute exact path="/cart" component={Cart} />
          <PrivateRoute exact path="/checkout" component={Checkout} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/product-detail/:sno" component={Shopdetail} />
            <Route exact path="/products-page" component={Shopleft} />
         

            <PrivateRoute exact path="/wishlist" component={Wishlist} />
            <PrivateRoute exact path="/payment/:orderId" component={PaymentPage} />
            <Route path="/account" component={AccountPage} />
            <Route path="/return" component={ReturnOrderFlow} />
            <Route exact path="/privacypolicy" component={PrivacyPolicy} />
            <Route exact path="/risk-compliance-policy" component={PolicyPage} />
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
            
            <Route exact path="/hero" component={EnchantedHero} />
            <Route exact path="/heros" component={UpdateMobileModal} />

          <Route
            exact
            path='/faq'
            render={() => <FAQ languages={languages} content={faqContent} />}
          />
          
          <Route exact path="/contactstore" component={ContactStore} />
          <Route exact path="/success" component={Success} />
            <Route component={Error} />
            <Route exact path="/coming-soon" component={Comingsoon} />
           
            <RouteTracker />
          </Switch>
        // </PageTransition>
      )}
    </Router>
  );
}

export default App;

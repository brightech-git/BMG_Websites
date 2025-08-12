import React, { useEffect } from 'react';
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
import Faq from './components/pages/Faq';
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
import AddressManager from './components/sections/account/Address/AddressManager';
import AccountSidebar from './components/sections/account/AccountSidebar/AccountSideBar';
import ChangePassword from './components/sections/account/ChangePassword/ChangePassword';
import Dashboard from './components/sections/account/Dashboard/Dashboard';
import Order from './components/sections/account/Order/Order';
import OrderDetail from './components/sections/account/OrderDetails/OrderDetails';
import CancellationReturnPolicy from './components/pages/Policies/CancellationReturnPolicy';
import RefundPolicy from './components/pages/Policies/RefundPolicy';
import TermsConditions from './components/pages/Policies/TermsConditions';
import PrivateRoute from './route/UserPrivateRoute';
import DeliveryShippingPolicy from './components/pages/Policies/DeliveryAndShipping';


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
  return (
    <Router basename="/bmgjewellers/">
      {/* <Preloader /> */}
      <ScrollWatcher />
      <Switch>
        <Route exact path="/" component={Home} />
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
        <Route exact path="/shop-detail/:sno" component={Shopdetail} />
        <Route exact path="/shop-left" component={Shopleft} />
        <Route exact path="/team" component={Team} />
        <Route exact path="/typography" component={Typography} />
        <PrivateRoute exact path="/wishlist" component={Wishlist} />
   
        <PrivateRoute exact path="/payment/:orderId" component={PaymentPage} />
        <Route exact path="/AddressManager" component={AddressManager} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/orders" component={Order} />
        <Route exact path="/orderdetail/:orderId" component={OrderDetail} />
        <Route exact path="/change-password" component={ChangePassword} />
        <Route path="/account" component={AccountSidebar} />

        <Route exact path="/privacypolicy" component={PrivacyPolicy} />
        <Route exact path="/cancellation-return-policy" component={CancellationReturnPolicy} />
        <Route exact path="/delivery&shipping" component={DeliveryShippingPolicy} />
        <Route exact path="/refund-policy" component={RefundPolicy} />
        <Route exact path="/terms-conditions" component={TermsConditions} />  
        
        {/* Catch-all route for 404 errors */}
        
        <Route component={Error} />
      </Switch>
    </Router>
  );
}

export default App;

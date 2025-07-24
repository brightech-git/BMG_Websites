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
      <Preloader />
      <ScrollWatcher />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/account" component={Account} />
        <Route exact path="/blog-detail" component={Blogdetail} />
        <Route exact path="/blog-grid" component={Bloggrid} />
        <Route exact path="/blog-grid-sidebar" component={Bloggridsidebar} />
        <Route exact path="/blog-list" component={Bloglist} />
        <Route exact path="/cart" component={Cart} />
        <Route exact path="/checkout" component={Checkout} />
        <Route exact path="/classification" component={Classification} />
        <Route exact path="/coming-soon" component={Comingsoon} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/faq" component={Faq} />
        <Route exact path="/gallery" component={Gallery} />
        <Route exact path="/gallery-two" component={Gallerytwo} />
        <Route exact path="/legal" component={Legal} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/shop-detail/:sno" component={Shopdetail} />
        <Route exact path="/shop-left" component={Shopleft} />
        <Route exact path="/team" component={Team} />
        <Route exact path="/typography" component={Typography} />
        <Route exact path="/wishlist" component={Wishlist} />
        <Route exact path="/privacypolicy" component={PrivacyPolicy} />
        <Route exact path="/payment/:orderId" component={PaymentPage} />
        <Route component={Error} />
      </Switch>
    </Router>
  );
}

export default App;

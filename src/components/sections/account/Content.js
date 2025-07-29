import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import AccountSidebar from './AccountSidebar/AccountSideBar';
import Dashboard from './Dashboard/Dashboard';
import Order from './Order/Order';
import AddressManager from './Address/AddressManager';
import WishlistSection from './Wishlist/Wishlist';
import CartSection from './Cart/Cart';
import ChangePassword from './ChangePassword/ChangePassword';
import './AccountStyles.css';

const AccountPage = () => {
  return (
    <div className="account-page-container">
      <div className="account-layout">
        <AccountSidebar />
        <main className="account-main-content">
          <Switch>
            <Route exact path="/account" render={() => <Redirect to="/account/dashboard" />} />
            <Route path="/account/dashboard" component={Dashboard} />
            <Route path="/account/orders" component={Order} />
            <Route path="/account/addresses" component={AddressManager} />
            <Route path="/account/wishlist" component={WishlistSection} />
            <Route path="/account/cart" component={CartSection} />
            <Route path="/account/security" component={ChangePassword} />
          </Switch>
        </main>
      </div>
    </div>
  );
};

export default AccountPage;
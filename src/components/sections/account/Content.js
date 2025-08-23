import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import AccountSidebar from "./AccountSidebar/AccountSideBar";
import Dashboard from "./Dashboard/Dashboard";
import Orders from "./Order/Order";
import AddressManager from "./Address/AddressManager";
import Wishlist from "../wishlist/Content";
import Cart from "../cart/Content";
import ChangePassword from "./ChangePassword/ChangePassword";
import "./AccountStyles.css";
import HeaderWithAuth from "../../layouts/HeaderWithAuth";
import Footertwo from "../../layouts/Footerthree";

const AccountPage = () => {
  return (
    <section className="account-with-header">
 
    <div className="account-container">
      <div className="account-layout">
        <div className="account-sidebar">
          <AccountSidebar />
        </div>
        <main className="account-content">
          <Switch>
            <Route
              exact
              path="/account"
              render={() => <Redirect to="/dashboard" />}
            />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/orders" component={Orders} />
            <Route path="/AddressManager" component={AddressManager} />
            {/* <Route path="/wishlist" component={Wishlist} />
            <Route path="/cart" component={Cart} /> */}
            <Route path="/change-password" component={ChangePassword} />
          </Switch>
        </main>
      </div>
    </div>

    </section>
  );
};

export default AccountPage;

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from '../../../redux/slices/userSlice';
import AccountSidebar from "./AccountSidebar/AccountSideBar";
import "./AccountStyles.css";
import { useHistory, Route, Switch } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import Orders from "./Order/Order";
import OrderDetail from "./OrderDetails/OrderDetails";
import AddressManager from "./Address/AddressManager";
import ChangePassword from "./ChangePassword/ChangePassword";
import './logout.css';
import Header from "../../layouts/HeaderWithAuth";
import Footertwo from "../../layouts/Footerthree";

const AccountPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const openLogoutModal = () => setIsModalOpen(true);
  const closeLogoutModal = () => setIsModalOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    history.push("/login");
    window.location.reload();
    closeLogoutModal();
  };

  return (
    <>
    <Header />
    <section className="account-with-header">
      <div className="account-container">
        <div className="account-layout">
          <div className="account-sidebar">
            <AccountSidebar openLogoutModal={openLogoutModal} />
          </div>
          <main className="account-content">

            <Switch>
              <Route exact path="/account/dashboard" component={Dashboard} />
              <Route exact path="/account/orders" component={Orders} />
                <Route path="/account/orderdetails" component={OrderDetail} />
              <Route exact path="/account/address" component={AddressManager} />
              <Route exact path="/account/change-password" component={ChangePassword} />
              <Route path="/account" component={Dashboard} /> {/* default */}
            </Switch>
          </main>
        </div>
      </div>

      {isModalOpen && (
        <div className="logout-modal-overlay" onClick={closeLogoutModal}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="logout-modal-header">
              <h2>Confirm Logout</h2>
            </div>
            <div className="logout-modal-body">
              <p>Are you sure you want to log out of your account?</p>
            </div>
            <div className="logout-modal-footer">
              <button className="cancel-btn" onClick={closeLogoutModal}>Cancel</button>
              <button className="logout-btn" onClick={handleLogout}>Log Out</button>
            </div>
          </div>
        </div>
      )}
    </section>
    <Footertwo/>
    </>
  );
};

export default AccountPage;

// Appointment.js
import React, { Component, Fragment } from 'react';
import MetaTags from "react-meta-tags";
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import Header from '../../layouts/HeaderWithAuth';
import Breadcrumbs from '../../layouts/Breadcrumbs';
import Footer from '../../layouts/Footerthree';
import AppointmentPage from './VirtualShop';

class Appointment extends Component {
    render() {
        const { location } = this.props;
        const { itemName, subItemName } = queryString.parse(location.search);

        return (
            <Fragment>
                <MetaTags>
                    <title>BMG - Virtual Appointment</title>
                    <meta name="description" content="Book your BMG virtual shopping appointment online." />
                </MetaTags>
                <Header />
                {/* Pass query params into breadcrumb just like ShopLeft */}
                <Breadcrumbs itemName={itemName || "Virtual"} subItemName={subItemName || "Appointment"} />
                <AppointmentPage />
                <Footer />
            </Fragment>
        );
    }
}

export default withRouter(Appointment);

import React, { Fragment, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import Header from '../layouts/HeaderWithAuth';
import Breadcrumb from '../layouts/Breadcrumbs';
import Instafeeds from '../layouts/Instafeeds';
import Footer from '../layouts/Footerthree';
import Content from '../sections/checkout/Content';

const Checkout = () => {
    const location = useLocation();
    const navigate = useHistory();

    const { state: checkoutPayload = {} } = location || {};
    const { items: initialCartItems = [], totalAmount: initialTotalAmount = 0 } = checkoutPayload;

    const hasItems = Array.isArray(initialCartItems) && initialCartItems.length > 0;

    useEffect(() => {
        if (!hasItems) {
            navigate.push('/');
        }
    }, [hasItems, navigate]);

    if (!hasItems) return null;

    return (
        <Fragment>
            <MetaTags>
                <title>Checkout</title>
                <meta name="description" content="#" />
            </MetaTags>
            <Header />
            {/* <Breadcrumb pages={"Checkout"} /> */}
            <Content />
            {/* <Instafeeds /> */}
            <Footer />
        </Fragment>
    );
};

export default Checkout;

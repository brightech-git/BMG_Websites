// src/pages/Checkout.jsx
import React, { Fragment, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../layouts/HeaderWithAuth';
import Footer from '../layouts/Footer';
import Content from '../sections/checkout/Content';
import { useDocumentMeta } from '../../utils/meta/useMeta';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // fallback from localStorage if page refreshed
    const storedPayload = JSON.parse(localStorage.getItem('checkoutPayload') || '{}');

    const { state: checkoutPayload = storedPayload } = location || {};
    const { items: initialCartItems = [], totalAmount: initialTotalAmount = 0 } = checkoutPayload;

    const hasItems = Array.isArray(initialCartItems) && initialCartItems.length > 0;

    // Redirect if no items
    useEffect(() => {
        if (!hasItems) {
            navigate('/', { replace: true });
        } else {
            // store in localStorage for page refresh
            localStorage.setItem('checkoutPayload', JSON.stringify(checkoutPayload));
        }
    }, [hasItems, navigate, checkoutPayload]);

    // Set page meta
    useDocumentMeta({
        title: 'Checkout',
        description: '#',
    });

    if (!hasItems) return null;
    console.log(initialCartItems, initialTotalAmount, 'initialTotalAmount')

    return (
        <Fragment>
            <Header />
            {/* <Breadcrumb pages={"Checkout"} /> */}
            <Content initialCartItems={initialCartItems} initialTotalAmount={initialTotalAmount} />
            <Footer />
        </Fragment>
    );
};

export default Checkout;

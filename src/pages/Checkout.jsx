// src/pages/Checkout.jsx
import React, { Fragment, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Content from '../components/sections/checkout/Content';
import { useDocumentMeta } from '../utils/meta/useMeta';


const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const storedPayload = JSON.parse(localStorage.getItem('checkoutPayload') || 'null');

    const checkoutPayload = location?.state || storedPayload;

    const {
        items: initialCartItems = [],
        totalAmount: initialTotalAmount = 0,
        shippingFee = 0,
        subtotal = 0
    } = checkoutPayload || {};

    const hasItems = Array.isArray(initialCartItems) && initialCartItems.length > 0;

    // 🔴 Immediate redirect (before render)
    if (!hasItems) {
        navigate('/', { replace: true });
        return null;
    }

    // Save payload for refresh
    useEffect(() => {
        localStorage.setItem('checkoutPayload', JSON.stringify(checkoutPayload));
    }, [checkoutPayload]);

    useDocumentMeta({
        title: 'Checkout',
        description: '#',
    });

    return (
        <Fragment>
            <Content initialCartItems={initialCartItems} subtotal={subtotal} />
        </Fragment>
    );
};


export default Checkout;

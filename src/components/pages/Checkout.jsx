// src/pages/Checkout.jsx
import React, { Fragment, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Footer from '../layouts/Footer';
import Content from '../sections/checkout/Content';
import { useDocumentMeta } from '../../utils/meta/useMeta';
import SmoothScroll from '../../components/layouts/SmoothScroll';


const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // fallback from localStorage if page refreshed
    const storedPayload = JSON.parse(localStorage.getItem('checkoutPayload') || '{}');

    const { state: checkoutPayload = storedPayload } = location || {};

    const { items: initialCartItems = [], totalAmount: initialTotalAmount = 0, shippingFee:shippingFee=0, subtotal:subtotal=0} = checkoutPayload;
    console.log(initialCartItems, initialTotalAmount, shippingFee, subtotal, 'checkoutPayload');

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

    return (
        <Fragment>
       
            <Content initialCartItems={initialCartItems} subtotal={subtotal} />
         

        </Fragment>
    );
};

export default Checkout;

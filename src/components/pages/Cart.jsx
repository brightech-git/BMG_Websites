// src/pages/Cart.jsx
import React, { Fragment } from 'react';
import Header from '../layouts/HeaderWithAuth';
import Breadcrumb from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/cart/Content';
import { useDocumentMeta } from '../../utils/meta/useMeta'; // relative import

const Cart = () => {
    // Set page title and meta description
    useDocumentMeta({
        title: 'BMG | Cart',
        description: '#',
    });

    return (
        <Fragment>
            <Header />
            <Breadcrumb pages={"Cart"} />
            <Content />
            <Footer />
        </Fragment>
    );
};

export default Cart;

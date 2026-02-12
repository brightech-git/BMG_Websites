// src/pages/Cart.jsx
import React, { Fragment } from 'react';
import Breadcrumbs from '../components/layouts/Breadcrumbs';
import Content from '../components/sections/cart/Content';
import { useDocumentMeta } from '../utils/meta/useMeta'; // relative import

const Cart = () => {
    // Set page title and meta description
    useDocumentMeta({
        title: 'BMG | Cart',
        description: '#',
    });

    return (
        <Fragment>
           
            <Breadcrumbs pages={"Cart"} />
            <Content />
           
        </Fragment>
    );
};

export default Cart;

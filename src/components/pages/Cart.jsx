// src/pages/Cart.jsx
import React, { Fragment } from 'react';
import Breadcrumb from '../layouts/Breadcrumbs';
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
           
            <Breadcrumb pages={"Cart"} />
            <Content />
           
        </Fragment>
    );
};

export default Cart;

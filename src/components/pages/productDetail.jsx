// Shopdetail.jsx
import React, { Fragment } from 'react';

import Header from '../layouts/HeaderWithAuth';
import Breadcrumb from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/shopdetail/Content';
import SmoothScroll from '../layouts/SmoothScroll';
import { useDocumentMeta } from '../../utils/meta/useMeta';

const ProductDetailPage = () => {
    // Set the page title and meta description
    useDocumentMeta({
        title: 'BMG | Shop Detail',
        description: '#',
    });

    return (
        <Fragment>
            <Header />
            <Breadcrumb pages="products-page" />
            <SmoothScroll>
                <Content />
            </SmoothScroll>
            <Footer />
        </Fragment>
    );
};

export default ProductDetailPage;

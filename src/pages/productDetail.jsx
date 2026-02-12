// Shopdetail.jsx
import React, { Fragment } from 'react';


import Breadcrumbs from '../components/layouts/Breadcrumbs';

import Content from '../components/sections/productInfo/Content';
import SmoothScroll from '../components/layouts/SmoothScroll';
import { useDocumentMeta } from '../utils/meta/useMeta';

const ProductDetailPage = () => {
    // Set the page title and meta description
    useDocumentMeta({
        title: 'BMG | Shop Detail',
        description: '#',
    });

    return (
        <Fragment>
       
            <Breadcrumbs pages="products-page" />
            <SmoothScroll>
                <Content />
            </SmoothScroll>

        </Fragment>
    );
};

export default ProductDetailPage;

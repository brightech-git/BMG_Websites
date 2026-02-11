// Shopdetail.jsx
import React, { Fragment } from 'react';


import Breadcrumb from '../layouts/Breadcrumbs';

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
       
            <Breadcrumb pages="products-page" />
            <SmoothScroll>
                <Content />
            </SmoothScroll>

        </Fragment>
    );
};

export default ProductDetailPage;

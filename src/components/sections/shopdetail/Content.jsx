// src/sections/shopdetail/Content.jsx
import React, { Fragment } from 'react';
import ProductInfo from './ProductInfo';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Content = () => {
    const { tagKey } = useParams();

    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    //console.log('Content isAuthenticated:', isAuthenticated); // Debug

    return (
        <Fragment>
            <ProductInfo tagKey={tagKey} Authenticated={isAuthenticated} />
        </Fragment>
    );
};

export default Content;

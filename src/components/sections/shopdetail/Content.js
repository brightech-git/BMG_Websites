// src/sections/shopdetail/Content.jsx
import React, { Fragment } from 'react';
import Shopinfo from './Shopinfo';
import Shoprelated from '../../layouts/Shoprelated';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Content = () => {
    const { sno } = useParams();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

    return (
        <Fragment>
            <Shopinfo sno={sno} Authenticated={isAuthenticated} />
            <Shoprelated />
        </Fragment>
    );
};

export default Content;

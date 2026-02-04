// src/pages/Login.jsx
import React, { Fragment } from 'react';
import Header from '../layouts/HeaderWithAuth';
import Footer from '../layouts/Footer';
import Content from '../sections/login/Content';
import { useDocumentMeta } from '../../utils/meta/useMeta';

const Login = () => {
    // Set the page title and meta description
    useDocumentMeta({
        title: 'BMG | Login',
        description: '#',
    });

    return (
        <Fragment>
            <Header />
            {/* <Breadcrumb breadcrumb={{pagename:'Login'}}/> */}
            <Content />
            <Footer />
        </Fragment>
    );
};

export default Login;

// src/pages/Register.jsx
import React, { Fragment } from 'react';
import Header from '../layouts/HeaderWithAuth';
import Footer from '../layouts/Footer';
import Content from '../sections/register/Content';
import { useDocumentMeta } from '../../utils/meta/useMeta'; // relative import

const Register = () => {
    // Set the page title and meta description
    useDocumentMeta({
        title: 'BMG | Register',
        description: '#',
    });

    return (
        <Fragment>
            <Header />
            {/* <Breadcrumb breadcrumb={{pagename:'Register'}}/> */}
            <Content />
            <Footer />
        </Fragment>
    );
};

export default Register;

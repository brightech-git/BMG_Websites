// src/pages/Contact.jsx
import React, { Fragment } from 'react';
import Header from '../layouts/HeaderWithAuth';
import Breadcrumb from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/contact/Content';
import { useDocumentMeta } from '../../utils/meta/useMeta'; // relative import

const Contact = () => {
    // Set the page title and meta description
    useDocumentMeta({
        title: 'Contact Us',
        description: '#',
    });

    return (
        <Fragment>
            <Header />
            {/* <Breadcrumb pages={"ContactUs"} /> */}
            <Content />
            <Footer />
        </Fragment>
    );
};

export default Contact;

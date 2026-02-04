// src/pages/About.jsx
import React, { Fragment } from 'react';
import Header from '../layouts/HeaderWithAuth';
import Breadcrumb from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footer';
import Content from '../sections/about/Content';
import { useDocumentMeta } from '../../utils/meta/useMeta'; // relative import

const About = () => {
    // Set page meta
    useDocumentMeta({
        title: 'About Us',
        description: '#',
    });

    return (
        <Fragment>
            <Header />
            <Breadcrumb pages="About Us" />
            <Content />
            <Footer />
        </Fragment>
    );
};

export default About;

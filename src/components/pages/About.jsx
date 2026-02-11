// src/pages/About.jsx
import React, { Fragment } from 'react';
import Breadcrumb from '../layouts/Breadcrumbs';
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
    
            <Breadcrumb pages="About Us" />
            <Content />
     
        </Fragment>
    );
};

export default About;

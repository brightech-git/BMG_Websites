// src/pages/About.jsx
import React, { Fragment } from 'react';
import Breadcrumbs from '../components/layouts/Breadcrumbs';
import Content from '../components/sections/about/Content';
import { useDocumentMeta } from '../utils/meta/useMeta'; // relative import

const About = () => {
    // Set page meta
    useDocumentMeta({
        title: 'About Us',
        description: '#',
    });

    return (
        <Fragment>
    
            <Breadcrumbs pages="About Us" />
            <Content />
     
        </Fragment>
    );
};

export default About;

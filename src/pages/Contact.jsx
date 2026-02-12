// src/pages/Contact.jsx
import React, { Fragment } from 'react';
import Content from '../components/sections/contact/Content';
import { useDocumentMeta } from '../utils/meta/useMeta';

const Contact = () => {
    // Set the page title and meta description
    useDocumentMeta({
        title: 'Contact Us',
        description: '#',
    });

    return (
        <Fragment>
    
          
            <Content />
    
        </Fragment>
    );
};

export default Contact;

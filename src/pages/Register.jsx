// src/pages/Register.jsx
import React, { Fragment } from 'react';
import Content from '../components/sections/register/Content';
import { useDocumentMeta } from '../utils/meta/useMeta';

const Register = () => {
    // Set the page title and meta description
    useDocumentMeta({
        title: 'BMG | Register',
        description: '#',
    });

    return (
        <Fragment>
            <Content />
        </Fragment>
    );
};

export default Register;

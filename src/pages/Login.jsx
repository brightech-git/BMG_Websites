// src/pages/Login.jsx
import React, { Fragment } from 'react';
import Content from '../components/sections/login/Content';
import { useDocumentMeta } from '../utils/meta/useMeta';

const Login = () => {
    // Set the page title and meta description
    useDocumentMeta({
        title: 'BMG | Login',
        description: '#',
    });

    return (
        <Fragment>
          
            <Content />
          
        </Fragment>
    );
};

export default Login;

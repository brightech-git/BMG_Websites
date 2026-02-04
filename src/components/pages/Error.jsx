// src/pages/Error.jsx
import React, { Fragment } from 'react';
import Content from '../sections/error/Content';
import { useDocumentMeta } from '../../utils/meta/useMeta'; // relative import

const Error = () => {
    // Set the page title and meta description
    useDocumentMeta({
        title: 'BMG | Error',
        description: '#',
    });

    return (
        <Fragment>
            <Content />
        </Fragment>
    );
};

export default Error;

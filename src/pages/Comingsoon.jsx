// src/pages/Comingsoon.jsx
import React, { Fragment } from 'react';
import Content from '../components/sections/comingsoon/Content';
import { useDocumentMeta } from '../utils/meta/useMeta'; // relative import

const Comingsoon = () => {
    // Set the page title and meta description
    useDocumentMeta({
        title: 'BMG | Coming Soon',
        description: '#',
    });

    return (
        <Fragment>
            <Content />
        </Fragment>
    );
};

export default Comingsoon;

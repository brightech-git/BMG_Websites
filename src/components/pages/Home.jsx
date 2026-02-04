// src/pages/Home.jsx
import React, { Fragment } from 'react';
import Content from '../sections/home/Content';
import { useDocumentMeta } from '../../utils/meta/useMeta'; // relative import

const Home = () => {
    // Set page meta
    useDocumentMeta({
        title: 'BMG | Homepage',
        description: '#',
    });

    return (
        <Fragment>
            {/* <Newsletter /> */}
            <Content />
        </Fragment>
    );
};

export default Home;

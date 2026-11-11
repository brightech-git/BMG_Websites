import React, { Fragment } from 'react';
import Content from './home/Content';
import { useDocumentMeta } from '../../../utils/meta/useMeta'; // relative import
// import SmoothScroll from '../../../components/layouts/SmoothScroll';

const Home = () => {
    // Set page meta
    useDocumentMeta({
        title: 'BMG | Homepage',
        description: '#',
    });

    return (
        <Fragment>
            {/* <SmoothScroll>  */}
                <Content />
            {/* </SmoothScroll>
            */}
        </Fragment>
    );
};

export default Home;

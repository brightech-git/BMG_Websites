import React, { Component, Fragment } from 'react';
import MetaTags from "react-meta-tags";
import Header from '../layouts/HeaderWithAuth';
import Breadcrumb from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footerthree';
import Content from '../sections/shopdetail/Content';
import SmoothScroll from '../layouts/SmoothScroll';

class Shopdetail extends Component {
    render() {
        return (
            <Fragment>
                <MetaTags>
                    <title>BMG | Shop Detail</title>
                    <meta
                        name="description"
                        content="#"
                    />
                </MetaTags>
                <Header />
                <Breadcrumb pages={"product-detail"} />
                <SmoothScroll>
                <Content />
                </SmoothScroll>
                <Footer />
            </Fragment>
        );
    }
}

export default Shopdetail;
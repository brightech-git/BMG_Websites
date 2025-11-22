// Shopleft.js
import React, { Component, Fragment } from 'react';
import MetaTags from "react-meta-tags";
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import Header from '../layouts/HeaderWithAuth';
import Breadcrumb from '../layouts/Breadcrumbs';
import Instafeeds from '../layouts/Instafeeds';
import Footer from '../layouts/Footerthree';
import Content from '../sections/shopleft/Content';
import SmoothScroll from '../layouts/SmoothScroll';

class Shopleft extends Component {
    render() {
        const { location } = this.props;
        const { itemCtrName } = queryString.parse(location.search); // ⬅️ parse query params
        console.log(itemCtrName,  'datas for breadcrumb')

        return (
            <Fragment>
                <MetaTags>
                    <title>BMG - Shop Left</title>
                    <meta name="description" content="#" />
                </MetaTags>
                <Header />

                {/* Pass query params to Breadcrumb */}
                <Breadcrumb itemCtrName={itemCtrName} pages="products-page" />
                <SmoothScroll>
                    <Content />
                </SmoothScroll>

                {/* <Instafeeds /> */}
                <Footer />
            </Fragment>
        );
    }
}

export default withRouter(Shopleft);

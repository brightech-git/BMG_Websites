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

class Shopleft extends Component {
    render() {
        const { location } = this.props;
        const { itemName, subItemName } = queryString.parse(location.search); // ⬅️ parse query params
        console.log(itemName, subItemName,'datas')

        return (
            <Fragment>
                <MetaTags>
                    <title>BMG - Shop Left</title>
                    <meta name="description" content="#" />
                </MetaTags>
                <Header />
                {/* Pass query params to Breadcrumb */}
                <Breadcrumb itemName={itemName} subItemName={subItemName}  pages={"Shop-left"} />
                <Content />
                {/* <Instafeeds /> */}
                <Footer />
            </Fragment>
        );
    }
}

export default withRouter(Shopleft);

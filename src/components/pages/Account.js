import React, { Component, Fragment } from 'react';
import MetaTags from "react-meta-tags";
import Header from '../layouts/HeaderWithAuth';
import Breadcrumb from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footerthree';
import Content from '../sections/account/Content';

class Account extends Component {
    render() {
        return (
            <Fragment>
                <MetaTags>
                    <title> Bmg- My Account</title>
                    <meta
                        name="account"
                        content="#"
                    />
                </MetaTags>
                {/* <Header/> */}
                {/* <Breadcrumb pages={"Account"} /> */}
                <Content/>
            
                {/* <Footer/> */}
            </Fragment>
        );
    }
}

export default Account;
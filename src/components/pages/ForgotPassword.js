import React, { Component, Fragment } from 'react';
import MetaTags from "react-meta-tags";
import Header from '../layouts/HeaderWithAuth';
import Breadcrumb from '../layouts/Breadcrumbs';
import Instafeeds from '../layouts/Instafeeds';
import Footer from '../layouts/Footerthree';
import ForgotPasswordContent from '../sections/home/forgot-password/Content';

class ForgotPassword extends Component {
    render() {
        return (
            <Fragment>
                <MetaTags>
                    <title>Bmg | Forgot Password</title>
                    <meta
                        name="description"
                        content="Reset your BMG account password"
                    />
                </MetaTags>
                <Header />
                <Breadcrumb breadcrumb={{ pagename: 'Forgot Password' }} />
                <ForgotPasswordContent />
                <Footer />
            </Fragment>
        );
    }
}

export default ForgotPassword;
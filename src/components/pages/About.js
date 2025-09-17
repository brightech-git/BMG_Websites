import React, { Component, Fragment } from 'react';
import MetaTags from "react-meta-tags";
import Header from '../layouts/HeaderWithAuth';
import Breadcrumb from '../layouts/Breadcrumbs';
import Instafeeds from '../layouts/Instafeeds';
import Footer from '../layouts/Footerthree';
import Content from '../sections/about/Content';

class About extends Component {
    render() {
        return (
            <Fragment>
                <MetaTags>
                    <title>About Us</title>
                    <meta
                        name="description"
                        content="#"
                    />
                </MetaTags>
                <Header/>
                <Breadcrumb pages={"About Us"} />
                <Content/>
                <Instafeeds/>
                <Footer/>
            </Fragment>
        );
    }
}

export default About;
import React, { Component, Fragment } from 'react';
import MetaTags from "react-meta-tags";
import Header from '../layouts/HeaderWithAuth';
import Breadcrumb from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footerthree';
import Content from '../sections/wishlist/Content';

class Wishlist extends Component {
    render() {
        return (
            <Fragment>
                <MetaTags>
                    <title>BMG | Wishlist</title>
                    <meta
                        name="description"
                        content="#"
                    />
                </MetaTags>
                <Header/>
                <Breadcrumb pages={"Whislist"}/>
                <Content/>
                <Footer/>
            </Fragment>
        );
    }
}

export default Wishlist;
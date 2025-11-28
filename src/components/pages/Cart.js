import React, { Component, Fragment } from 'react';
import MetaTags from "react-meta-tags";
import Header from '../layouts/HeaderWithAuth';
import Breadcrumb from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footerthree';
import Content from '../sections/cart/Content';

class Cart extends Component {
    render() {
        return (
            <Fragment>
                <MetaTags>
                    <title>BMG | Cart</title>
                    <meta
                        name="description"
                        content="#"
                    />
                </MetaTags>
                <Header/>
                <Breadcrumb pages={"Cart"} />
                <Content/>
      
                <Footer/>
            </Fragment>
        );
    }
}

export default Cart;
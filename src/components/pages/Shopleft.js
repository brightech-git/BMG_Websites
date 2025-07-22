import React, { Component, Fragment } from 'react';
import MetaTags from "react-meta-tags";
import Header from '../layouts/Header';
import Breadcrumb from '../layouts/Breadcrumbs';
import Instafeeds from '../layouts/Instafeeds';
import Footer from '../layouts/Footerthree';
import Content from '../sections/shopleft/Content';
import Filter from '../sections/Filter/Filter';

class Shopleft extends Component {
    render() {
        return (
            <Fragment>
                <MetaTags>
                    <title>BMG - Shop Left</title>
                    <meta
                        name="description"
                        content="#"
                    />
                </MetaTags>
                <Header/>
                <Breadcrumb breadcrumb={{pagename:'Shop Left'}}/>
                <Filter />
                <Content/>
                <Instafeeds/>
                <Footer/>
            </Fragment>
        );
    }
}

export default Shopleft;
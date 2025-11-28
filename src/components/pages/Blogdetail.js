import React, { Component, Fragment } from 'react';
import MetaTags from "react-meta-tags";
import Header from '../layouts/HeaderWithAuth';
import Breadcrumb from '../layouts/Breadcrumbs';

import Footer from '../layouts/Footerthree';
import Content from '../sections/blogdetail/Content';

class Blogdetail extends Component {
    render() {
        return (
            <Fragment>
                <MetaTags>
                    <title>BMG | Blog Detail</title>
                    <meta
                        name="description"
                        content="#"
                    />
                </MetaTags>
                <Header/>
                <Breadcrumb breadcrumb={{pagename:'Blog Detail'}}/>
                <Content/>
              
                <Footer/>
            </Fragment>
        );
    }
}

export default Blogdetail;
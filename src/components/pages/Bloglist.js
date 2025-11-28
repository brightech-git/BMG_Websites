import React, { Component, Fragment } from 'react';
import MetaTags from "react-meta-tags";
import Header from '../layouts/Header';
import Breadcrumb from '../layouts/Breadcrumbs';
import Footer from '../layouts/Footerthree';
import Content from '../sections/bloglist/Content';

class Bloglist extends Component {
    render() {
        return (
            <Fragment>
                <MetaTags>
                    <title>BMG | Blog List</title>
                    <meta
                        name="description"
                        content="#"
                    />
                </MetaTags>
                <Header/>
                <Breadcrumb breadcrumb={{pagename:'Blog List'}}/>
                <Content/>
     
                <Footer/>
            </Fragment>
        );
    }
}

export default Bloglist;
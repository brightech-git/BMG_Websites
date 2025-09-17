import React, { Component, Fragment } from 'react';
import MetaTags from "react-meta-tags";
import Header from '../layouts/HeaderWithAuth';
import Footer from '../layouts/Footerthree';
import Newsletter from '../layouts/Newsletter';
import Content from '../sections/home/Content';

class Home extends Component {
    render() {
        return (
            <Fragment>
                <MetaTags>
                    <title>BMG | Homepage</title>
                    <meta
                        name="description"
                        content="#"
                    />
                </MetaTags>
                {/* <Newsletter/> */}
        
                <Content/>
        
            </Fragment>
        );
    }
}

export default Home;
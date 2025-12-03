import React, { Component, Fragment } from 'react';
import MetaTags from "react-meta-tags";

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
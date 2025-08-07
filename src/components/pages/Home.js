import React, { Component, Fragment } from 'react';
<<<<<<< Updated upstream
import MetaTags from "react-meta-tags";
import Header from '../layouts/HeaderWithAuth';
=======
import Header from '../layouts/Header';
>>>>>>> Stashed changes
import Footer from '../layouts/Footerthree';
import Newsletter from '../layouts/Newsletter';
import Content from '../sections/home/Content';

class Home extends Component {
    render() {
        return (
            <Fragment>
<<<<<<< Updated upstream
                <MetaTags>
                    <title>BMG | Homepage</title>
                    <meta
                        name="description"
                        content="#"
                    />
                </MetaTags>
                {/* <Newsletter/> */}
                <Header/>
=======
                
                <Newsletter/>
                {/* <Header/> */}
>>>>>>> Stashed changes
                <Content/>
                {/* <Footer/> */}
            </Fragment>
        );
    }
}

export default Home;
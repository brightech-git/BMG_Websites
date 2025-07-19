// src/sections/shopdetail/Content.jsx
import React, { Component, Fragment } from 'react';
import Shopinfo from './Shopinfo';
import Shoprelated from '../../layouts/Shoprelated';
import { withRouter } from 'react-router-dom';

class Content extends Component {
    render() {
        const { sno } = this.props.match.params;

        return (
            <Fragment>
                <Shopinfo sno={sno} />
                <Shoprelated />
            </Fragment>
        );
    }
}

export default withRouter(Content);

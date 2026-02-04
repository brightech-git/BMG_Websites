// src/pages/Account.jsx
import React, { Fragment } from 'react';
import Content from '../sections/account/Content';
import { useDocumentMeta } from '../../utils/meta/useMeta'; // relative import

const Account = () => {
    // Set page meta
    useDocumentMeta({
        title: 'BMG - My Account',
        description: '#',
    });

    return (
        <Fragment>
            {/* If you want Header or Breadcrumb, you can uncomment */}
            {/* <Header /> */}
            {/* <Breadcrumb pages="Account" /> */}
            <Content />
            {/* <Footer /> */}
        </Fragment>
    );
};

export default Account;

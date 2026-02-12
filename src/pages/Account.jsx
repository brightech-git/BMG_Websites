// src/pages/Account.jsx
import React, { Fragment } from 'react';
import Content from '../components/sections/account/Content';
import { useDocumentMeta } from '../utils/meta/useMeta'; // relative import

const Account = () => {
    // Set page meta
    useDocumentMeta({
        title: 'BMG - My Account',
        description: '#',
    });

    return (
        <Fragment>
            <Content />
        </Fragment>
    );
};

export default Account;

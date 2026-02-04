import React, { Fragment } from 'react';
import Header from '../layouts/HeaderWithAuth';
import Footer from '../layouts/Footer';
import ForgotPasswordContent from '../sections/home/forgot-password/Content';
import { useDocumentMeta } from "../../utils/meta/useMeta";

const ForgotPassword = () => {
    // Set page title and description
    useDocumentMeta({
        title: "Bmg | Forgot Password",
        description: "Reset your BMG account password",
    });

    return (
        <Fragment>
            <Header />
            {/* <Breadcrumb breadcrumb={{ pagename: 'Forgot Password' }} /> */}
            <ForgotPasswordContent />
            <Footer />
        </Fragment>
    );
};

export default ForgotPassword;
